import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-foreground/5 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <span className="font-serif text-xl font-bold text-foreground">
              {SITE_NAME}
            </span>
            <p className="text-sm text-muted mt-3 leading-relaxed">
              A new lot of land, every single day. Affordable government and
              foreclosed land across the western US.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground/60 mb-4">
              Navigate
            </h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm text-muted hover:text-gold transition-colors"
              >
                Today&apos;s Lot
              </Link>
              <Link
                href="/archive"
                className="text-sm text-muted hover:text-gold transition-colors"
              >
                Past Lots
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted hover:text-gold transition-colors"
              >
                About
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground/30">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-xs text-muted hover:text-gold transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
