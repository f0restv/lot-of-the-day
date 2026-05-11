import Link from "next/link";
import Image from "next/image";
import type { Lot } from "@/types/lot";
import { formatCurrency, formatAcreage } from "@/lib/utils";
import { FadeIn } from "@/components/animations/fade-in";

interface SimilarLotsProps {
  lots: Lot[];
  currentState: string;
}

export function SimilarLots({ lots, currentState }: SimilarLotsProps) {
  if (lots.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-surface-light">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                Lots like this one
              </h2>
              <p className="text-sm text-muted mt-1">
                Similar size and price{currentState ? `, also in ${currentState}` : ""}
              </p>
            </div>
            <Link
              href="/archive"
              className="text-xs tracking-wider uppercase text-gold font-bold hover:text-gold-dark transition-colors hidden sm:inline"
            >
              See all
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {lots.map((lot, i) => (
            <FadeIn key={lot.id} delay={i * 0.08}>
              <Link
                href={`/lot/${lot.date}`}
                className="group flex flex-col bg-surface rounded-2xl border border-foreground/5 overflow-hidden hover:shadow-lg transition-shadow duration-500 h-full"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={lot.media.poster}
                    alt={lot.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 p-5">
                  <div>
                    <p className="text-[11px] tracking-wider uppercase text-muted mb-1.5">
                      {lot.location.county} County, {lot.location.state}
                    </p>
                    <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-gold transition-colors leading-snug mb-3">
                      {lot.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
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
