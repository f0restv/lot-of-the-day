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
    return <div className="h-16 lg:h-20" />;
  }

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      <TimeUnit value={time.hours} label="Hrs" />
      <span className="text-2xl lg:text-3xl text-foreground/20 font-light -mt-5 select-none">:</span>
      <TimeUnit value={time.minutes} label="Min" />
      <span className="text-2xl lg:text-3xl text-foreground/20 font-light -mt-5 select-none">:</span>
      <TimeUnit value={time.seconds} label="Sec" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] lg:text-[10px] tracking-[0.25em] uppercase text-muted mt-1.5">
        {label}
      </span>
    </div>
  );
}
