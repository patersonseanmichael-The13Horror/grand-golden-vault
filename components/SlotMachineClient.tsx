"use client";

import { useMemo, useState } from "react";
import { spinReels, calculateWin, type Reels } from "@/engine/slotEngine";
import LuxeButton from "@/components/LuxeButton";

type Cfg = {
  id: string;
  name: string;
  symbols: string[];
  minBet: number;
  maxBet: number;
  payTable: Record<string, Record<number, number>>;
};

export default function SlotMachineClient({ cfg }: { cfg: Cfg }) {
  const [bet, setBet] = useState<number>(cfg.minBet);
  const [reels, setReels] = useState<Reels>(() => spinReels(cfg.symbols));
  const [win, setWin] = useState<number>(0);

  const grid = useMemo(() => [0,1,2].map(r => [0,1,2,3,4].map(c => reels[c][r])), [reels]);

  function onSpin() {
    const next = spinReels(cfg.symbols);
    setReels(next);
    const baseWin = calculateWin(next, cfg.payTable);
    setWin(baseWin * bet);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-vv-soft">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.30em] uppercase text-white/60">Spin Console</div>
          <div className="mt-1 text-sm text-white/55">Demo UI. Production should validate spins on the server.</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs tracking-[0.22em] uppercase text-white/55">Bet</div>
          <input
            type="number"
            value={bet}
            min={cfg.minBet}
            max={cfg.maxBet}
            onChange={(e) => setBet(Math.max(cfg.minBet, Math.min(cfg.maxBet, Number(e.target.value) || cfg.minBet)))}
            className="w-28 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white/85 outline-none"
          />
          <LuxeButton label="Spin" variant="gold" onClick={onSpin} />
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
        <div className="grid grid-rows-3 gap-3">
          {grid.map((row, i) => (
            <div key={i} className="grid grid-cols-5 gap-3">
              {row.map((cell, j) => (
                <div key={j} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-6 text-center text-sm tracking-[0.18em] text-white/80 animate-floaty"
                     style={{ animationDelay: `${(j+i)*60}ms` }}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-xs tracking-[0.22em] uppercase text-white/55">Result</div>
        <div className="text-lg text-white/85">{win.toLocaleString("en-AU")} AUD</div>
      </div>
    </div>
  );
}
