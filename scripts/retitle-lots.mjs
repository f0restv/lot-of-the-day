/**
 * Rebrands every lot's name into a short, evocative title that doesn't
 * echo the source listing's wording. Generates "{Place} {Vibe}" with
 * directional or poetic prefixes for collisions, so 23 Deming lots get
 * 23 distinct titles ("Deming Mesa", "South Deming Range", "Wild Deming
 * Acres", etc.).
 *
 * Saves the source title to lot.sourceName the first time it runs.
 * Photos' alt text is updated to match the new title. Tagline, description,
 * and structured data are untouched.
 *
 * Run after any scrape: `node scripts/retitle-lots.mjs`
 * Idempotent — running twice produces the same titles.
 */

import { readFileSync, writeFileSync } from "fs";

const LOTS_PATH = "src/data/lots.json";

const PLACE_PREFIXES = ["North", "South", "East", "West", "Upper", "Lower"];
const POETIC_PREFIXES = [
  "Wild", "Quiet", "Hidden", "Open", "Big Sky", "Lone Pine",
  "Sage", "Stone", "High Desert", "Dusty",
];

const VIBES_LARGE = ["Ranch", "Range", "Spread", "Reserve", "Acres", "Pasture"];
const VIBES_MID = ["Mesa", "Ridge", "Reserve", "Homestead", "Acreage", "Range"];
const VIBES_SMALL = ["Parcel", "Homesite", "Retreat", "Acre", "Hollow", "Stake"];
const VIBES_TINY = ["Lot", "Plot", "Hideaway", "Stake", "Camp", "Perch"];

const VIBES_VIEW = ["Mesa", "Ridge", "Overlook", "Vista", "Bluff"];
const VIBES_UTIL = ["Homesite", "Homestead", "Build", "Outpost"];
const VIBES_RV = ["Camp", "Basecamp", "Pull-In"];
const VIBES_FREE = ["Wilds", "Open Range", "Frontier"];
const VIBES_WATER = ["Shore", "Cove", "Bend", "Banks"];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function buildVibePool(lot) {
  const acres = lot.acreage || 0;
  let pool;
  if (acres >= 20) pool = [...VIBES_LARGE];
  else if (acres >= 10) pool = [...VIBES_MID];
  else if (acres >= 5) pool = [...VIBES_MID, ...VIBES_SMALL];
  else if (acres >= 1) pool = [...VIBES_SMALL];
  else pool = [...VIBES_TINY];

  const sourceText = [(lot.sourceName || lot.name || ""), (lot.features || []).join(" ")]
    .join(" ")
    .toLowerCase();

  if (/great views|vista|scenic|huge views|view/i.test(sourceText)) pool.unshift(...VIBES_VIEW);
  if (/power|water|sewer|utilit/i.test(sourceText)) pool.unshift(...VIBES_UTIL);
  if (/\brv\b/i.test(sourceText)) pool.unshift(...VIBES_RV);
  if (/no restrict|unrestricted/i.test(sourceText)) pool.unshift(...VIBES_FREE);
  if (/lake|river|creek|shore|pond/i.test(sourceText)) pool.unshift(...VIBES_WATER);

  return [...new Set(pool)];
}

function placeAnchor(lot) {
  return lot.location.city || lot.location.county || lot.location.state || "Wild";
}

function generateTitle(lot, used) {
  const anchor = placeAnchor(lot);
  const pool = buildVibePool(lot);
  const h = hash(lot.id);

  // Pass 1: plain "{anchor} {vibe}" rotated by id hash.
  for (let i = 0; i < pool.length; i++) {
    const candidate = `${anchor} ${pool[(h + i) % pool.length]}`;
    if (!used.has(candidate)) return candidate;
  }

  // Pass 2: directional prefix.
  for (let pi = 0; pi < PLACE_PREFIXES.length; pi++) {
    for (let vi = 0; vi < pool.length; vi++) {
      const candidate = `${PLACE_PREFIXES[(h + pi) % PLACE_PREFIXES.length]} ${anchor} ${pool[(h + vi) % pool.length]}`;
      if (!used.has(candidate)) return candidate;
    }
  }

  // Pass 3: poetic prefix.
  for (let pi = 0; pi < POETIC_PREFIXES.length; pi++) {
    for (let vi = 0; vi < pool.length; vi++) {
      const candidate = `${POETIC_PREFIXES[(h + pi) % POETIC_PREFIXES.length]} ${anchor} ${pool[(h + vi) % pool.length]}`;
      if (!used.has(candidate)) return candidate;
    }
  }

  // Last resort: append acreage so it's at least unique.
  const acres = lot.acreage ? `${lot.acreage} ac` : `Lot ${lot.id.replace(/^lot-/, "")}`;
  return `${anchor} ${pool[0] || "Parcel"} · ${acres}`;
}

function main() {
  const lots = JSON.parse(readFileSync(LOTS_PATH, "utf8"));

  // Preserve source titles on first run.
  for (const lot of lots) {
    if (!lot.sourceName) lot.sourceName = lot.name;
  }

  // Process in input order so the hash-rotation is deterministic.
  const used = new Set();
  let renamed = 0;
  for (const lot of lots) {
    const newTitle = generateTitle(lot, used);
    used.add(newTitle);
    if (lot.name !== newTitle) {
      lot.name = newTitle;
      renamed++;
    }
    if (lot.media && lot.media.photos) {
      for (const p of lot.media.photos) p.alt = newTitle;
    }
  }

  writeFileSync(LOTS_PATH, JSON.stringify(lots, null, 2) + "\n");
  console.log(`Renamed ${renamed} of ${lots.length} lots`);

  // Show a varied sample.
  const sampleIdx = [0, 10, 20, 35, 50, 70, 90, 110, 130, lots.length - 1];
  console.log("\nSample new titles:");
  for (const i of sampleIdx) {
    const l = lots[i];
    if (!l) continue;
    console.log(`  ${l.id} (${l.location.city || l.location.county || l.location.state}, ${l.acreage}ac)`);
    console.log(`    new: ${l.name}`);
    console.log(`    was: ${l.sourceName}`);
  }
}

main();
