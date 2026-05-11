import lotsData from "@/data/lots.json";
import type { Lot } from "@/types/lot";
import { getTodayDateString } from "./utils";

const lots = lotsData as Lot[];

function isActive(lot: Lot): boolean {
  return lot.active !== false;
}

export function getAllLots(): Lot[] {
  return lots.filter(isActive);
}

export function getLotByDate(date: string): Lot | undefined {
  return lots.find((lot) => lot.date === date && isActive(lot));
}

/**
 * Get today's featured lot. If today matches a lot's date AND that lot is
 * still active, show it. Otherwise, cycle through active lots in date
 * order, picking the one at index = daysSinceFirst % activeCount.
 */
export function getLatestLot(): Lot {
  const today = getTodayDateString();

  const exactMatch = lots.find((lot) => lot.date === today && isActive(lot));
  if (exactMatch) return exactMatch;

  const activeSorted = lots
    .filter(isActive)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Fallback: if every lot is somehow inactive, return the first lot in the
  // raw dataset so the page still renders something.
  if (activeSorted.length === 0) return lots[0];

  const firstDate = new Date(activeSorted[0].date + "T00:00:00");
  const todayDate = new Date(today + "T00:00:00");
  const daysSinceFirst = Math.floor(
    (todayDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceFirst < 0) return activeSorted[0];

  const index = daysSinceFirst % activeSorted.length;
  return activeSorted[index];
}

export function getAllLotDates(): string[] {
  return lots.filter(isActive).map((lot) => lot.date);
}

/**
 * Picks lots similar to the current one for cross-sell. Scores candidates
 * by (state match) + (price within 50%) + (acreage within 2x), then
 * returns the top N. Excludes the current lot and any inactive lot.
 */
export function getSimilarLots(currentLot: Lot, count = 3): Lot[] {
  const candidates = lots.filter(
    (l) => isActive(l) && l.id !== currentLot.id
  );

  const minPrice = currentLot.price * 0.5;
  const maxPrice = currentLot.price * 1.5;
  const minAcres = currentLot.acreage * 0.5;
  const maxAcres = currentLot.acreage * 2;

  const scored = candidates.map((l) => {
    let score = 0;
    if (l.location.state === currentLot.location.state) score += 50;
    if (l.location.county === currentLot.location.county) score += 30;
    if (l.price >= minPrice && l.price <= maxPrice) score += 30;
    if (l.acreage >= minAcres && l.acreage <= maxAcres) score += 20;
    // Tighter the price match, more points (up to +20).
    const priceDelta = Math.abs(l.price - currentLot.price) / currentLot.price;
    score += Math.max(0, 20 - Math.round(priceDelta * 40));
    return { lot: l, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.lot);
}

export interface LotStats {
  total: number;
  inState: number;
  underBudget: number;
}

export function getLotStats(currentLot: Lot, budgetThreshold = 50000): LotStats {
  return {
    total: lots.length,
    inState: lots.filter((l) => l.location.state === currentLot.location.state).length,
    underBudget: lots.filter((l) => l.price <= budgetThreshold).length,
  };
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export interface PerAcreComparison {
  perAcre: number;
  stateMedianPerAcre: number;
  percentBelowMedian: number | null;
  sampleSize: number;
}

/**
 * Compares this lot's price-per-acre to the median for the same state,
 * looking only at lots within 2x size in either direction (so a 0.5-acre
 * lot doesn't get compared against 80-acre ranches). Returns null
 * `percentBelowMedian` when the sample is too small to be meaningful or
 * when this lot is at or above the median.
 */
export function getPerAcreComparison(currentLot: Lot): PerAcreComparison | null {
  if (currentLot.acreage <= 0) return null;
  const perAcre = currentLot.price / currentLot.acreage;

  const minAcres = currentLot.acreage / 2;
  const maxAcres = currentLot.acreage * 2;
  const peers = lots
    .filter(
      (l) =>
        l.id !== currentLot.id &&
        l.location.state === currentLot.location.state &&
        l.acreage >= minAcres &&
        l.acreage <= maxAcres &&
        l.price > 0
    )
    .map((l) => l.price / l.acreage);

  if (peers.length < 3) return null;

  const stateMedianPerAcre = median(peers);
  const diffPct = ((perAcre - stateMedianPerAcre) / stateMedianPerAcre) * 100;
  const percentBelowMedian = diffPct < -5 ? Math.round(-diffPct) : null;

  return { perAcre, stateMedianPerAcre, percentBelowMedian, sampleSize: peers.length };
}
