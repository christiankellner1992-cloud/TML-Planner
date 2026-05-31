/** Normalisiert genre-Feld (String legacy oder Array) zu string[] */
export function getGenres(act) {
  if (!act?.genre) return [];
  const raw = Array.isArray(act.genre) ? act.genre : [act.genre];
  return raw.map((g) => String(g).trim()).filter(Boolean);
}

export function actMatchesGenre(act, genreFilter) {
  if (!genreFilter?.trim()) return true;
  const filter = genreFilter.trim();
  return getGenres(act).some((g) => g === filter);
}

export function actMatchesGenreSearch(act, query) {
  return getGenres(act).some((g) => g.toLowerCase().includes(query));
}

export function formatGenres(act, separator = ', ') {
  return getGenres(act).join(separator);
}
