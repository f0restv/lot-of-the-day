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
