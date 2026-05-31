/** Normalisiert genre-Feld (String legacy oder Array) zu string[] */
export function getGenres(act) {
  if (!act?.genre) return [];
  return Array.isArray(act.genre) ? act.genre : [act.genre];
}

export function actMatchesGenre(act, genreFilter) {
  if (!genreFilter) return true;
  return getGenres(act).includes(genreFilter);
}

export function actMatchesGenreSearch(act, query) {
  return getGenres(act).some((g) => g.toLowerCase().includes(query));
}

export function formatGenres(act, separator = ', ') {
  return getGenres(act).join(separator);
}
