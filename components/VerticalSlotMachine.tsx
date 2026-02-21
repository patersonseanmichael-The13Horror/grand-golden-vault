"use client";

import { useEffect, useMemo, useState } from "react";
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

const MACHINE_SHELLS = [
  "from-[#080808] via-[#1c1408]/50 to-black border-amber-400/40",
  "from-[#09070b] via-[#2a120e]/45 to-black border-rose-300/40",
  "from-[#070a0b] via-[#0f2a24]/45 to-black border-emerald-300/40",
  "from-[#0b0907] via-[#2a240f]/45 to-black border-yellow-200/40",
  "from-[#07070d] via-[#17163a]/45 to-black border-indigo-200/40",
  "from-[#090707] via-[#3a1616]/45 to-black border-red-200/40",
  "from-[#09090a] via-[#2b203e]/45 to-black border-violet-200/40",
  "from-[#07090a] via-[#0f2531]/45 to-black border-cyan-200/40",
];

const REQUIRED_BET_STEPS = [0.1, 0.25, 0.5, 1, 2.5, 3, 6, 10, 20, 50, 100, 250, 500];

const PREMIUM_TRAIT_STYLES: Record<string, string> = {
  "platinum-aegis": "shadow-[0_0_45px_rgba(148,163,184,0.25)] ring-1 ring-slate-300/20",
  "platinum-eclipse": "shadow-[0_0_45px_rgba(244,244,245,0.22)] ring-1 ring-zinc-200/25",
  "platinum-monarch": "shadow-[0_0_45px_rgba(196,181,253,0.24)] ring-1 ring-violet-200/25",
  "platinum-radiance": "shadow-[0_0_45px_rgba(103,232,249,0.24)] ring-1 ring-cyan-200/25",
  "platinum-sovereign": "shadow-[0_0_50px_rgba(251,191,36,0.26)] ring-1 ring-amber-200/30",
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

const resolveMachineShell = (id?: string): string => {
  const machineNumber = Number.parseInt(String(id || "0"), 10);
  if (!Number.isFinite(machineNumber) || machineNumber <= 0) {
    return MACHINE_SHELLS[0];
  }
  return MACHINE_SHELLS[(machineNumber - 1) % MACHINE_SHELLS.length];
};

export default function VerticalSlotMachine({ cfg }: SlotMachineProps) {
  const { balance, credit, debit } = useSharedWallet();

  const activeRtp = getActiveRtp(cfg.rtp || 96, cfg.rtpProfile);
  const machineBetSteps = useMemo(() => {
    const source = Array.isArray(cfg.betSteps) ? cfg.betSteps : REQUIRED_BET_STEPS;
    const normalized = [...new Set(source.map((v: number) => Number(v)).filter((v: number) => Number.isFinite(v) && v >= cfg.minBet && v <= cfg.maxBet))]
      .map((v) => +v.toFixed(2))
      .sort((a, b) => a - b);
    return normalized.length > 0 ? normalized : REQUIRED_BET_STEPS.filter((v) => v >= cfg.minBet && v <= cfg.maxBet);
  }, [cfg.betSteps, cfg.maxBet, cfg.minBet]);

  const [bet, setBet] = useState<number>(machineBetSteps[0] ?? cfg.minBet);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [animatingWin, setAnimatingWin] = useState(false);
  const [jackpotWinActive, setJackpotWinActive] = useState(false);
  const [bigWinActive, setBigWinActive] = useState(false);
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [holdAndWinActive, setHoldAndWinActive] = useState(false);
  const [holdAndWinPositions, setHoldAndWinPositions] = useState<boolean[][]>([]);

  useEffect(() => {
    if (!machineBetSteps.includes(bet)) {
      setBet(machineBetSteps[0] ?? cfg.minBet);
    }
  }, [bet, cfg.minBet, machineBetSteps]);

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

  const shellTheme = THEME_STYLES[cfg.theme as string] || resolveMachineShell(cfg.id);
  const premiumTraitStyle = PREMIUM_TRAIT_STYLES[cfg.machineTrait as string] || "";
  const isPremiumTraitMachine = Boolean(cfg.machineTrait);
  const betIndex = machineBetSteps.findIndex((v) => v === bet);

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

  const setBetByIndex = (index: number) => {
    if (machineBetSteps.length === 0) return;
    const clamped = Math.max(0, Math.min(machineBetSteps.length - 1, index));
    setBet(machineBetSteps[clamped]);
  };

  const runSpin = async () => {
    const isFreeSpin = freeSpinsRemaining > 0;
    if (spinning || (!isFreeSpin && balance < bet)) return;

    setSpinning(true);
    setAnimatingWin(false);
    setJackpotWinActive(false);
    setBigWinActive(false);

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
      const jackpotThreshold = Math.max(1500, bet * 200);
      const bigWinThreshold = bet * 50;
      if (result.totalWin >= jackpotThreshold) {
        setJackpotWinActive(true);
      } else if (result.totalWin >= bigWinThreshold) {
        setBigWinActive(true);
      }
      setTimeout(() => setAnimatingWin(false), 2600);
      setTimeout(() => {
        setJackpotWinActive(false);
        setBigWinActive(false);
      }, 4200);
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
    <div className={`rounded-3xl border-2 bg-gradient-to-b p-8 shadow-2xl shadow-amber-700/20 backdrop-blur-md ${shellTheme} ${premiumTraitStyle}`}>
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
              {jackpotWinActive ? "PLATINUM JACKPOT" : bigWinActive ? "BIG WIN" : animatingWin ? "WIN" : spinning ? "SPINNING" : "READY"}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-purple-400/25 bg-purple-950/20 p-3 text-sm text-purple-100/85">
          <div className="text-xs uppercase tracking-[0.18em] text-purple-300/70">Bonus Feature 1</div>
          <div className="mt-1 font-semibold">Hold & Win</div>
          <div className="text-xs text-purple-200/70">Activates with trigger symbols during Feature Spins.</div>
        </div>
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-950/20 p-3 text-sm text-emerald-100/85">
          <div className="text-xs uppercase tracking-[0.18em] text-emerald-300/70">Bonus Feature 2</div>
          <div className="mt-1 font-semibold">Feature Spins</div>
          <div className="text-xs text-emerald-200/70">Scatter-triggered free spins with premium reel pacing.</div>
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
        <div className={`mb-4 rounded-2xl border p-4 text-center ${jackpotWinActive ? "animate-jackpot border-amber-300/55 bg-amber-950/35" : bigWinActive ? "border-cyan-300/45 bg-cyan-950/25" : "border-emerald-500/30 bg-emerald-950/20"}`}>
          <div className={`text-2xl font-bold ${jackpotWinActive ? "text-amber-200" : bigWinActive ? "text-cyan-200" : "text-emerald-300"}`}>
            {jackpotWinActive ? "Platinum Jackpot" : bigWinActive ? "Big Win" : "Congratulations"} • {spinResult.totalWin.toLocaleString(undefined, { maximumFractionDigits: 3 })} AUD
          </div>
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
            <button onClick={() => setBetByIndex(betIndex - 1)} disabled={spinning || betIndex <= 0} className="rounded-lg border border-amber-500/30 bg-amber-900/20 px-3 py-1 text-amber-400 disabled:opacity-50">-</button>
            <input type="text" value={`${bet.toFixed(2)} AUD`} readOnly className="w-32 rounded-lg border border-amber-500/30 bg-black/40 px-3 py-2 text-center text-amber-300 outline-none" />
            <button onClick={() => setBetByIndex(betIndex + 1)} disabled={spinning || betIndex >= machineBetSteps.length - 1} className="rounded-lg border border-amber-500/30 bg-amber-900/20 px-3 py-1 text-amber-400 disabled:opacity-50">+</button>
          </div>
          <div className="mt-2 flex max-w-[520px] flex-wrap gap-1.5">
            {machineBetSteps.map((step) => (
              <button
                key={step}
                onClick={() => setBet(step)}
                disabled={spinning}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${step === bet ? "bg-amber-400 text-black" : "border border-amber-300/30 bg-black/35 text-amber-100/80 hover:border-amber-200/50"} disabled:opacity-50`}
              >
                ${step.toFixed(2)}
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs text-white/60">Limits: {cfg.minBet.toFixed(2)} AUD - {cfg.maxBet.toFixed(2)} AUD</div>
        </div>

        <LuxeButton label={spinning ? "SPINNING..." : freeSpinsRemaining > 0 ? `FREE SPIN (${freeSpinsRemaining})` : "SPIN"} variant="gold" onClick={runSpin} disabled={spinning || (freeSpinsRemaining === 0 && balance < bet)} />
      </div>

      <div className="mt-3 text-center text-xs text-amber-300/70">
        RTP Phase: {cfg.rtpProfile?.launchBand || "standard"} now → {cfg.rtpProfile?.postLaunchBand || "standard"} after {cfg.rtpProfile?.switchAfterDays || 10} days. Active RTP: {activeRtp.toFixed(1)}% {isPremiumTraitMachine ? "• Platinum Signature Machine" : ""}
      </div>
    </div>
  );
}
