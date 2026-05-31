import { getGenres } from './genre';

/**
 * Intelligente Set-Empfehlungen für denselben Festival-Tag.
 * Gewichtet Genre-Profil, Stage-Nähe und Stil-Keywords.
 */
export function getRecommendations(allActs, selectedIds, limit = 8) {
  if (!selectedIds.length) return [];

  const selected = allActs.filter((a) => selectedIds.includes(a.id));
  const genreWeights = {};
  const stageSet = new Set(selected.map((a) => a.stage));
  const selectedSet = new Set(selectedIds);

  for (const act of selected) {
    for (const genre of getGenres(act)) {
      genreWeights[genre] = (genreWeights[genre] || 0) + 1;
    }
  }

  const topGenre = Object.entries(genreWeights).sort((a, b) => b[1] - a[1])[0]?.[0];

  const scored = allActs
    .filter((a) => !selectedSet.has(a.id))
    .map((act) => {
      const reasons = [];
      let score = 0;
      const actGenres = getGenres(act);

      let genreMatch = 0;
      for (const g of actGenres) {
        genreMatch = Math.max(genreMatch, genreWeights[g] || 0);
      }
      if (genreMatch > 0) {
        score += genreMatch * 2;
        const matched = actGenres.find((g) => genreWeights[g]) || actGenres[0];
        reasons.push(`Passt zu ${matched}`);
      }

      if (stageSet.has(act.stage)) {
        score += 1.5;
        reasons.push(`Gleiche Stage: ${act.stage}`);
      }

      if (topGenre && actGenres.includes(topGenre)) {
        score += 0.5;
        if (!reasons.some((r) => r.startsWith('Passt'))) {
          reasons.push(`Top-Genre heute: ${topGenre}`);
        }
      }

      const styleBonus = getStyleAffinity(selected, act);
      if (styleBonus > 0) {
        score += styleBonus;
        reasons.push('Ähnlicher DJ-Stil');
      }

      return { act, score, reasons: reasons.slice(0, 2) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const seen = new Set();
  const result = [];
  for (const item of scored) {
    if (seen.has(item.act.id)) continue;
    seen.add(item.act.id);
    result.push(item);
    if (result.length >= limit) break;
  }

  return result;
}

function getStyleAffinity(selected, candidate) {
  const tokens = (name) =>
    name
      .toLowerCase()
      .split(/[\s,b2b&+()]+/)
      .filter((t) => t.length > 2);

  const selectedTokens = new Set(selected.flatMap((a) => tokens(a.name)));
  const overlap = tokens(candidate.name).filter((t) => selectedTokens.has(t)).length;
  return overlap > 0 ? 0.8 : 0;
}
