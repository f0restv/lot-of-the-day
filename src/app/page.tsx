import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { CountdownBanner } from "@/components/sections/countdown-banner";
import { TodaysLot } from "@/components/home/todays-lot";
import { RecentLots } from "@/components/home/recent-lots";
import { getLatestLot, getAllLots } from "@/lib/lots";

export const revalidate = 3600;

export default function Home() {
  const todaysLot = getLatestLot();
  const allLots = getAllLots();
  const recentLots = allLots.filter((l) => l.id !== todaysLot.id).slice(0, 3);

  return (
    <>
      <Header />
      <main>
        <Hero lot={todaysLot} />
        <CountdownBanner />
        <TodaysLot lot={todaysLot} />
        {recentLots.length > 0 && <RecentLots lots={recentLots} />}
      </main>
      <Footer />
    </>
  );
}
