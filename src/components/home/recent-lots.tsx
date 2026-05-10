import Link from "next/link";
import Image from "next/image";
import type { Lot } from "@/types/lot";
import { formatCurrency, formatAcreage } from "@/lib/utils";
import { FadeIn } from "@/components/animations/fade-in";

interface RecentLotsProps {
  lots: Lot[];
}

export function RecentLots({ lots }: RecentLotsProps) {
  if (lots.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-surface-light">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                More Lots
              </h2>
              <p className="text-sm text-muted mt-1">Previous featured properties</p>
            </div>
            <Link
              href="/archive"
              className="text-xs tracking-wider uppercase text-gold font-bold hover:text-gold-dark transition-colors"
            >
              See all
            </Link>
          </div>
        </FadeIn>

        {/* Horizontal scroll on mobile, stacked cards on desktop */}
        <div className="flex gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-2 pb-4 lg:pb-0 scrollbar-hide">
          {lots.map((lot, i) => (
            <FadeIn key={lot.id} delay={i * 0.1}>
              <Link
                href={`/lot/${lot.date}`}
                className="group flex flex-col sm:flex-row gap-4 bg-surface rounded-2xl border border-foreground/5 overflow-hidden shrink-0 w-[85vw] sm:w-[80vw] lg:w-auto snap-start hover:shadow-lg transition-shadow duration-500"
              >
                <div className="relative w-full sm:w-48 lg:w-56 shrink-0 aspect-[4/3] sm:aspect-auto sm:h-auto">
                  <Image
                    src={lot.media.poster}
                    alt={lot.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 85vw, 224px"
                  />
                </div>
                <div className="flex flex-col justify-center p-5 sm:py-6 sm:pr-6 sm:pl-0">
                  <p className="text-[11px] tracking-wider uppercase text-muted mb-1.5">
                    {lot.location.county} County, {lot.location.state}
                  </p>
                  <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-gold transition-colors leading-snug">
                    {lot.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-gold font-bold text-sm">
                      {formatCurrency(lot.price)}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-foreground/20" />
                    <span className="text-muted text-sm">
                      {formatAcreage(lot.acreage)} acres
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
