"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SITE_NAME } from "@/lib/constants";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="group">
            <span className="font-serif text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {SITE_NAME}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <nav className="flex items-center gap-8">
              <Link
                href="/"
                className="text-[13px] tracking-wide text-foreground/50 hover:text-foreground transition-colors duration-300"
              >
                Today
              </Link>
              <Link
                href="/archive"
                className="text-[13px] tracking-wide text-foreground/50 hover:text-foreground transition-colors duration-300"
              >
                Archive
              </Link>
              <Link
                href="/about"
                className="text-[13px] tracking-wide text-foreground/50 hover:text-foreground transition-colors duration-300"
              >
                About
              </Link>
            </nav>
            <div className="flex items-center gap-2 bg-urgent/10 text-urgent px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-urgent animate-pulse-dot" />
              <span className="text-[11px] font-bold tracking-wider uppercase">Live Now</span>
            </div>
          </div>

          <button
            className="md:hidden text-foreground/60 hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden bg-background border-t border-foreground/5 px-6 py-6">
          <div className="flex flex-col gap-4">
            {[
              { href: "/", label: "Today" },
              { href: "/archive", label: "Archive" },
              { href: "/about", label: "About" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
