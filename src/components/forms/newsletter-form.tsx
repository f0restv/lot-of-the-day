"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { submitLead } from "@/app/actions/contact";

interface NewsletterFormProps {
  source: string;
  heading?: string;
  subheading?: string;
  className?: string;
  variant?: "stacked" | "inline";
}

export function NewsletterForm({
  source,
  heading = "Get tomorrow's lot in your inbox",
  subheading = "One handpicked parcel a day. No spam.",
  className = "",
  variant = "stacked",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setError("");
    const res = await submitLead({
      email,
      message: "Newsletter signup",
      source,
    });
    if (res.ok) {
      setState("ok");
      track("newsletter_subscribe", { source });
    } else {
      setState("error");
      track("newsletter_error", { source });
      setError(res.error ?? "Something went wrong.");
    }
  }

  if (state === "ok") {
    return (
      <div className={`text-sm ${className}`}>
        <p className="text-foreground font-bold">You&apos;re in.</p>
        <p className="text-foreground/60 mt-1">Tomorrow&apos;s lot will land in your inbox.</p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={onSubmit} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
        <input
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 bg-surface border border-foreground/10 rounded-xl text-foreground placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex items-center justify-center gap-2 bg-gold text-white px-6 py-3 text-sm tracking-wider uppercase font-bold rounded-xl hover:bg-gold-dark transition-colors duration-300 disabled:opacity-60 whitespace-nowrap"
        >
          {state === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
        {state === "error" && <p className="text-sm text-urgent w-full">{error}</p>}
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`${className}`}>
      {heading && (
        <h3 className="font-serif text-xl font-bold text-foreground mb-1">{heading}</h3>
      )}
      {subheading && (
        <p className="text-sm text-foreground/60 mb-4">{subheading}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 bg-surface border border-foreground/10 rounded-xl text-foreground placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex items-center justify-center gap-2 bg-gold text-white px-6 py-3 text-sm tracking-wider uppercase font-bold rounded-xl hover:bg-gold-dark transition-colors duration-300 disabled:opacity-60 whitespace-nowrap"
        >
          {state === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {state === "error" && <p className="text-sm text-urgent mt-2">{error}</p>}
    </form>
  );
}
