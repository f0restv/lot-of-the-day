"use client";

import { track } from "@vercel/analytics";
import { OPERATOR_PHONE } from "@/lib/constants";

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return raw;
}

function PhoneIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

type Variant = "compact" | "button" | "block";

interface PhoneCTAProps {
  variant?: Variant;
  className?: string;
  prefix?: string;
}

export function PhoneCTA({ variant = "compact", className = "", prefix }: PhoneCTAProps) {
  if (!OPERATOR_PHONE) return null;

  const display = formatPhone(OPERATOR_PHONE);
  const href = `tel:+${OPERATOR_PHONE.replace(/\D/g, "")}`;

  const handleClick = () => {
    track("phone_click", { variant });
  };

  if (variant === "compact") {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 text-[13px] tracking-wide text-foreground/70 hover:text-gold transition-colors ${className}`}
      >
        <PhoneIcon size={14} />
        <span>{display}</span>
      </a>
    );
  }

  if (variant === "button") {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 bg-gold text-white px-8 py-4 text-sm tracking-wider uppercase font-bold rounded-full hover:bg-gold-dark transition-colors duration-300 ${className}`}
      >
        <PhoneIcon size={16} />
        {prefix ?? "Call"} {display}
      </a>
    );
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`flex items-center justify-center gap-3 w-full bg-surface-light border border-gold/30 hover:border-gold rounded-2xl py-5 px-6 transition-colors ${className}`}
    >
      <PhoneIcon size={20} />
      <div className="text-left">
        <p className="text-[10px] tracking-[0.25em] uppercase text-muted font-bold">
          {prefix ?? "Talk to us"}
        </p>
        <p className="text-lg font-serif font-bold text-foreground">{display}</p>
      </div>
    </a>
  );
}
