import { redirect } from "next/navigation";
import { getTodaysLot, getLatestLot } from "@/lib/lots";

export default function TodayPage() {
  const lot = getTodaysLot() ?? getLatestLot();
  redirect(`/lot/${lot.date}`);
}
