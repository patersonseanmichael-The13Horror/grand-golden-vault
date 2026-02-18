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
  return <div className="text-xs tracking-[0.25em] uppercase text-white/55">{formatted} • QLD (AEST)</div>;
}
