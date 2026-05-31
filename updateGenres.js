/**
 * Überschreibt Genres via genreAssigner (alte Heuristik).
 * Nach manuellem CSV-Import: npm run import-genres-csv verwenden, NICHT dieses Skript.
 * Usage: node updateGenres.js
 */
const fs = require('fs');
const path = require('path');
const { assignGenres } = require('./genreAssigner');

const LINEUP_PATH = path.join(__dirname, 'src', 'data', 'lineup.json');

function main() {
  console.log('🎵 Genre-Update für Tomorrowland W2 2026\n');

  if (!fs.existsSync(LINEUP_PATH)) {
    console.error('❌ Nicht gefunden:', LINEUP_PATH);
    console.error('   Bitte zuerst `npm run scrape` ausführen.');
    process.exit(1);
  }

  const lineup = JSON.parse(fs.readFileSync(LINEUP_PATH, 'utf-8'));
  const genreSet = new Set();
  let updated = 0;
  const samples = [];

  for (const day of Object.values(lineup.days)) {
    for (const act of day.acts) {
      const oldGenre = act.genre;
      const newGenres = assignGenres(act.name, act.stage);
      act.genre = newGenres;
      newGenres.forEach((g) => genreSet.add(g));
      updated++;

      const oldStr = Array.isArray(oldGenre) ? oldGenre.join(', ') : oldGenre;
      const newStr = newGenres.join(', ');
      if (oldStr !== newStr && samples.length < 8) {
        samples.push({ name: act.name, old: oldStr, new: newStr });
      }
    }
  }

  lineup.genres = [...genreSet].sort();
  lineup.meta = {
    ...lineup.meta,
    genresUpdatedAt: new Date().toISOString(),
    genreFormat: 'array',
  };

  fs.writeFileSync(LINEUP_PATH, JSON.stringify(lineup, null, 2), 'utf-8');

  console.log(`✅ ${updated} Acts aktualisiert`);
  console.log(`   ${lineup.genres.length} einzigartige Genres: ${lineup.genres.join(' · ')}`);
  console.log(`\n   Gespeichert: ${LINEUP_PATH}`);

  if (samples.length) {
    console.log('\n📋 Beispiel-Änderungen:');
    for (const s of samples) {
      console.log(`   ${s.name}`);
      console.log(`     alt: ${s.old}`);
      console.log(`     neu: ${s.new}`);
    }
  }

  const artbat = Object.values(lineup.days)
    .flatMap((d) => d.acts)
    .find((a) => a.name === 'Artbat');
  if (artbat) {
    console.log(`\n✓ Artbat: [${artbat.genre.join(', ')}]`);
  }
}

main();
