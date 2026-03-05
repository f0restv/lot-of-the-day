"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { Countdown } from "@/components/ui/countdown";
import { SITE_URL } from "@/lib/constants";
import type { Lot } from "@/types/lot";

interface CtaSectionProps {
  lot: Lot;
}

export function CtaSection({ lot }: CtaSectionProps) {
  const lotUrl = `${SITE_URL}/lot/${lot.date}`;

  return (
    <section className="relative bg-background py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">
              Interested?
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6">
              Make This Land Yours
            </h2>
            <p className="text-lg text-foreground/60 mb-10">
              Contact us to learn more about this property or schedule a
              visit. Available now at {lot.price < 10000 ? "under $10,000" : `$${lot.price.toLocaleString()}`}.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              {lot.contact.listingUrl && (
                <a
                  href={lot.contact.listingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg">View Full Listing</Button>
                </a>
              )}
              {lot.contact.email && (
                <a href={`mailto:${lot.contact.email}?subject=Inquiry: ${lot.name}`}>
                  <Button variant="outline" size="lg">
                    Email Us
                  </Button>
                </a>
              )}
              <ShareButton
                title={`${lot.name} — Lot of the Day`}
                text={`Check out this ${lot.acreage}-acre property: ${lot.name} for $${lot.price.toLocaleString()}`}
                url={lotUrl}
              />
            </div>
          </FadeIn>

        </div>
      </div>

      {/* Countdown — full width, its own visual block */}
      <FadeIn delay={0.4}>
        <div className="mt-20 md:mt-28 border-t border-b border-gold/10 bg-surface py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center px-6">
            <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-gold mb-8 md:mb-12">
              Next lot drops in
            </p>
            <Countdown />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
