"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { OPERATOR_PHONE } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Lot } from "@/types/lot";

interface StickyCTAProps {
  lot: Lot;
  inquireAnchor?: string;
}

export function StickyCTA({ lot, inquireAnchor = "inquire" }: StickyCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phoneHref = OPERATOR_PHONE
    ? `tel:+${OPERATOR_PHONE.replace(/\D/g, "")}`
    : null;

  return (
    <div
      aria-hidden={!visible}
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-background/95 backdrop-blur-md border-t border-foreground/10 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <div className="shrink-0">
            <p className="text-[10px] tracking-wider uppercase text-muted leading-none">
              Today
            </p>
            <p className="font-serif text-lg font-bold text-gold leading-tight">
              {formatCurrency(lot.price)}
            </p>
          </div>
          <div className="flex-1 flex items-center gap-2">
            {phoneHref && (
              <a
                href={phoneHref}
                onClick={() => track("phone_click", { variant: "sticky", lotId: lot.id })}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-surface-light border border-gold/30 text-foreground px-3 py-3 text-xs tracking-wider uppercase font-bold rounded-xl"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call
              </a>
            )}
            <a
              href={`#${inquireAnchor}`}
              onClick={() => track("inquire_jump", { lotId: lot.id })}
              className="flex-1 inline-flex items-center justify-center bg-gold text-white px-4 py-3 text-xs tracking-wider uppercase font-bold rounded-xl"
            >
              Inquire
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
