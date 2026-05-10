import { redirect } from "next/navigation";
import { getLatestLot } from "@/lib/lots";

export default function TodayPage() {
  const lot = getLatestLot();
  redirect(`/lot/${lot.date}`);
}
