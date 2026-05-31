/**
 * Tomorrowland Belgium 2026 W2 Lineup Scraper
 * Usage: node scraper.js
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { assignGenres } = require('./genreAssigner');

const DAYS = [
  {
    id: 'friday',
    date: '2026-07-24',
    label: 'Freitag, 24. Juli',
    url: 'https://belgium.tomorrowland.com/en/line-up/?day=2026-07-24',
    dayButton: /fri\s*24/i,
  },
  {
    id: 'saturday',
    date: '2026-07-25',
    label: 'Samstag, 25. Juli',
    url: 'https://belgium.tomorrowland.com/en/line-up/?day=2026-07-25',
    dayButton: /sat\s*25/i,
  },
  {
    id: 'sunday',
    date: '2026-07-26',
    label: 'Sonntag, 26. Juli',
    url: 'https://belgium.tomorrowland.com/en/line-up/?day=2026-07-26',
    dayButton: /sun\s*26/i,
  },
];

const OUTPUT_PATH = path.join(__dirname, 'src', 'data', 'lineup.json');

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function makeArtistId(dayId, stage, name) {
  return `${dayId}--${slugify(stage)}--${slugify(name)}`;
}

async function acceptCookies(page) {
  try {
    await page.waitForSelector('.cookiebanner__buttons__accept', { timeout: 8000 });
    await page.click('.cookiebanner__buttons__accept');
    await new Promise((r) => setTimeout(r, 500));
  } catch (_) {
    /* banner may already be dismissed */
  }
}

async function selectWeek2(page) {
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(
      (b) => b.textContent?.trim() === 'Week 2'
    );
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 1500));
}

async function selectDay(page, dayRegex) {
  await page.evaluate((patternSource) => {
    const pattern = new RegExp(patternSource, 'i');
    const btn = [...document.querySelectorAll('button')].find((b) =>
      pattern.test(b.textContent?.trim() || '')
    );
    btn?.click();
  }, dayRegex.source);
  await new Promise((r) => setTimeout(r, 2000));
}

async function scrapeActsFromPage(page) {
  return page.evaluate(() => {
    const skipArtist = (name) =>
      !name ||
      /^(more to be announced|to be announced)$/i.test(name) ||
      /^hosted by$/i.test(name);

    const masonryItems = [...document.querySelectorAll('[class*="masonryItem"]')];
    const results = [];

    for (const item of masonryItems) {
      let stage = '';
      let hostedBy = null;

      const textNodes = [...item.querySelectorAll('h2, h3, h4, p, span, div, strong')];
      for (const el of textNodes) {
        const t = (el.textContent || '').trim();
        if (el.children.length > 0) continue;

        if (/^HOSTED BY/i.test(t)) {
          hostedBy = t.replace(/^HOSTED BY\s*/i, '').trim();
          continue;
        }

        if (
          t.length >= 3 &&
          t.length <= 55 &&
          /^[A-Z0-9][A-Z0-9\s&.'®-]+$/i.test(t) &&
          !/more to be announced|to be announced|stages|artists|week/i.test(t)
        ) {
          if (!stage || t.length < stage.length) {
            if (t === t.toUpperCase() || t.includes('STAGE') || t.includes('BY ')) {
              stage = t.toUpperCase();
            }
          }
        }
      }

      if (!stage) {
        const heading = item.querySelector('h2, h3, h4');
        stage = (heading?.textContent || 'UNKNOWN STAGE').trim().toUpperCase();
      }

      const artists = [...item.querySelectorAll('li[class*="_item_"]')]
        .map((li) => li.textContent?.trim())
        .filter((name) => !skipArtist(name));

      for (const name of artists) {
        results.push({ name, stage, hostedBy });
      }
    }

    return results;
  });
}

async function scrapeDay(browser, dayConfig) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  console.log(`\n📅 Scrape ${dayConfig.label} …`);
  console.log(`   ${dayConfig.url}`);

  await page.goto(dayConfig.url, { waitUntil: 'networkidle2', timeout: 120000 });
  await acceptCookies(page);
  await new Promise((r) => setTimeout(r, 2000));
  await selectWeek2(page);
  await selectDay(page, dayConfig.dayButton);

  const rawActs = await scrapeActsFromPage(page);
  await page.close();

  const acts = rawActs.map((act) => {
    const id = makeArtistId(dayConfig.id, act.stage, act.name);
    const genre = assignGenres(act.name, act.stage);
    return {
      id,
      name: act.name,
      stage: act.stage,
      hostedBy: act.hostedBy,
      day: dayConfig.id,
      date: dayConfig.date,
      dayLabel: dayConfig.label,
      genre,
    };
  });

  const unique = [];
  const seen = new Set();
  for (const act of acts) {
    if (seen.has(act.id)) continue;
    seen.add(act.id);
    unique.push(act);
  }

  console.log(`   ✓ ${unique.length} Acts gefunden`);
  return unique;
}

async function main() {
  console.log('🎪 Tomorrowland 2026 W2 Lineup Scraper\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const days = {};
  const allActs = [];
  const stages = new Set();
  const genres = new Set();

  try {
    for (const dayConfig of DAYS) {
      const acts = await scrapeDay(browser, dayConfig);
      days[dayConfig.id] = {
        id: dayConfig.id,
        date: dayConfig.date,
        label: dayConfig.label,
        acts,
      };
      allActs.push(...acts);
      acts.forEach((a) => {
        stages.add(a.stage);
        for (const g of a.genre) genres.add(g);
      });
    }
  } finally {
    await browser.close();
  }

  const lineup = {
    meta: {
      festival: 'Tomorrowland Belgium 2026',
      weekend: 'Week 2',
      scrapedAt: new Date().toISOString(),
      source: 'https://belgium.tomorrowland.com/en/line-up/',
      totalActs: allActs.length,
    },
    days,
    stages: [...stages].sort(),
    genres: [...genres].sort(),
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(lineup, null, 2), 'utf-8');

  console.log('\n✅ Gespeichert:', OUTPUT_PATH);
  console.log(`   Gesamt: ${allActs.length} Acts über 3 Tage`);
  console.log(`   Stages: ${stages.size} | Genres: ${genres.size}`);
}

main().catch((err) => {
  console.error('❌ Scraper fehlgeschlagen:', err);
  process.exit(1);
});
