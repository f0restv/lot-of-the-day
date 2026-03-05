"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { SITE_NAME } from "@/lib/constants";

export function Header() {
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 200],
    ["rgba(253,251,247,0)", "rgba(253,251,247,0.95)"]
  );
  const headerBlur = useTransform(
    scrollY,
    [0, 200],
    ["blur(0px)", "blur(12px)"]
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Today's Lot" },
    { href: "/archive", label: "Archive" },
    { href: "/about", label: "About" },
  ];

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
        backdropFilter: headerBlur,
        WebkitBackdropFilter: headerBlur,
      }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-foreground group-hover:text-gold transition-colors duration-300">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-[0.2em] uppercase text-foreground/60 hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden text-foreground/60 hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-surface/95 backdrop-blur-lg border-t border-foreground/5 px-6 py-6"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm tracking-[0.15em] uppercase text-foreground/70 hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
}
