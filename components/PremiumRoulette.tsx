"use client";

import { useMemo, useState } from "react";
import { useSharedWallet } from "@/lib/useSharedWallet";

type Bet = {
  key: string;
  amount: number;
  payout: number;
  resolver: (n: number) => boolean;
};

const AI_CROUPIER = "Valentino";
const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const WHEEL_ORDER = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

export default function PremiumRoulette() {
  const { balance, credit, debit } = useSharedWallet();
  const [chip, setChip] = useState(10);
  const [bets, setBets] = useState<Bet[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [message, setMessage] = useState("Valentino is ready. Place premium bets to begin.");

  const totalBet = useMemo(() => bets.reduce((sum, b) => sum + b.amount, 0), [bets]);

  const addBet = (bet: Omit<Bet, "amount">) => {
    if (spinning || !debit(chip)) return;
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
    credit(totalBet);
    setBets([]);
    setMessage("Table cleared. Reposition your chips.");
  };

  const spin = async () => {
    if (spinning || bets.length === 0) return;
    setSpinning(true);
    setMessage("Valentino spins the wheel. Ball velocity and bounce are live...");

    await new Promise((r) => setTimeout(r, 2600));

    // Very low-to-low RTP pressure: bias 68% toward non-winning outcomes.
    const randomResult = Math.floor(Math.random() * 37);
    const allWinningNumbers = new Set<number>();
    bets.forEach((bet) => {
      for (let n = 0; n <= 36; n++) if (bet.resolver(n)) allWinningNumbers.add(n);
    });
    const shouldForceLose = Math.random() < 0.68;
    const result = shouldForceLose
      ? WHEEL_ORDER.find((n) => !allWinningNumbers.has(n)) ?? randomResult
      : randomResult;

    setWinningNumber(result);

    let payout = 0;
    bets.forEach((bet) => {
      if (bet.resolver(result)) payout += bet.amount * (bet.payout + 1);
    });

    if (payout > 0) {
      credit(payout);
      setMessage(`Result ${result}. Valentino confirms payout: ${payout.toLocaleString()} AUD.`);
    } else {
      setMessage(`Result ${result}. House edge holds this round.`);
    }

    setBets([]);
    setSpinning(false);
  };

  const numberButtons = Array.from({ length: 36 }, (_, i) => i + 1);

  return (
    <div className="rounded-3xl border-2 border-amber-500/30 bg-[radial-gradient(circle_at_50%_10%,rgba(180,83,9,0.28),rgba(2,6,23,0.96))] p-4 md:p-6 shadow-2xl">
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-white/60">Shared Wallet</p>
          <p className="mt-1 text-2xl font-bold text-amber-300">{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AUD</p>
          <p className="mt-1 text-sm text-white/65">Active bet: {totalBet.toLocaleString()} AUD</p>
        </div>
        <div className="rounded-2xl border border-purple-500/25 bg-purple-950/20 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-purple-200/70">AI Dealer</p>
          <p className="mt-1 text-lg font-semibold text-purple-200">{AI_CROUPIER} • High Roller Focus</p>
          <p className="text-sm text-white/70">Restricted dealer tools: navigation and deposit-assist only.</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">Wheel/Board Sync</p>
          <p className="mt-1 text-sm text-white/80">Wheel sequence matches table numbers in European order.</p>
          <p className="text-sm text-white/70">RTP profile: very low → low.</p>
        </div>
      </div>

      <p className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">{message}</p>

      <div className="mb-4 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <div className="rounded-3xl border border-amber-500/30 bg-black/35 p-4">
          <h3 className="mb-3 text-lg font-semibold text-amber-300">Premium Roulette Board</h3>
          <div className="mb-3 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
            {[10, 50, 100].map((value) => (
              <button key={value} onClick={() => setChip(value)} className={`rounded-full px-4 py-2 text-sm font-semibold ${chip === value ? "bg-amber-400 text-black" : "border border-white/20 bg-white/5 text-white/80"}`}>
                ${value}
              </button>
            ))}
          </div>

          <div className="grid gap-2 md:grid-cols-[64px_1fr]">
            <button onClick={() => addBet({ key: "straight-0", payout: 35, resolver: (n) => n === 0 })} className="rounded-lg bg-green-600 py-5 font-bold text-white hover:bg-green-500">0</button>
            <div className="grid grid-cols-6 gap-1 sm:grid-cols-9 md:grid-cols-12">
              {numberButtons.map((n) => (
                <button
                  key={n}
                  onClick={() => addBet({ key: `straight-${n}`, payout: 35, resolver: (v) => v === n })}
                  className={`rounded py-2 text-xs sm:text-sm font-bold text-white ${RED_NUMBERS.has(n) ? "bg-red-600 hover:bg-red-500" : "bg-slate-900 hover:bg-slate-800"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button onClick={() => addBet({ key: "red", payout: 1, resolver: (n) => RED_NUMBERS.has(n) })} className="rounded bg-red-700 py-2 font-semibold text-white">RED</button>
            <button onClick={() => addBet({ key: "black", payout: 1, resolver: (n) => n !== 0 && !RED_NUMBERS.has(n) })} className="rounded bg-zinc-900 py-2 font-semibold text-white">BLACK</button>
            <button onClick={() => addBet({ key: "odd", payout: 1, resolver: (n) => n !== 0 && n % 2 === 1 })} className="rounded bg-indigo-800 py-2 font-semibold text-white">ODD</button>
            <button onClick={() => addBet({ key: "even", payout: 1, resolver: (n) => n !== 0 && n % 2 === 0 })} className="rounded bg-sky-800 py-2 font-semibold text-white">EVEN</button>
          </div>
        </div>

        <div className="rounded-3xl border border-amber-500/30 bg-black/35 p-4">
          <h3 className="mb-2 text-lg font-semibold text-amber-300">Las Vegas Wheel</h3>
          <div className={`relative mx-auto h-56 w-56 rounded-full border-8 border-amber-500/50 bg-[conic-gradient(#16a34a_0deg,#111827_40deg,#dc2626_80deg,#111827_120deg,#dc2626_160deg,#111827_200deg,#dc2626_240deg,#111827_280deg,#dc2626_320deg,#16a34a_360deg)] ${spinning ? "animate-spin" : ""}`}>
            <div className="absolute inset-5 rounded-full border border-white/20 bg-black/65" />
            <div className={`absolute left-1/2 top-3 h-4 w-4 -translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_#fff] ${spinning ? "animate-bounce" : ""}`} />
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-amber-200">{winningNumber ?? "•"}</div>
          </div>
          <div className="mt-3 grid grid-cols-6 gap-1 text-[10px] text-white/70">
            {WHEEL_ORDER.slice(0, 24).map((n) => (
              <div key={n} className="rounded bg-white/5 px-1 py-1 text-center">{n}</div>
            ))}
          </div>
        </div>

      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <button onClick={spin} disabled={spinning || bets.length === 0} className="rounded-xl bg-emerald-500 px-4 py-2 font-bold text-black disabled:opacity-50">{spinning ? "SPINNING..." : "SPIN"}</button>
        <button onClick={clearBets} disabled={spinning || bets.length === 0} className="rounded-xl border border-red-400/40 bg-red-950/30 px-4 py-2 text-red-200 disabled:opacity-50">Clear</button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <button onClick={spin} disabled={spinning || bets.length === 0} className="rounded-xl bg-amber-500 px-4 py-3 font-semibold text-black disabled:opacity-50">{spinning ? "Valentino Spinning..." : "Spin Wheel"}</button>
        <button onClick={clearBets} disabled={spinning || bets.length === 0} className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 font-semibold text-white disabled:opacity-50">Clear Bets</button>
      </div>
    </div>
  );
}
