import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllLots } from "@/lib/lots";
import { formatCurrency, formatAcreage, formatDate } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FadeIn } from "@/components/animations/fade-in";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Browse all past featured lots. Curated raw land across the US — handpicked for value and potential.",
};

export default function ArchivePage() {
  const lots = getAllLots();

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="mb-16">
              <span className="text-xs tracking-[0.3em] uppercase text-gold mb-3 block">
                Browse
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                All Featured Lots
              </h1>
              <p className="text-foreground/60 mt-4 max-w-xl">
                Every lot we&apos;ve featured, all in one place. Each property
                was handpicked for its value and potential.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lots.map((lot, i) => (
              <FadeIn key={lot.id} delay={i * 0.1}>
                <Link href={`/lot/${lot.date}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface mb-4">
                    <Image
                      src={lot.media.poster}
                      alt={lot.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
                    <span className="absolute top-3 right-3 text-xs tracking-wider bg-background/80 backdrop-blur-sm text-foreground/80 px-3 py-1">
                      {formatDate(lot.date)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs tracking-wider text-muted">
                      {lot.location.county} County, {lot.location.state}
                    </p>
                    <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-gold transition-colors">
                      {lot.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gold font-medium">
                        {formatCurrency(lot.price)}
                      </span>
                      <span className="text-foreground/30">|</span>
                      <span className="text-muted">
                        {formatAcreage(lot.acreage)} acres
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
