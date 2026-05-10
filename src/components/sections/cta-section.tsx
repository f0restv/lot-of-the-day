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
    <section className="relative bg-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-urgent animate-pulse-dot" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-urgent">
                Available now
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Make This Land Yours
            </h2>
            <p className="text-foreground/50 mb-8">
              Contact us to learn more or schedule a visit.
              Available at {lot.price < 10000 ? "under $10,000" : `$${lot.price.toLocaleString()}`}.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              {lot.contact.listingUrl && (
                <a href={lot.contact.listingUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg">View Full Listing</Button>
                </a>
              )}
              {lot.contact.email && (
                <a href={`mailto:${lot.contact.email}?subject=Inquiry: ${lot.name}`}>
                  <Button variant="outline" size="lg">Email Us</Button>
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

      <FadeIn delay={0.4}>
        <div className="mt-12 bg-surface-light border-y border-foreground/5 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center px-6">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-urgent animate-pulse-dot" />
              <p className="text-[11px] tracking-[0.25em] uppercase text-urgent font-bold">
                Next lot drops in
              </p>
            </div>
            <Countdown />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
