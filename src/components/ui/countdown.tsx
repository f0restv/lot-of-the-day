"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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
    return <div className="h-32" />;
  }

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-8">
      <TimeUnit value={time.hours} label="Hours" />
      <span className="text-3xl md:text-5xl text-gold/30 font-extralight -mt-6 select-none">:</span>
      <TimeUnit value={time.minutes} label="Min" />
      <span className="text-3xl md:text-5xl text-gold/30 font-extralight -mt-6 select-none">:</span>
      <TimeUnit value={time.seconds} label="Sec" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  const digits = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        {digits.split("").map((digit, i) => (
          <div key={`${label}-${i}`} className="relative overflow-hidden w-[0.6em]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={digit}
                className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black text-foreground tabular-nums leading-none block"
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>
      <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-gold mt-2 md:mt-4">
        {label}
      </span>
    </div>
  );
}
