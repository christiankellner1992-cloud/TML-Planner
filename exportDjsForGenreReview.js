/**
 * Exportiert alle DJs mit Genre-Zuordnung für externe Review (z. B. Gemini).
 * Usage: node exportDjsForGenreReview.js
 */
const fs = require("fs");
const path = require("path");

const LINEUP_PATH = path.join(__dirname, "src", "data", "lineup.json");
const OUT_PATH = path.join(__dirname, "djs-genre-review.json");

const lineup = JSON.parse(fs.readFileSync(LINEUP_PATH, "utf8"));
const allowedGenres =
  lineup.genres?.length > 0
    ? lineup.genres
    : [
        "Melodic Techno",
        "Techno",
        "Hard Techno",
        "Hardstyle",
        "Tech House",
        "Deep House",
        "Big Room / EDM",
        "Drum & Bass",
        "Psytrance",
      ];

const artists = Object.values(lineup.days)
  .flatMap((d) =>
    d.acts.map((a) => ({
      id: a.id,
      name: a.name,
      day: a.day,
      stage: a.stage,
      genres: Array.isArray(a.genre) ? a.genre : a.genre ? [a.genre] : [],
    }))
  )
  .sort(
    (a, b) =>
      a.day.localeCompare(b.day) ||
      a.stage.localeCompare(b.stage) ||
      a.name.localeCompare(b.name)
  );

const out = {
  meta: {
    purpose:
      "Genre review – edit only the genres field per artist; keep id unchanged",
    festival: "Tomorrowland Belgium 2026 Week 2",
    totalArtists: artists.length,
    allowedGenres,
    genreFormat: 'array of strings, e.g. ["Melodic Techno", "Techno"]',
    reimportCommand: "node importGenresFromReview.js",
  },
  artists,
};

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));

const csvPath = path.join(__dirname, "djs-genre-review.csv");
const csvHeader = "id,name,day,stage,genres";
const csvRows = artists.map((a) => {
  const genres = a.genres.join(" | ");
  const esc = (s) => `"${String(s).replace(/"/g, '""')}"`;
  return [esc(a.id), esc(a.name), esc(a.day), esc(a.stage), esc(genres)].join(",");
});
fs.writeFileSync(csvPath, [csvHeader, ...csvRows].join("\n"), "utf8");

console.log(`Exported ${artists.length} artists → ${OUT_PATH}`);
console.log(`CSV table → ${csvPath}`);
