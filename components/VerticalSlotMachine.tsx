"use client";

import { useState, useEffect, useRef } from "react";
import { performSpin, VEGAS_PAYLINES, type SpinResult, type SlotConfig } from "@/engine/advancedSlotEngine";
import LuxeButton from "@/components/LuxeButton";
import Image from "next/image";

interface SlotMachineProps {
  cfg: any;
}

export default function VerticalSlotMachine({ cfg }: SlotMachineProps) {
  const [bet, setBet] = useState<number>(cfg.minBet);
  const [balance, setBalance] = useState<number>(10000);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [animatingWin, setAnimatingWin] = useState(false);
  const [heldReels, setHeldReels] = useState<boolean[]>([false, false, false, false, false]);
  const [holdAndWinActive, setHoldAndWinActive] = useState(false);
  const [holdAndWinPositions, setHoldAndWinPositions] = useState<boolean[][]>([]);
  const [respinsRemaining, setRespinsRemaining] = useState(0);
  
  const slotConfig: SlotConfig = {
    symbols: cfg.symbols,
    symbolWeights: cfg.symbolWeights || {},
    payTable: cfg.payTable,
    paylines: VEGAS_PAYLINES,
    rtp: cfg.rtp || 96,
    volatility: cfg.volatility || 'medium',
    wildSymbol: cfg.wildSymbol,
    scatterSymbol: cfg.scatterSymbol,
    bonusSymbol: cfg.bonusSymbol
  };

  const handleSpin = async () => {
    if (spinning || balance < bet) return;

    setSpinning(true);
    setBalance(prev => prev - bet);
    setAnimatingWin(false);

    // Simulate vertical scroll animation
    await new Promise(resolve => setTimeout(resolve, 2500));

    const result = performSpin(slotConfig, bet);
    setSpinResult(result);
    setSpinning(false);

    // Check for Hold & Win trigger
    if (cfg.bonusFeatures?.holdAndWin) {
      const triggerSymbol = cfg.bonusFeatures.holdAndWin.triggerSymbol;
      const minSymbols = cfg.bonusFeatures.holdAndWin.minSymbols;
      let triggerCount = 0;
      
      result.reels.forEach(reel => {
        reel.forEach(symbol => {
          if (symbol === triggerSymbol) triggerCount++;
        });
      });

      if (triggerCount >= minSymbols) {
        setHoldAndWinActive(true);
        setRespinsRemaining(cfg.bonusFeatures.holdAndWin.respins);
        // Mark positions with trigger symbols
        const positions = result.reels.map(reel => 
          reel.map(symbol => symbol === triggerSymbol)
        );
        setHoldAndWinPositions(positions);
      }
    }

    if (result.totalWin > 0) {
      setBalance(prev => prev + result.totalWin);
      setAnimatingWin(true);
      setTimeout(() => setAnimatingWin(false), 3000);
    }

    // Reset held reels after spin
    setHeldReels([false, false, false, false, false]);
  };

  const toggleHold = (reelIndex: number) => {
    if (spinning || holdAndWinActive) return;
    const newHeldReels = [...heldReels];
    newHeldReels[reelIndex] = !newHeldReels[reelIndex];
    setHeldReels(newHeldReels);
  };

  const getSymbolImage = (symbol: string) => {
    const symbolMap: Record<string, string> = {
      // Original symbols
      'CROWN': '/assets/symbols/crown.png',
      'GEM': '/assets/symbols/gem.png',
      'VAULT': '/assets/symbols/vault.png',
      'RING': '/assets/symbols/ring.png',
      'KEY': '/assets/symbols/key.png',
      'ACE': '/assets/symbols/ace.png',
      'KING': '/assets/symbols/king.png',
      'QUEEN': '/assets/symbols/queen.png',
      // Pharaoh's Fortune theme
      'PHARAOH': '/assets/symbols/crown.png',
      'CLEOPATRA': '/assets/symbols/queen.png',
      'SCARAB': '/assets/symbols/gem.png',
      'ANKH': '/assets/symbols/key.png',
      'PYRAMID': '/assets/symbols/vault.png',
      // Dragon's Hoard theme
      'DRAGON': '/assets/symbols/crown.png',
      'TREASURE': '/assets/symbols/vault.png',
      'SWORD': '/assets/symbols/key.png',
      'SHIELD': '/assets/symbols/ring.png',
      'CASTLE': '/assets/symbols/vault.png',
      // Ocean's Treasure theme
      'MERMAID': '/assets/symbols/queen.png',
      'PEARL': '/assets/symbols/gem.png',
      'DOLPHIN': '/assets/symbols/ring.png',
      'SHELL': '/assets/symbols/vault.png',
      'CORAL': '/assets/symbols/key.png'
    };
    return symbolMap[symbol] || '/assets/symbols/crown.png';
  };

  const grid = spinResult 
    ? [0, 1, 2].map(r => [0, 1, 2, 3, 4].map(c => spinResult.reels[c][r]))
    : [0, 1, 2].map(r => [0, 1, 2, 3, 4].map(c => cfg.symbols[0]));

  const getThemeColors = () => {
    switch(cfg.theme) {
      case 'ancient-egypt':
        return {
          primary: 'from-amber-900/50 via-yellow-800/50 to-amber-900/50',
          border: 'border-amber-500/30',
          glow: 'shadow-amber-500/50',
          text: 'text-amber-400'
        };
      case 'fantasy-dragon':
        return {
          primary: 'from-red-900/50 via-orange-800/50 to-red-900/50',
          border: 'border-red-500/30',
          glow: 'shadow-red-500/50',
          text: 'text-red-400'
        };
      case 'underwater-adventure':
        return {
          primary: 'from-blue-900/50 via-cyan-800/50 to-blue-900/50',
          border: 'border-cyan-500/30',
          glow: 'shadow-cyan-500/50',
          text: 'text-cyan-400'
        };
      default:
        return {
          primary: 'from-purple-950/50 via-black to-purple-950/50',
          border: 'border-amber-600/40',
          glow: 'shadow-amber-500/50',
          text: 'text-amber-400'
        };
    }
  };

  const theme = getThemeColors();

  return (
    <div className="relative">
      {/* Machine Frame */}
      <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-b from-black/60 via-black/40 to-black/60 p-8 shadow-2xl backdrop-blur-md">
        
        {/* Top Display */}
        <div className="mb-6 rounded-2xl border border-amber-500/20 bg-black/40 p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-500/60">Balance</div>
              <div className="mt-1 text-2xl font-bold text-amber-400">{balance.toLocaleString()} AUD</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-500/60">Bet</div>
              <div className="mt-1 text-2xl font-bold text-amber-400">{bet.toLocaleString()} AUD</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-500/60">Win</div>
              <div className={`mt-1 text-2xl font-bold ${animatingWin ? 'animate-pulse text-yellow-300' : 'text-amber-400'}`}>
                {spinResult?.totalWin.toLocaleString() || 0} AUD
              </div>
            </div>
          </div>
        </div>

        {/* Hold & Win Banner */}
        {holdAndWinActive && (
          <div className="mb-4 animate-pulse rounded-2xl border-2 border-purple-500 bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 text-center shadow-lg shadow-purple-500/50">
            <div className="text-2xl font-bold text-purple-300">🎰 HOLD & WIN ACTIVE! 🎰</div>
            <div className="mt-2 text-lg text-purple-200">Respins Remaining: {respinsRemaining}</div>
          </div>
        )}

        {/* Reels Display - Vertical Scrolling */}
        <div className={`relative mb-6 rounded-3xl border-4 ${theme.border} bg-gradient-to-br ${theme.primary} p-6 shadow-inner`}>
          
          {/* Reels Grid */}
          <div className="grid grid-cols-5 gap-3">
            {[0, 1, 2, 3, 4].map((colIdx) => (
              <div key={colIdx} className="relative">
                {/* Hold Button */}
                {!holdAndWinActive && spinResult && (
                  <button
                    onClick={() => toggleHold(colIdx)}
                    className={`mb-2 w-full rounded-lg px-2 py-1 text-xs font-bold transition ${
                      heldReels[colIdx]
                        ? 'bg-yellow-500 text-black'
                        : 'bg-black/40 text-yellow-400 hover:bg-black/60'
                    }`}
                  >
                    {heldReels[colIdx] ? 'HELD' : 'HOLD'}
                  </button>
                )}
                
                {/* Vertical Reel */}
                <div className="space-y-3">
                  {[0, 1, 2].map((rowIdx) => (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                        spinning && !heldReels[colIdx]
                          ? `animate-scroll-vertical ${theme.border} bg-gradient-to-br ${theme.primary}`
                          : heldReels[colIdx]
                          ? 'border-yellow-400 bg-yellow-500/20 shadow-lg shadow-yellow-500/50'
                          : holdAndWinPositions[colIdx]?.[rowIdx]
                          ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/50'
                          : `${theme.border} bg-gradient-to-br ${theme.primary}`
                      }`}
                    >
                      {!spinning || heldReels[colIdx] ? (
                        <div className="relative h-full w-full p-2">
                          <Image
                            src={getSymbolImage(grid[rowIdx][colIdx])}
                            alt={grid[rowIdx][colIdx]}
                            fill
                            className="object-contain drop-shadow-2xl"
                          />
                          {/* Symbol Label */}
                          <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold ${theme.text}`}>
                            {grid[rowIdx][colIdx]}
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl">
                          <div className={`animate-bounce ${theme.text}`}>?</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Winning Display */}
        {spinResult && spinResult.wins.length > 0 && (
          <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <div className="text-xs uppercase tracking-wider text-emerald-400/80">Winning Combinations</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {spinResult.wins.map((win, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-emerald-500/40 bg-emerald-900/20 px-3 py-1 text-sm text-emerald-300"
                >
                  {win.symbol} x{win.count} = {(win.payout * bet).toLocaleString()} AUD
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bonus Trigger */}
        {spinResult?.bonusTriggered && (
          <div className="mb-4 animate-pulse rounded-2xl border-2 border-purple-500 bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 text-center shadow-lg shadow-purple-500/50">
            <div className="text-2xl font-bold text-purple-300">🎰 FREE SPINS TRIGGERED! 🎰</div>
            <div className="mt-2 text-lg text-purple-200">{spinResult.freeSpinsAwarded} Free Spins Awarded!</div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-amber-500/60">Bet Amount</label>
              <div className="mt-1 flex items-center gap-2">
                <button
                  onClick={() => setBet(Math.max(cfg.minBet, bet - cfg.minBet))}
                  disabled={spinning}
                  className="rounded-lg border border-amber-500/30 bg-amber-900/20 px-3 py-1 text-amber-400 transition hover:bg-amber-900/40 disabled:opacity-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={bet}
                  min={cfg.minBet}
                  max={cfg.maxBet}
                  onChange={(e) => setBet(Math.max(cfg.minBet, Math.min(cfg.maxBet, Number(e.target.value) || cfg.minBet)))}
                  disabled={spinning}
                  className="w-24 rounded-lg border border-amber-500/30 bg-black/40 px-3 py-2 text-center text-amber-400 outline-none disabled:opacity-50"
                />
                <button
                  onClick={() => setBet(Math.min(cfg.maxBet, bet + cfg.minBet))}
                  disabled={spinning}
                  className="rounded-lg border border-amber-500/30 bg-amber-900/20 px-3 py-1 text-amber-400 transition hover:bg-amber-900/40 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <LuxeButton
              label={spinning ? "SPINNING..." : holdAndWinActive ? "RESPIN" : "SPIN"}
              variant="gold"
              onClick={handleSpin}
              disabled={spinning || balance < bet}
            />
            <div className="text-center text-xs text-amber-500/50">
              RTP: {cfg.rtp}% | {cfg.volatility.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Machine Info */}
        <div className="mt-4 rounded-2xl border border-amber-500/20 bg-black/20 p-3 text-xs text-amber-500/60">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <div>Wild: {cfg.wildSymbol || 'None'}</div>
            <div>Scatter: {cfg.scatterSymbol || 'None'}</div>
            <div>Max Win: {cfg.baseJackpot.toLocaleString()} AUD</div>
            <div>Paylines: {cfg.paylines}</div>
          </div>
        </div>
      </div>

      {/* CSS for vertical scroll animation */}
      <style jsx>{`
        @keyframes scroll-vertical {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        .animate-scroll-vertical {
          animation: scroll-vertical 0.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
