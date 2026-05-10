/**
 * Verifies that upcoming featured lots are still listed on the source
 * (governmentlandsales.us). Flips lot.active = false on lots whose source
 * page is missing, returns 404, or shows a sold/pending/hold badge.
 *
 * Designed to be run on a schedule (GitHub Actions) just before the daily
 * rotation flips at midnight ET, so the next-day pick is verified before
 * it goes live. Also re-checks today's lot in case it sold mid-day.
 *
 * Usage:
 *   node scripts/verify-active.mjs                  # default: today + next 3 days
 *   node scripts/verify-active.mjs --days 7         # widen the window
 *   node scripts/verify-active.mjs --all            # re-verify every active lot
 *   node scripts/verify-active.mjs --revive         # also re-check inactive lots (in case they came back)
 *
 * Exit code 0 always (unless a hard error). Prints a summary so the workflow
 * step shows what changed.
 */

import { readFileSync, writeFileSync } from "fs";

const LOTS_PATH = "src/data/lots.json";
const TIMEZONE = "America/New_York";

function todayInTimezone(tz) {
  // Returns YYYY-MM-DD in the given IANA timezone.
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

function addDays(yyyyMmDd, days) {
  const d = new Date(yyyyMmDd + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function parseArgs(argv) {
  const args = { days: 3, all: false, revive: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--days") args.days = parseInt(argv[++i], 10);
    else if (argv[i] === "--all") args.all = true;
    else if (argv[i] === "--revive") args.revive = true;
  }
  return args;
}

/**
 * Pick which lots the verifier should check this run.
 *
 * Same rotation math as getLatestLot in src/lib/lots.ts — sorts active lots
 * by date and picks index = daysSinceFirst % count. We compute that for
 * today and the next N days so we cover whatever's about to be featured.
 */
function pickUpcomingLots(lots, daysAhead) {
  const today = todayInTimezone(TIMEZONE);
  const active = lots
    .filter((l) => l.active !== false)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  if (active.length === 0) return [];

  const firstDate = new Date(active[0].date + "T00:00:00Z");
  const picks = new Set();

  for (let offset = 0; offset <= daysAhead; offset++) {
    const dateStr = addDays(today, offset);
    // Exact-date match wins if present.
    const exact = lots.find((l) => l.date === dateStr && l.active !== false);
    if (exact) {
      picks.add(exact.id);
      continue;
    }
    const tDate = new Date(dateStr + "T00:00:00Z");
    const days = Math.floor((tDate.getTime() - firstDate.getTime()) / 86_400_000);
    if (days < 0) {
      picks.add(active[0].id);
    } else {
      picks.add(active[days % active.length].id);
    }
  }

  return lots.filter((l) => picks.has(l.id));
}

async function checkLot(lot) {
  if (!lot.sourceUrl) {
    return { lot, status: "skipped", reason: "no sourceUrl" };
  }

  let res;
  try {
    res = await fetch(lot.sourceUrl, { redirect: "follow" });
  } catch (err) {
    return { lot, status: "error", reason: `fetch failed: ${err.message}` };
  }

  if (res.status === 404 || res.status === 410) {
    return { lot, status: "gone", reason: `HTTP ${res.status}` };
  }
  if (!res.ok) {
    return { lot, status: "error", reason: `HTTP ${res.status}` };
  }

  const html = await res.text();
  const badges = html.match(/<span[^>]*class="[^"]*badge[^"]*"[^>]*>([\s\S]*?)<\/span>/gi) || [];
  const badgeText = badges.join(" ").toLowerCase();
  if (/\bsold\b/.test(badgeText)) return { lot, status: "sold", reason: "sold badge" };
  if (/\bpending\b/.test(badgeText)) return { lot, status: "sold", reason: "pending badge" };
  if (/\bhold\b/.test(badgeText)) return { lot, status: "sold", reason: "hold badge" };

  return { lot, status: "active" };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const lots = JSON.parse(readFileSync(LOTS_PATH, "utf8"));

  let targets;
  if (args.all) {
    targets = lots.filter((l) => l.active !== false && l.sourceUrl);
    console.log(`Checking all ${targets.length} active lots…`);
  } else {
    targets = pickUpcomingLots(lots, args.days);
    console.log(`Checking ${targets.length} upcoming lots (today + ${args.days} days)…`);
  }

  if (args.revive) {
    const inactiveWithUrl = lots.filter((l) => l.active === false && l.sourceUrl);
    targets = [...targets, ...inactiveWithUrl];
    console.log(`  + ${inactiveWithUrl.length} inactive lots being re-checked for revival`);
  }

  let deactivated = 0;
  let revived = 0;
  let unchanged = 0;
  let skipped = 0;
  let errored = 0;

  const lotById = new Map(lots.map((l) => [l.id, l]));

  for (let i = 0; i < targets.length; i++) {
    const lot = targets[i];
    process.stdout.write(`  [${i + 1}/${targets.length}] ${lot.id} — ${lot.name.slice(0, 50)}… `);
    const result = await checkLot(lot);
    const stored = lotById.get(lot.id);
    const wasActive = stored.active !== false;

    if (result.status === "skipped") {
      console.log("skip (no sourceUrl)");
      skipped++;
    } else if (result.status === "error") {
      console.log(`error: ${result.reason} (leaving as-is)`);
      errored++;
    } else if (result.status === "active") {
      if (!wasActive) {
        stored.active = true;
        console.log("RELISTED — marked active");
        revived++;
      } else {
        console.log("active");
        unchanged++;
      }
    } else {
      if (wasActive) {
        stored.active = false;
        console.log(`DEACTIVATED — ${result.reason}`);
        deactivated++;
      } else {
        console.log(`still gone (${result.reason})`);
        unchanged++;
      }
    }
    // Be nice to the source.
    await new Promise((r) => setTimeout(r, 200));
  }

  if (deactivated > 0 || revived > 0) {
    writeFileSync(LOTS_PATH, JSON.stringify(lots, null, 2) + "\n");
    console.log("\nWrote updated lots.json");
  } else {
    console.log("\nNo changes — lots.json untouched");
  }

  console.log(
    `Summary: ${deactivated} deactivated, ${revived} revived, ${unchanged} unchanged, ${skipped} skipped, ${errored} errors`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
