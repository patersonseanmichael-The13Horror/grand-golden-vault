"use client";

import { useEffect, useMemo, useState } from "react";
import { getActiveRtp } from "@/lib/rtpPhase";
import { performSpin, VEGAS_PAYLINES, type SpinResult, type SlotConfig } from "@/engine/advancedSlotEngine";
import LuxeButton from "@/components/LuxeButton";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";

interface SlotMachineProps {
  cfg: any;
}

const STARTING_BALANCE = 10000;

export default function VerticalSlotMachine({ cfg }: SlotMachineProps) {
  const { user } = useAuth();
  const storageKey = useMemo(() => `vv.wallet.${user?.uid ?? "guest"}`, [user?.uid]);

  const [bet, setBet] = useState<number>(cfg.minBet);
  const [balance, setBalance] = useState<number>(STARTING_BALANCE);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [animatingWin, setAnimatingWin] = useState(false);
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [holdAndWinActive, setHoldAndWinActive] = useState(false);
  const [holdAndWinPositions, setHoldAndWinPositions] = useState<boolean[][]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      setBalance(STARTING_BALANCE);
      return;
    }
    const parsed = Number(saved);
    if (Number.isFinite(parsed) && parsed >= 0) setBalance(parsed);
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, String(balance));
  }, [balance, storageKey]);

  const activeRtp = getActiveRtp(cfg.rtp || 96, cfg.rtpProfile);

  const slotConfig: SlotConfig = {
    symbols: cfg.symbols,
    symbolWeights: cfg.symbolWeights || {},
    payTable: cfg.payTable,
    paylines: VEGAS_PAYLINES,
    rtp: activeRtp,
    volatility: cfg.volatility || "medium",
    wildSymbol: cfg.wildSymbol,
    scatterSymbol: cfg.scatterSymbol,
    bonusSymbol: cfg.bonusSymbol,
  };

  const getSymbolImage = (symbol: string) => {
    const symbolMap: Record<string, string> = {
      CROWN: "/assets/symbols/crown.png",
      GEM: "/assets/symbols/gem.png",
      VAULT: "/assets/symbols/vault.png",
      RING: "/assets/symbols/ring.png",
      KEY: "/assets/symbols/key.png",
      ACE: "/assets/symbols/ace.png",
      KING: "/assets/symbols/king.png",
      QUEEN: "/assets/symbols/queen.png",
      JACK: "/assets/symbols/jack.svg",
      TEN: "/assets/symbols/ten.svg",
      DRAGON: "/assets/symbols/dragon.svg",
      TREASURE: "/assets/symbols/treasure.svg",
      KNIGHT: "/assets/symbols/knight.svg",
      SWORD_SHIELD: "/assets/symbols/sword-shield.svg",
      MERMAID: "/assets/symbols/mermaid.svg",
      PEARL: "/assets/symbols/pearl.svg",
      TRIDENT: "/assets/symbols/trident.svg",
      SHELL: "/assets/symbols/shell.svg",
      PHARAOH: "/assets/symbols/pharaoh.svg",
      PYRAMID: "/assets/symbols/pyramid.svg",
      SCARAB: "/assets/symbols/scarab.svg",
      ANKH: "/assets/symbols/ankh.svg",
    };

    return symbolMap[symbol] || "/assets/symbols/crown.png";
  };

  const runSpin = async () => {
    const isFreeSpin = freeSpinsRemaining > 0;
    if (spinning || (!isFreeSpin && balance < bet)) return;

    setSpinning(true);
    setAnimatingWin(false);

    if (!isFreeSpin) {
      setBalance((prev) => prev - bet);
    } else {
      setFreeSpinsRemaining((prev) => Math.max(0, prev - 1));
    }

    await new Promise((resolve) => setTimeout(resolve, 1800));

    const result = performSpin(slotConfig, bet);
    setSpinResult(result);
    setSpinning(false);

    if (result.totalWin > 0) {
      setBalance((prev) => prev + result.totalWin);
      setAnimatingWin(true);
      setTimeout(() => setAnimatingWin(false), 3000);
    }

    if (result.bonusTriggered && result.freeSpinsAwarded > 0) {
      setFreeSpinsRemaining((prev) => prev + result.freeSpinsAwarded);
    }

    if (cfg.bonusFeatures?.holdAndWin && (isFreeSpin || freeSpinsRemaining > 0)) {
      const triggerSymbol = cfg.bonusFeatures.holdAndWin.triggerSymbol;
      const triggerCount = result.reels.flat().filter((symbol) => symbol === triggerSymbol).length;
      const minSymbols = cfg.bonusFeatures.holdAndWin.minSymbols || 5;
      setHoldAndWinActive(triggerCount >= minSymbols);
      setHoldAndWinPositions(result.reels.map((reel: string[]) => reel.map((symbol) => symbol === triggerSymbol)));
    } else {
      setHoldAndWinActive(false);
      setHoldAndWinPositions([]);
    }
  };

  const grid = spinResult
    ? [0, 1, 2].map((r) => [0, 1, 2, 3, 4].map((c) => spinResult.reels[c][r]))
    : [0, 1, 2].map(() => [0, 1, 2, 3, 4].map(() => cfg.symbols[0]));

  return (
    <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-b from-black/60 via-black/40 to-black/60 p-8 shadow-2xl backdrop-blur-md">
      <div className="mb-6 rounded-2xl border border-amber-500/20 bg-black/40 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-500/60">Balance</div>
            <div className="mt-1 text-2xl font-bold text-amber-400">{balance.toLocaleString()} AUD</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-500/60">Bet</div>
            <div className="mt-1 text-2xl font-bold text-white">{bet.toFixed(2)} AUD</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-500/60">Free Spins</div>
            <div className="mt-1 text-2xl font-bold text-emerald-400">{freeSpinsRemaining}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-500/60">Status</div>
            <div className={`mt-1 text-xl font-bold ${animatingWin ? "text-emerald-400" : "text-white"}`}>
              {animatingWin ? "WIN" : spinning ? "SPINNING" : "READY"}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-white/10 bg-black/25 p-4">
        <div className="grid grid-cols-5 gap-3">
          {[0, 1, 2, 3, 4].map((colIdx) => (
            <div key={colIdx} className="space-y-3">
              {[0, 1, 2].map((rowIdx) => (
                <div key={`${rowIdx}-${colIdx}`} className={`relative aspect-square overflow-hidden rounded-2xl border-2 ${holdAndWinPositions[colIdx]?.[rowIdx] ? "border-purple-400 bg-purple-500/20" : "border-amber-500/30 bg-gradient-to-br from-purple-950/30 to-black"}`}>
                  <div className="relative h-full w-full p-2">
                    <Image src={getSymbolImage(grid[rowIdx][colIdx])} alt={grid[rowIdx][colIdx]} fill className="object-contain drop-shadow-2xl" />
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                      {grid[rowIdx][colIdx]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {spinResult && spinResult.totalWin > 0 && (
        <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-300">Congratulations, You Won {spinResult.totalWin.toLocaleString(undefined, { maximumFractionDigits: 3 })} AUD</div>
        </div>
      )}

      {holdAndWinActive && (
        <div className="mb-4 rounded-2xl border border-purple-500/30 bg-purple-950/20 p-3 text-sm text-purple-200">
          Hold & Win active (free spins only): trigger symbols are highlighted.
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <label className="text-xs uppercase tracking-wider text-amber-500/60">Bet Amount</label>
          <div className="mt-1 flex items-center gap-2">
            <button onClick={() => setBet((v) => Math.max(cfg.minBet, +(v - 0.1).toFixed(2)))} disabled={spinning} className="rounded-lg border border-amber-500/30 bg-amber-900/20 px-3 py-1 text-amber-400">-</button>
            <input type="number" step="0.1" value={bet} min={cfg.minBet} max={cfg.maxBet} onChange={(e) => setBet(Math.max(cfg.minBet, Math.min(cfg.maxBet, Number(e.target.value) || cfg.minBet)))} className="w-28 rounded-lg border border-amber-500/30 bg-black/40 px-3 py-2 text-center text-amber-400 outline-none" />
            <button onClick={() => setBet((v) => Math.min(cfg.maxBet, +(v + 0.1).toFixed(2)))} disabled={spinning} className="rounded-lg border border-amber-500/30 bg-amber-900/20 px-3 py-1 text-amber-400">+</button>
          </div>
        </div>

        <LuxeButton label={spinning ? "SPINNING..." : freeSpinsRemaining > 0 ? `FREE SPIN (${freeSpinsRemaining})` : "SPIN"} variant="gold" onClick={runSpin} disabled={spinning || (freeSpinsRemaining === 0 && balance < bet)} />
      </div>

      <div className="mt-3 text-center text-xs text-amber-300/70">
        RTP Phase: {cfg.rtpProfile?.launchBand || "standard"} now → {cfg.rtpProfile?.postLaunchBand || "standard"} after {cfg.rtpProfile?.switchAfterDays || 10} days. Active RTP: {activeRtp.toFixed(1)}%
      </div>
    </div>
  );
}
