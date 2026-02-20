"use client";
import { useEffect, useMemo, useState } from "react";

export default function BrisbaneClock() {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const formatted = useMemo(() => {
    const dtf = new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Brisbane",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    return dtf.format(now);
  }, [now]);
  return (
    <div className="rounded-full border border-white/14 bg-black/28 px-4 py-2 text-[10px] tracking-[0.24em] uppercase text-white/66">
      {formatted} • QLD (AEST)
    </div>
  );
}
