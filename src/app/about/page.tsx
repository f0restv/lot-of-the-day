import type { Metadata } from "next";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/constants";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FadeIn } from "@/components/animations/fade-in";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${SITE_NAME} and our mission to make land ownership accessible to everyone.`,
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <span className="text-xs tracking-[0.3em] uppercase text-gold mb-3 block">
              About
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-8">
              {SITE_NAME}
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="space-y-6 text-foreground/70 leading-relaxed text-lg mb-20">
              <p>
                Every day, we feature one exceptional lot of raw land from
                across the American West. Our mission is simple: make land
                ownership accessible by surfacing affordable, high-quality
                parcels that most people never hear about.
              </p>
              <p>
                We scour the market for hidden gems — affordable parcels with
                real potential that most buyers never see. Each property is
                reviewed for value, accessibility, and potential before being
                featured on our site.
              </p>
              <p>
                Whether you&apos;re looking for an off-grid homestead, a
                weekend camping retreat, a long-term investment, or simply a
                piece of the American landscape to call your own — we help you
                find it.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-surface border border-foreground/10 p-8 md:p-12 text-center">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                Get in Touch
              </h2>
              <p className="text-foreground/60 mb-6">
                Have a question about a lot or want to list your property?
                We&apos;d love to hear from you.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 bg-gold text-background px-8 py-3.5 text-sm tracking-wider uppercase font-bold hover:bg-gold-light transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  );
}
