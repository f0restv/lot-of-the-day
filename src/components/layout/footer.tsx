import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-background border-t border-foreground/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <span className="font-serif text-xl font-bold text-foreground">
              {SITE_NAME}
            </span>
            <p className="text-sm text-muted mt-2 max-w-sm">
              One exceptional lot, every day. Affordable land across the US.
            </p>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
              Today
            </Link>
            <Link href="/archive" className="text-sm text-muted hover:text-foreground transition-colors">
              Archive
            </Link>
            <Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">
              About
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-foreground/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-foreground/30">
            &copy; {new Date().getFullYear()} {SITE_NAME}
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
