"use client";

import { useMemo, useState } from "react";
import { getActiveRtp } from "@/lib/rtpPhase";
import { performSpin, VEGAS_PAYLINES, type SpinResult, type SlotConfig } from "@/engine/advancedSlotEngine";
import LuxeButton from "@/components/LuxeButton";
import Image from "next/image";
import { useSharedWallet } from "@/lib/useSharedWallet";

interface SlotMachineProps {
  cfg: any;
}

const THEME_STYLES: Record<string, string> = {
  "ancient-egypt": "from-amber-950/80 via-yellow-900/35 to-black border-amber-300/40",
  "fantasy-dragon": "from-red-950/80 via-orange-900/35 to-black border-red-300/45",
  "underwater-adventure": "from-cyan-950/80 via-blue-900/35 to-black border-cyan-300/45",
};

const resolveBaseSymbol = (symbol: string): string => {
  const normalized = symbol.trim().toUpperCase();
  if (!normalized) return "CROWN";
  // Symbols may be namespaced (e.g. OBSIDIAN__CROWN); map to canonical key for image lookup.
  const base = normalized.split("__").pop();
  return base && base.length > 0 ? base : normalized;
};

const resolveSymbolNamespace = (symbol: string): string => {
  const normalized = symbol.trim().toUpperCase();
  if (!normalized.includes("__")) return "DEFAULT";
  return normalized.split("__")[0] || "DEFAULT";
};

const namespaceHue = (namespace: string): number => {
  let hash = 0;
  for (let i = 0; i < namespace.length; i++) {
    hash = (hash * 31 + namespace.charCodeAt(i)) % 360;
  }
  return hash;
};

export default function VerticalSlotMachine({ cfg }: SlotMachineProps) {
  const { balance, credit, debit } = useSharedWallet();

  const [bet, setBet] = useState<number>(cfg.minBet);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [animatingWin, setAnimatingWin] = useState(false);
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [holdAndWinActive, setHoldAndWinActive] = useState(false);
  const [holdAndWinPositions, setHoldAndWinPositions] = useState<boolean[][]>([]);

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

  const shellTheme = THEME_STYLES[cfg.theme as string] || "from-[#080808] via-[#1c1408]/50 to-black border-amber-400/40";

  const getSymbolImage = (symbol: string) => {
    const key = resolveBaseSymbol(symbol);
    const custom = cfg?.symbolVisuals?.[symbol];
    if (typeof custom === "string" && custom.trim().length > 0) {
      return custom;
    }
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

    return symbolMap[key] || "/assets/symbols/crown.png";
  };

  const getSymbolStyle = (symbol: string) => {
    const namespace = resolveSymbolNamespace(symbol);
    const hue = namespaceHue(namespace);
    return {
      borderColor: `hsla(${hue}, 75%, 62%, 0.45)`,
      boxShadow: `0 0 18px hsla(${hue}, 72%, 58%, 0.22)`,
      imageFilter: `hue-rotate(${hue}deg) saturate(1.22)`,
      tagColor: `hsla(${hue}, 82%, 70%, 0.9)`,
    };
  };

  const previewGrid = useMemo(() => [0, 1, 2].map(() => [0, 1, 2, 3, 4].map((c) => cfg.symbols[(c + 2) % cfg.symbols.length])), [cfg.symbols]);

  const runSpin = async () => {
    const isFreeSpin = freeSpinsRemaining > 0;
    if (spinning || (!isFreeSpin && balance < bet)) return;

    setSpinning(true);
    setAnimatingWin(false);

    if (!isFreeSpin) {
      if (!debit(bet)) {
        setSpinning(false);
        return;
      }
    } else {
      setFreeSpinsRemaining((prev) => Math.max(0, prev - 1));
    }

    await new Promise((resolve) => setTimeout(resolve, 1600));

    const result = performSpin(slotConfig, bet);
    setSpinResult(result);
    setSpinning(false);

    if (result.totalWin > 0) {
      credit(result.totalWin);
      setAnimatingWin(true);
      setTimeout(() => setAnimatingWin(false), 2600);
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
    : previewGrid;

  return (
    <div className={`rounded-3xl border-2 bg-gradient-to-b p-8 shadow-2xl shadow-amber-700/20 backdrop-blur-md ${shellTheme}`}>
      <div className="mb-6 rounded-2xl border border-amber-500/20 bg-black/45 p-4">
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-500/60">Balance</div>
            <div className="mt-1 text-2xl font-bold text-amber-300">{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AUD</div>
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
            <div className={`mt-1 text-xl font-bold ${animatingWin ? "text-emerald-300" : spinning ? "text-amber-200" : "text-white"}`}>
              {animatingWin ? "MEGA WIN" : spinning ? "SPINNING" : "READY"}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-white/10 bg-black/30 p-4 ring-1 ring-amber-300/20">
        <div className="grid grid-cols-5 gap-3">
          {[0, 1, 2, 3, 4].map((colIdx) => (
            <div key={colIdx} className="space-y-3">
              {[0, 1, 2].map((rowIdx) => {
                const symbol = grid[rowIdx][colIdx];
                const visual = getSymbolStyle(symbol);
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`group relative aspect-square overflow-hidden rounded-full border-2 transition-all duration-300 ${
                      holdAndWinPositions[colIdx]?.[rowIdx]
                        ? "border-purple-300 bg-purple-500/20 shadow-[0_0_28px_rgba(168,85,247,0.45)]"
                        : "border-amber-300/30 bg-gradient-to-br from-black to-amber-950/30"
                    }`}
                    style={holdAndWinPositions[colIdx]?.[rowIdx] ? undefined : { borderColor: visual.borderColor, boxShadow: visual.boxShadow }}
                  >
                    <div
                      className={`absolute inset-2 rounded-full border border-white/10 ${spinning ? "animate-spin" : ""}`}
                      style={{ animationDuration: spinning ? `${500 + colIdx * 140}ms` : undefined }}
                    />
                    <div className="relative h-full w-full p-3">
                      <Image
                        src={getSymbolImage(symbol)}
                        alt={symbol}
                        fill
                        className={`object-contain drop-shadow-2xl transition-transform duration-500 ${spinning ? "scale-110" : "group-hover:scale-105"}`}
                        style={{ filter: visual.imageFilter }}
                      />
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold" style={{ color: visual.tagColor }}>
                        {resolveBaseSymbol(symbol)}
                      </div>
                    </div>
                  </div>
                );
              })}
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
          <div className="mt-2 text-xs text-white/60">Limits: {cfg.minBet.toFixed(2)} AUD - {cfg.maxBet.toFixed(2)} AUD</div>
        </div>

        <LuxeButton label={spinning ? "SPINNING..." : freeSpinsRemaining > 0 ? `FREE SPIN (${freeSpinsRemaining})` : "SPIN"} variant="gold" onClick={runSpin} disabled={spinning || (freeSpinsRemaining === 0 && balance < bet)} />
      </div>

      <div className="mt-3 text-center text-xs text-amber-300/70">
        RTP Phase: {cfg.rtpProfile?.launchBand || "standard"} now → {cfg.rtpProfile?.postLaunchBand || "standard"} after {cfg.rtpProfile?.switchAfterDays || 10} days. Active RTP: {activeRtp.toFixed(1)}%
      </div>
    </div>
  );
}
