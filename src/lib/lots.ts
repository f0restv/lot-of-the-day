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

export function getLatestLot(): Lot {
  const sorted = [...lots].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return sorted[0];
}

export function getAllLotDates(): string[] {
  return lots.map((lot) => lot.date);
}
