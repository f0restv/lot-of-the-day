import lotsData from "@/data/lots.json";
import type { Lot } from "@/types/lot";
import { getTodayDateString } from "./utils";

const lots = lotsData as Lot[];

export function getAllLots(): Lot[] {
  return lots;
}

export function getLotByDate(date: string): Lot | undefined {
  return lots.find((lot) => lot.date === date);
}

export function getTodaysLot(): Lot | undefined {
  return getLotByDate(getTodayDateString());
}

/**
 * Get today's featured lot. If today matches a lot's date, show that lot.
 * Otherwise, cycle through all lots on a daily rotation based on the
 * number of days since the first lot's date.
 */
export function getLatestLot(): Lot {
  const today = getTodayDateString();

  // First check for an exact date match
  const exactMatch = lots.find((lot) => lot.date === today);
  if (exactMatch) return exactMatch;

  // No exact match — cycle through lots based on day offset
  const sorted = [...lots].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const firstDate = new Date(sorted[0].date + "T00:00:00");
  const todayDate = new Date(today + "T00:00:00");
  const daysSinceFirst = Math.floor(
    (todayDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If today is before all lots, show the first one
  if (daysSinceFirst < 0) return sorted[0];

  const index = daysSinceFirst % sorted.length;
  return sorted[index];
}

export function getAllLotDates(): string[] {
  return lots.map((lot) => lot.date);
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
