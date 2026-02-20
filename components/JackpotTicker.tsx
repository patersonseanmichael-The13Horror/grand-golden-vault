"use client";
import { useEffect, useMemo, useState } from "react";
import { anonymizeEmail } from "@/lib/anonymizeEmail";

type WinItem = { email: string; amount: number; ts: number };

function formatMoney(n: number) {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

export default function JackpotTicker() {
  const [items, setItems] = useState<WinItem[]>([]);

  useEffect(() => {
    const seed = () => {
      const sample: WinItem[] = [
        { email: "Patxxxxxxxxx643@outlook.com", amount: 23840, ts: Date.now() - 200000 },
        { email: "hxxxxxxxx@hmail.com", amount: 50120, ts: Date.now() - 450000 },
        { email: "Ya***.c**.a*@example.com", amount: 15999, ts: Date.now() - 700000 },
      ];
      setItems(sample);
    };
    seed();
    const everyTenMin = setInterval(seed, 10 * 60 * 1000);
    return () => clearInterval(everyTenMin);
  }, []);

  const line = useMemo(() => {
    if (!items.length) return "Awaiting confirmed member events…";
    return items.map((w) => `${anonymizeEmail(w.email)} • Win ${formatMoney(w.amount)}`).join("  •  ");
  }, [items]);

  return (
    <div className="border-y border-white/10 bg-black/30 backdrop-blur-md">
      <div className="vv-page-wrap py-2 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee text-xs tracking-[0.22em] uppercase text-white/70">
          {line}<span className="mx-8 text-white/35">◆</span>{line}
        </div>
      </div>
    </div>
  );
}
