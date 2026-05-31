/**
 * Liest bearbeitete djs-genre-review.json und schreibt Genres zurück nach lineup.json.
 * Usage: node importGenresFromReview.js
 */
const fs = require("fs");
const path = require("path");

const REVIEW_PATH = path.join(__dirname, "djs-genre-review.json");
const LINEUP_PATH = path.join(__dirname, "src", "data", "lineup.json");

const review = JSON.parse(fs.readFileSync(REVIEW_PATH, "utf8"));
const lineup = JSON.parse(fs.readFileSync(LINEUP_PATH, "utf8"));

const genreById = new Map(
  review.artists.map((a) => [a.id, Array.isArray(a.genres) ? a.genres : []])
);

const genreSet = new Set();
let updated = 0;
for (const day of Object.values(lineup.days)) {
  for (const act of day.acts) {
    if (!genreById.has(act.id)) {
      (Array.isArray(act.genre) ? act.genre : [act.genre])
        .filter(Boolean)
        .forEach((g) => genreSet.add(g));
      continue;
    }
    act.genre = genreById.get(act.id);
    act.genre.forEach((g) => genreSet.add(g));
    updated++;
  }
}

lineup.genres = [...genreSet].sort((a, b) => a.localeCompare(b));
lineup.meta = {
  ...lineup.meta,
  genresUpdatedAt: new Date().toISOString(),
  genreSource: "manual-json-import",
};

fs.writeFileSync(LINEUP_PATH, JSON.stringify(lineup, null, 2));
console.log(`Updated genres for ${updated} acts in ${LINEUP_PATH}`);
console.log(`${lineup.genres.length} unique genres in filter list`);
