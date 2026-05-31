/**
 * Importiert Genres aus djs-genre-review.csv (id,name,day,stage,genres).
 * Genres: "Genre A | Genre B"
 * Usage: node importGenresFromCsv.js
 */
const fs = require("fs");
const path = require("path");

const CSV_PATH = path.resolve(
  process.argv[2] || path.join(__dirname, "djs-genre-review.csv")
);
const LINEUP_PATH = path.join(__dirname, "src", "data", "lineup.json");

function parseCsvLine(line) {
  const parts = line.split(",");
  if (parts.length < 5) return null;

  const id = parts[0].trim();
  const day = parts[parts.length - 3].trim();
  const stage = parts[parts.length - 2].trim();
  const genresRaw = parts[parts.length - 1].trim();
  const name = parts.slice(1, parts.length - 3).join(",").trim();

  const genres = genresRaw
    .split("|")
    .map((g) => g.trim())
    .filter(Boolean);

  return { id, name, day, stage, genres };
}

function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error("Missing:", CSV_PATH);
    process.exit(1);
  }

  const lines = fs
    .readFileSync(CSV_PATH, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const header = lines[0];
  if (!header.startsWith("id,")) {
    console.error("Expected CSV header id,name,day,stage,genres");
    process.exit(1);
  }

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i]);
    if (!row) {
      console.warn("Skip invalid line", i + 1, lines[i].slice(0, 60));
      continue;
    }
    rows.push(row);
  }

  const genreById = new Map(rows.map((r) => [r.id, r.genres]));
  const lineup = JSON.parse(fs.readFileSync(LINEUP_PATH, "utf8"));

  let updated = 0;
  let missing = 0;
  const genreSet = new Set();

  for (const day of Object.values(lineup.days)) {
    for (const act of day.acts) {
      if (!genreById.has(act.id)) {
        missing++;
        getGenresFromAct(act).forEach((g) => genreSet.add(g));
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
    genreFormat: "array",
    genreSource: "manual-csv-import",
  };

  fs.writeFileSync(LINEUP_PATH, JSON.stringify(lineup, null, 2));

  console.log(`CSV rows: ${rows.length}`);
  console.log(`Updated acts: ${updated}`);
  if (missing) console.warn(`Acts not in CSV (unchanged): ${missing}`);
  console.log(`Unique genres (${lineup.genres.length}):`);
  console.log(lineup.genres.join("\n"));
}

function getGenresFromAct(act) {
  if (!act?.genre) return [];
  return Array.isArray(act.genre) ? act.genre : [act.genre];
}

main();
