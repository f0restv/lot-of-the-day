import { Countdown } from "@/components/ui/countdown";

export function CountdownBanner() {
  return (
    <section className="bg-surface-light border-y border-foreground/5 py-8 md:py-10">
      <div className="max-w-3xl mx-auto text-center px-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-urgent animate-pulse-dot" />
          <p className="text-[11px] tracking-[0.25em] uppercase text-urgent font-bold">
            New pick at midnight
          </p>
        </div>
        <Countdown />
      </div>
    </section>
  );
}
