"use client";

import { useState, useEffect } from "react";
import { performSpin, VEGAS_PAYLINES, type SpinResult, type SlotConfig } from "@/engine/advancedSlotEngine";
import LuxeButton from "@/components/LuxeButton";
import Image from "next/image";

interface SlotMachineProps {
  cfg: any; // JSON config
}

export default function AdvancedSlotMachine({ cfg }: SlotMachineProps) {
  const [bet, setBet] = useState<number>(cfg.minBet);
  const [balance, setBalance] = useState<number>(10000); // Demo balance
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [animatingWin, setAnimatingWin] = useState(false);
  const [showPaylines, setShowPaylines] = useState(false);
  const [selectedPayline, setSelectedPayline] = useState<number | null>(null);

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
    setSelectedPayline(null);

    // Simulate spin animation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = performSpin(slotConfig, bet);
    setSpinResult(result);
    setSpinning(false);

    if (result.totalWin > 0) {
      setBalance(prev => prev + result.totalWin);
      setAnimatingWin(true);
      
      // Animate through winning paylines
      if (result.wins.length > 0) {
        for (let i = 0; i < result.wins.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 800));
          setSelectedPayline(result.wins[i].paylineIndex);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSelectedPayline(null);
      }
      
      setTimeout(() => setAnimatingWin(false), 3000);
    }
  };

  const getSymbolImage = (symbol: string) => {
    const symbolMap: Record<string, string> = {
      'CROWN': '/assets/symbols/crown.png',
      'GEM': '/assets/symbols/gem.png',
      'VAULT': '/assets/symbols/vault.png',
      'RING': '/assets/symbols/ring.png',
      'KEY': '/assets/symbols/key.png',
      'ACE': '/assets/symbols/ace.png',
      'KING': '/assets/symbols/king.png',
      'QUEEN': '/assets/symbols/queen.png'
    };
    return symbolMap[symbol] || '/assets/symbols/crown.png';
  };

  const grid = spinResult 
    ? [0, 1, 2].map(r => [0, 1, 2, 3, 4].map(c => spinResult.reels[c][r]))
    : [0, 1, 2].map(r => [0, 1, 2, 3, 4].map(c => cfg.symbols[0]));

  const isWinningPosition = (row: number, col: number): boolean => {
    if (!spinResult || !selectedPayline) return false;
    const win = spinResult.wins.find(w => w.paylineIndex === selectedPayline);
    if (!win) return false;
    return win.positions.includes(row) && col < win.count;
  };

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

        {/* Reels Display */}
        <div className="relative mb-6 rounded-3xl border-4 border-amber-600/40 bg-gradient-to-br from-purple-950/50 via-black to-purple-950/50 p-6 shadow-inner">
          
          {/* Payline Overlay */}
          {showPaylines && selectedPayline !== null && (
            <div className="pointer-events-none absolute inset-0 z-10">
              <svg className="h-full w-full" viewBox="0 0 500 300">
                <polyline
                  points={VEGAS_PAYLINES[selectedPayline].map((row, col) => 
                    `${col * 100 + 50},${row * 100 + 50}`
                  ).join(' ')}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-pulse"
                />
              </svg>
            </div>
          )}

          {/* Reels Grid */}
          <div className="grid grid-rows-3 gap-3">
            {grid.map((row, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-5 gap-3">
                {row.map((symbol, colIdx) => (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                      spinning
                        ? 'animate-spin-slow border-amber-500/50 bg-gradient-to-br from-amber-900/30 to-purple-900/30'
                        : isWinningPosition(rowIdx, colIdx)
                        ? 'animate-pulse border-yellow-400 bg-yellow-500/20 shadow-lg shadow-yellow-500/50'
                        : 'border-amber-700/30 bg-gradient-to-br from-amber-900/20 to-purple-900/20'
                    }`}
                  >
                    {!spinning && (
                      <div className="relative h-full w-full p-2">
                        <Image
                          src={getSymbolImage(symbol)}
                          alt={symbol}
                          fill
                          className="object-contain drop-shadow-2xl"
                          style={{ filter: isWinningPosition(rowIdx, colIdx) ? 'brightness(1.5) drop-shadow(0 0 10px rgba(250, 204, 21, 0.8))' : 'none' }}
                        />
                      </div>
                    )}
                    {spinning && (
                      <div className="flex h-full items-center justify-center text-4xl">
                        <div className="animate-bounce text-amber-400">?</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Winning Lines Display */}
        {spinResult && spinResult.wins.length > 0 && (
          <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <div className="text-xs uppercase tracking-wider text-emerald-400/80">Winning Lines</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {spinResult.wins.map((win, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPayline(win.paylineIndex)}
                  className="cursor-pointer rounded-lg border border-emerald-500/40 bg-emerald-900/20 px-3 py-1 text-sm text-emerald-300 transition hover:bg-emerald-900/40"
                >
                  Line {win.paylineIndex + 1}: {win.symbol} x{win.count} = {(win.payout * bet).toLocaleString()} AUD
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bonus Trigger */}
        {spinResult?.bonusTriggered && (
          <div className="mb-4 animate-pulse rounded-2xl border-2 border-purple-500 bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 text-center shadow-lg shadow-purple-500/50">
            <div className="text-2xl font-bold text-purple-300">🎰 BONUS TRIGGERED! 🎰</div>
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
            
            <div>
              <label className="text-xs uppercase tracking-wider text-amber-500/60">Paylines</label>
              <div className="mt-1">
                <button
                  onClick={() => setShowPaylines(!showPaylines)}
                  className="rounded-lg border border-amber-500/30 bg-amber-900/20 px-4 py-2 text-sm text-amber-400 transition hover:bg-amber-900/40"
                >
                  {showPaylines ? 'Hide' : 'Show'} Lines ({cfg.paylines})
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <LuxeButton
              label={spinning ? "SPINNING..." : "SPIN"}
              variant="gold"
              onClick={handleSpin}
              disabled={spinning || balance < bet}
            />
            <div className="text-center text-xs text-amber-500/50">
              RTP: {cfg.rtp}% | Volatility: {cfg.volatility.toUpperCase()}
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
    </div>
  );
}
