"use client";

import { useEffect, useState } from "react";

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
}

export function Countdown() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getTimeUntilMidnight());
    const interval = setInterval(() => {
      setTime(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div className="h-20" />;
  }

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8">
      <TimeUnit value={time.hours} label="Hours" />
      <span className="text-3xl md:text-5xl text-gold/40 font-light -mt-6">:</span>
      <TimeUnit value={time.minutes} label="Minutes" />
      <span className="text-3xl md:text-5xl text-gold/40 font-light -mt-6">:</span>
      <TimeUnit value={time.seconds} label="Seconds" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-foreground tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-gold/60 mt-2 md:mt-3">
        {label}
      </span>
    </div>
  );
}
