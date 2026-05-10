"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { ShareButton } from "@/components/ui/share-button";
import { PhoneCTA } from "@/components/ui/phone-cta";
import { FinancingBadge } from "@/components/ui/financing-badge";
import { Countdown } from "@/components/ui/countdown";
import { LeadForm } from "@/components/forms/lead-form";
import { SITE_URL, OPERATOR_PHONE } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Lot } from "@/types/lot";

interface CtaSectionProps {
  lot: Lot;
}

export function CtaSection({ lot }: CtaSectionProps) {
  const lotUrl = `${SITE_URL}/lot/${lot.date}`;

  return (
    <section id="inquire" className="relative bg-background py-16 md:py-24 scroll-mt-20">
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
              Contact us to learn more or schedule a visit. Available at {formatCurrency(lot.price)}.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="max-w-md mx-auto mb-6">
              <FinancingBadge variant="card" />
            </div>
          </FadeIn>

          {OPERATOR_PHONE && (
            <FadeIn delay={0.15}>
              <div className="max-w-md mx-auto mb-6">
                <PhoneCTA variant="block" prefix="Call to inquire" />
              </div>
            </FadeIn>
          )}

          <FadeIn delay={0.2}>
            <div className="max-w-md mx-auto mb-8">
              <LeadForm
                lotId={lot.id}
                lotName={lot.name}
                lotDate={lot.date}
                source="cta-section"
                heading="Get the full listing"
                subheading="We'll email you the listing details and financing options for this lot."
                buttonLabel="Send Me the Listing"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex items-center justify-center gap-3 mb-12">
              <ShareButton
                title={`${lot.name} — Lot of the Day`}
                text={`Check out this ${lot.acreage}-acre property: ${lot.name} for ${formatCurrency(lot.price)}`}
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
