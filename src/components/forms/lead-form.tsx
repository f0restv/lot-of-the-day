"use client";

import { useState } from "react";
import { submitLead } from "@/app/actions/contact";

interface LeadFormProps {
  lotId?: string;
  lotName?: string;
  lotDate?: string;
  source: string;
  heading?: string;
  subheading?: string;
  buttonLabel?: string;
  showPhone?: boolean;
  className?: string;
}

export function LeadForm({
  lotId,
  lotName,
  lotDate,
  source,
  heading = "Get the full details",
  subheading = "We'll send the listing PDF and financing options to your inbox.",
  buttonLabel = "Send Me the Details",
  showPhone = true,
  className = "",
}: LeadFormProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setError("");
    const res = await submitLead({
      email,
      phone: phone || undefined,
      message: message || undefined,
      lotId,
      lotName,
      lotDate,
      source,
    });
    if (res.ok) {
      setState("ok");
    } else {
      setState("error");
      setError(res.error ?? "Something went wrong.");
    }
  }

  if (state === "ok") {
    return (
      <div className={`bg-surface-light border border-gold/30 rounded-2xl p-6 text-center ${className}`}>
        <div className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-gold/20 mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-serif text-xl font-bold text-foreground mb-1">Got it.</h3>
        <p className="text-sm text-foreground/60">
          We&apos;ll be in touch within one business day with the full listing and financing options.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`bg-surface-light border border-foreground/5 rounded-2xl p-6 md:p-8 ${className}`}>
      <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-1">{heading}</h3>
      <p className="text-sm text-foreground/60 mb-5">{subheading}</p>

      <div className="space-y-3">
        <input
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-surface border border-foreground/10 rounded-xl text-foreground placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
        />

        {showPhone && (
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Phone (optional, for a callback)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-foreground/10 rounded-xl text-foreground placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
          />
        )}

        <textarea
          placeholder="Anything you'd like us to know? (optional)"
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-3 bg-surface border border-foreground/10 rounded-xl text-foreground placeholder:text-muted focus:border-gold focus:outline-none transition-colors resize-none"
        />

        <button
          type="submit"
          disabled={state === "loading"}
          className="w-full inline-flex items-center justify-center gap-2 bg-gold text-white px-8 py-3.5 text-sm tracking-wider uppercase font-bold rounded-xl hover:bg-gold-dark transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {state === "loading" ? "Sending…" : buttonLabel}
        </button>

        {state === "error" && (
          <p className="text-sm text-urgent mt-1">{error}</p>
        )}

        <p className="text-[11px] text-muted text-center mt-2">
          No spam. We&apos;ll only contact you about this lot.
        </p>
      </div>
    </form>
  );
}
