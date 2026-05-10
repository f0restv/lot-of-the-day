/**
 * One-shot: walks the GLS listings index, matches each property URL back
 * to an entry in src/data/lots.json by title, and writes `sourceUrl` +
 * `active: true` into the existing data. Run this once after deploying
 * the verify-active mechanism so it has source URLs to check against.
 *
 * Usage: node scripts/backfill-source-urls.mjs
 */

import { readFileSync, writeFileSync } from "fs";

const BASE = "https://www.governmentlandsales.us";
const PER_PAGE = 15;

async function fetchPage(page) {
  const res = await fetch(`${BASE}/properties?page=${page}`);
  return res.text();
}

function extractPropertyEntries(html) {
  // Match <a href="/properties/<slug>">...<some-element>TITLE</some-element>
  // The index page lists each property with its full title visible.
  // Strategy: find each property link, then look ahead for the next h2/h3/h4 text.
  const entries = [];
  const hrefRe = /href="(\/properties\/[^"?]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match;
  while ((match = hrefRe.exec(html)) !== null) {
    const slug = match[1];
    const inner = match[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (inner.length > 5) entries.push({ path: slug, label: inner });
  }
  return entries;
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

async function main() {
  const lotsPath = "src/data/lots.json";
  const lots = JSON.parse(readFileSync(lotsPath, "utf8"));

  console.log("Fetching listings index…");
  const firstPage = await fetchPage(1);
  const totalMatch = firstPage.match(/of\s+(\d+)\s+Results/);
  const total = totalMatch ? parseInt(totalMatch[1]) : 200;
  const pages = Math.ceil(total / PER_PAGE);
  console.log(`  ${total} results across ${pages} pages`);

  let allEntries = extractPropertyEntries(firstPage);
  for (let p = 2; p <= pages; p++) {
    const html = await fetchPage(p);
    allEntries = [...allEntries, ...extractPropertyEntries(html)];
    process.stdout.write(`\r  page ${p}/${pages}`);
    await new Promise((r) => setTimeout(r, 200));
  }
  console.log(`\n  ${allEntries.length} candidate entries`);

  // Build a slug -> normalized-label map. Dedupe by slug, prefer the longest label.
  const bySlug = new Map();
  for (const e of allEntries) {
    const cur = bySlug.get(e.path);
    if (!cur || e.label.length > cur.label.length) bySlug.set(e.path, e);
  }

  // Try to match each lot by its title.
  let matched = 0;
  let missed = 0;
  for (const lot of lots) {
    const lotKey = normalize(lot.name);
    let bestPath = null;
    let bestScore = 0;

    for (const [slug, entry] of bySlug) {
      const slugKey = normalize(slug.replace("/properties/", ""));
      const labelKey = normalize(entry.label);
      // Score by whether the slug or label contains the lot title (or vice versa)
      let score = 0;
      if (slugKey === lotKey) score = 1000;
      else if (labelKey === lotKey) score = 900;
      else if (slugKey.startsWith(lotKey.slice(0, 30))) score = 200;
      else if (lotKey.startsWith(slugKey.slice(0, 30))) score = 180;
      else {
        // word-overlap fallback
        const lotWords = new Set(lotKey.split(" ").filter((w) => w.length > 3));
        const slugWords = slugKey.split(" ").filter((w) => w.length > 3);
        const overlap = slugWords.filter((w) => lotWords.has(w)).length;
        if (overlap >= 3) score = overlap * 10;
      }
      if (score > bestScore) {
        bestScore = score;
        bestPath = slug;
      }
    }

    if (bestPath && bestScore >= 30) {
      lot.sourceUrl = `${BASE}${bestPath}`;
      lot.active = true;
      bySlug.delete(bestPath); // avoid reusing same slug for multiple lots
      matched++;
    } else {
      // Lot is no longer in the source index — assume sold/removed.
      lot.active = false;
      missed++;
    }
  }

  writeFileSync(lotsPath, JSON.stringify(lots, null, 2) + "\n");
  console.log(`\nMatched: ${matched}    Missed (marked inactive): ${missed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
