"use client";

import { useMemo, useState } from "react";

type Bet = {
  key: string;
  amount: number;
  payout: number;
  label: string;
  resolver: (n: number) => boolean;
};

const AI_CROUPIER = "Valentino";
const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

export default function PremiumRoulette() {
  const [balance, setBalance] = useState(10000);
  const [chip, setChip] = useState(25);
  const [bets, setBets] = useState<Bet[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [message, setMessage] = useState("Valentino is waiting for your placement.");

  const totalBet = useMemo(() => bets.reduce((sum, b) => sum + b.amount, 0), [bets]);

  const addBet = (bet: Omit<Bet, "amount">) => {
    if (spinning || balance < chip) return;
    setBalance((prev) => prev - chip);
    setBets((prev) => {
      const idx = prev.findIndex((b) => b.key === bet.key);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], amount: copy[idx].amount + chip };
        return copy;
      }
      return [...prev, { ...bet, amount: chip }];
    });
  };

  const clearBets = () => {
    if (spinning || bets.length === 0) return;
    setBalance((prev) => prev + totalBet);
    setBets([]);
    setMessage("Table cleared. Reposition your chips.");
  };

  const spin = async () => {
    if (spinning || bets.length === 0) return;
    setSpinning(true);
    setMessage("Valentino spins the wheel with high-roller precision...");

    await new Promise((r) => setTimeout(r, 2400));
    const result = Math.floor(Math.random() * 37);
    setWinningNumber(result);

    let payout = 0;
    bets.forEach((bet) => {
      if (bet.resolver(result)) payout += bet.amount * (bet.payout + 1);
    });

    if (payout > 0) {
      setBalance((prev) => prev + payout);
      setMessage(`Ball lands on ${result}. Valentino nods — payout ${payout.toLocaleString()} AUD.`);
    } else {
      setMessage(`Ball lands on ${result}. House edge to Valentino this spin.`);
    }

    setBets([]);
    setSpinning(false);
  };

  const numberButtons = Array.from({ length: 36 }, (_, i) => i + 1);

  return (
    <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-black via-slate-950 to-emerald-950/40 p-6 shadow-2xl">
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-white/60">Balance</p>
          <p className="mt-1 text-2xl font-bold text-amber-300">{balance.toLocaleString()} AUD</p>
          <p className="mt-1 text-sm text-white/65">Active bet: {totalBet.toLocaleString()} AUD</p>
        </div>
        <div className="rounded-2xl border border-purple-500/25 bg-purple-950/20 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-purple-200/70">AI Croupier</p>
          <p className="mt-1 text-lg font-semibold text-purple-200">{AI_CROUPIER} • Hard High-Roller Focus</p>
          <p className="text-sm text-white/70">Analyzes risk, pressure, and wheel tempo continuously.</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">Wheel State</p>
          <div className="mt-2 flex items-center gap-3">
            <div className={`h-14 w-14 rounded-full border-4 border-amber-400 ${spinning ? "animate-spin" : ""} bg-[conic-gradient(from_90deg,#ef4444,#111827,#16a34a,#ef4444)]`} />
            <div>
              <p className="text-sm text-white/70">{spinning ? "Spinning" : "Ready"}</p>
              <p className="text-lg font-bold text-white">{winningNumber === null ? "—" : winningNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <p className="mb-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">{message}</p>

      <div className="mb-6 rounded-3xl border border-amber-500/30 bg-black/35 p-4">
        <h3 className="mb-3 text-lg font-semibold text-amber-300">Las Vegas Premium Table</h3>
        <div className="mb-3 grid grid-cols-5 gap-2 md:grid-cols-9">
          {[5, 25, 50, 100, 250].map((value) => (
            <button
              key={value}
              onClick={() => setChip(value)}
              className={`rounded-full px-3 py-2 text-sm font-semibold ${chip === value ? "bg-amber-400 text-black" : "border border-white/20 bg-white/5 text-white/80"}`}
            >
              ${value}
            </button>
          ))}
        </div>

        <div className="grid gap-2 md:grid-cols-[80px_1fr]">
          <button
            onClick={() => addBet({ key: "straight-0", payout: 35, label: "0", resolver: (n) => n === 0 })}
            className="rounded-lg bg-green-600 py-6 font-bold text-white hover:bg-green-500"
          >
            0
          </button>
          <div className="grid grid-cols-6 gap-1 md:grid-cols-12">
            {numberButtons.map((n) => {
              const isRed = RED_NUMBERS.has(n);
              return (
                <button
                  key={n}
                  onClick={() => addBet({ key: `straight-${n}`, payout: 35, label: `${n}`, resolver: (v) => v === n })}
                  className={`rounded py-2 text-sm font-bold text-white ${isRed ? "bg-red-600 hover:bg-red-500" : "bg-slate-900 hover:bg-slate-800"}`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-6">
          <button onClick={() => addBet({ key: "red", payout: 1, label: "RED", resolver: (n) => RED_NUMBERS.has(n) })} className="rounded bg-red-600 py-2 text-white">RED</button>
          <button onClick={() => addBet({ key: "black", payout: 1, label: "BLACK", resolver: (n) => n !== 0 && !RED_NUMBERS.has(n) })} className="rounded bg-slate-900 py-2 text-white">BLACK</button>
          <button onClick={() => addBet({ key: "even", payout: 1, label: "EVEN", resolver: (n) => n !== 0 && n % 2 === 0 })} className="rounded border border-white/20 bg-white/5 py-2 text-white">EVEN</button>
          <button onClick={() => addBet({ key: "odd", payout: 1, label: "ODD", resolver: (n) => n % 2 === 1 })} className="rounded border border-white/20 bg-white/5 py-2 text-white">ODD</button>
          <button onClick={() => addBet({ key: "low", payout: 1, label: "1-18", resolver: (n) => n >= 1 && n <= 18 })} className="rounded border border-white/20 bg-white/5 py-2 text-white">1-18</button>
          <button onClick={() => addBet({ key: "high", payout: 1, label: "19-36", resolver: (n) => n >= 19 && n <= 36 })} className="rounded border border-white/20 bg-white/5 py-2 text-white">19-36</button>
        </div>
      </div>

      {bets.length > 0 && (
        <div className="mb-4 rounded-2xl border border-cyan-500/25 bg-cyan-950/20 p-4">
          <p className="mb-2 text-sm font-semibold text-cyan-300">Active Bets</p>
          <div className="flex flex-wrap gap-2">
            {bets.map((b) => (
              <span key={b.key} className="rounded-full border border-cyan-400/30 bg-cyan-900/20 px-3 py-1 text-xs text-cyan-200">
                {b.label}: ${b.amount}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <button onClick={spin} disabled={spinning || bets.length === 0} className="rounded-xl bg-emerald-500 px-4 py-2 font-bold text-black disabled:opacity-50">{spinning ? "SPINNING..." : "SPIN"}</button>
        <button onClick={clearBets} disabled={spinning || bets.length === 0} className="rounded-xl border border-red-400/40 bg-red-950/30 px-4 py-2 text-red-200 disabled:opacity-50">Clear</button>
      </div>
    </div>
  );
}
