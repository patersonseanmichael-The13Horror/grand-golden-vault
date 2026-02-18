"use client";

import { useState, useEffect } from "react";

// European Roulette numbers with colors
const ROULETTE_NUMBERS = [
  { num: 0, color: "green" },
  { num: 32, color: "red" }, { num: 15, color: "black" }, { num: 19, color: "red" }, { num: 4, color: "black" },
  { num: 21, color: "red" }, { num: 2, color: "black" }, { num: 25, color: "red" }, { num: 17, color: "black" },
  { num: 34, color: "red" }, { num: 6, color: "black" }, { num: 27, color: "red" }, { num: 13, color: "black" },
  { num: 36, color: "red" }, { num: 11, color: "black" }, { num: 30, color: "red" }, { num: 8, color: "black" },
  { num: 23, color: "red" }, { num: 10, color: "black" }, { num: 5, color: "red" }, { num: 24, color: "black" },
  { num: 16, color: "red" }, { num: 33, color: "black" }, { num: 1, color: "red" }, { num: 20, color: "black" },
  { num: 14, color: "red" }, { num: 31, color: "black" }, { num: 9, color: "red" }, { num: 22, color: "black" },
  { num: 18, color: "red" }, { num: 29, color: "black" }, { num: 7, color: "red" }, { num: 28, color: "black" },
  { num: 12, color: "red" }, { num: 35, color: "black" }, { num: 3, color: "red" }, { num: 26, color: "black" }
];

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

type Bet = {
  type: string;
  value: number | string;
  amount: number;
  payout: number;
};

export default function PremiumRoulette() {
  const [balance, setBalance] = useState(10000);
  const [bets, setBets] = useState<Bet[]>([]);
  const [chipValue, setChipValue] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [lastWin, setLastWin] = useState(0);

  const addBet = (type: string, value: number | string, payout: number) => {
    if (spinning || balance < chipValue) return;
    
    const existingBet = bets.find(b => b.type === type && b.value === value);
    if (existingBet) {
      setBets(bets.map(b => 
        b.type === type && b.value === value 
          ? { ...b, amount: b.amount + chipValue }
          : b
      ));
    } else {
      setBets([...bets, { type, value, amount: chipValue, payout }]);
    }
    setBalance(prev => prev - chipValue);
  };

  const clearBets = () => {
    if (spinning) return;
    const totalBets = bets.reduce((sum, bet) => sum + bet.amount, 0);
    setBalance(prev => prev + totalBets);
    setBets([]);
  };

  const spin = () => {
    if (spinning || bets.length === 0) return;
    
    setSpinning(true);
    setLastWin(0);
    
    // Simulate spin animation
    setTimeout(() => {
      const result = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)].num;
      setWinningNumber(result);
      setHistory(prev => [result, ...prev.slice(0, 9)]);
      
      // Calculate winnings
      let totalWin = 0;
      bets.forEach(bet => {
        if (checkWin(bet, result)) {
          totalWin += bet.amount * bet.payout;
        }
      });
      
      if (totalWin > 0) {
        setBalance(prev => prev + totalWin);
        setLastWin(totalWin);
      }
      
      setBets([]);
      setSpinning(false);
    }, 3000);
  };

  const checkWin = (bet: Bet, result: number): boolean => {
    switch (bet.type) {
      case "straight":
        return bet.value === result;
      case "red":
        return RED_NUMBERS.includes(result);
      case "black":
        return BLACK_NUMBERS.includes(result);
      case "even":
        return result !== 0 && result % 2 === 0;
      case "odd":
        return result !== 0 && result % 2 === 1;
      case "1-18":
        return result >= 1 && result <= 18;
      case "19-36":
        return result >= 19 && result <= 36;
      case "dozen1":
        return result >= 1 && result <= 12;
      case "dozen2":
        return result >= 13 && result <= 24;
      case "dozen3":
        return result >= 25 && result <= 36;
      case "column1":
        return result % 3 === 1 && result !== 0;
      case "column2":
        return result % 3 === 2 && result !== 0;
      case "column3":
        return result % 3 === 0 && result !== 0;
      default:
        return false;
    }
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return "bg-green-600";
    return RED_NUMBERS.includes(num) ? "bg-red-600" : "bg-gray-900";
  };

  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Stats Bar */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-amber-500/20 bg-black/40 p-4">
          <div className="text-xs uppercase tracking-wider text-amber-500/60">Balance</div>
          <div className="mt-1 text-2xl font-bold text-amber-400">${balance.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-4">
          <div className="text-xs uppercase tracking-wider text-emerald-500/60">Total Bet</div>
          <div className="mt-1 text-2xl font-bold text-emerald-400">${totalBetAmount.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border border-purple-500/20 bg-black/40 p-4">
          <div className="text-xs uppercase tracking-wider text-purple-500/60">Last Win</div>
          <div className={`mt-1 text-2xl font-bold ${lastWin > 0 ? 'text-yellow-400 animate-pulse' : 'text-purple-400'}`}>
            ${lastWin.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Wheel */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-black/80 to-gray-900/80 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-amber-400 mb-4 text-center">European Roulette</h3>
            
            {/* Wheel Visualization */}
            <div className="relative aspect-square mb-4">
              <div className={`w-full h-full rounded-full border-8 border-amber-500/40 bg-gradient-to-br from-amber-900/30 to-gray-900 flex items-center justify-center ${spinning ? 'animate-spin' : ''}`}>
                <div className="w-3/4 h-3/4 rounded-full border-4 border-amber-600/60 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                  {winningNumber !== null && !spinning && (
                    <div className="text-center">
                      <div className={`w-20 h-20 rounded-full ${getNumberColor(winningNumber)} border-4 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/50`}>
                        <span className="text-3xl font-bold text-white">{winningNumber}</span>
                      </div>
                    </div>
                  )}
                  {spinning && (
                    <div className="text-2xl font-bold text-amber-400 animate-pulse">SPINNING...</div>
                  )}
                </div>
              </div>
            </div>

            {/* History */}
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wider text-amber-500/60 mb-2">Last 10 Spins</div>
              <div className="flex gap-2 flex-wrap">
                {history.map((num, idx) => (
                  <div key={idx} className={`w-10 h-10 rounded-lg ${getNumberColor(num)} border border-amber-500/30 flex items-center justify-center text-white font-bold text-sm`}>
                    {num}
                  </div>
                ))}
              </div>
            </div>

            {/* Chip Selector */}
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wider text-amber-500/60 mb-2">Chip Value</div>
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map(value => (
                  <button
                    key={value}
                    onClick={() => setChipValue(value)}
                    className={`rounded-full aspect-square flex items-center justify-center font-bold transition ${
                      chipValue === value
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/50'
                        : 'bg-gradient-to-br from-gray-700 to-gray-800 text-amber-400 hover:from-gray-600 hover:to-gray-700'
                    }`}
                  >
                    ${value}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-2">
              <button
                onClick={spin}
                disabled={spinning || bets.length === 0}
                className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-white font-bold transition hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {spinning ? "SPINNING..." : "SPIN"}
              </button>
              <button
                onClick={clearBets}
                disabled={spinning || bets.length === 0}
                className="w-full rounded-full border-2 border-red-500/30 bg-red-950/30 px-6 py-3 text-red-300 font-semibold transition hover:bg-red-950/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Bets
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Betting Board */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-black/80 to-gray-900/80 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-amber-400 mb-4">Betting Board</h3>
            
            {/* Numbers Grid */}
            <div className="mb-4">
              <div className="grid grid-cols-13 gap-1">
                {/* Zero */}
                <button
                  onClick={() => addBet("straight", 0, 35)}
                  className="col-span-1 row-span-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xl rounded-lg transition flex items-center justify-center py-8"
                >
                  0
                </button>
                
                {/* Numbers 1-36 */}
                {[...Array(36)].map((_, i) => {
                  const num = i + 1;
                  const isRed = RED_NUMBERS.includes(num);
                  return (
                    <button
                      key={num}
                      onClick={() => addBet("straight", num, 35)}
                      className={`${isRed ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-900 hover:bg-gray-800'} text-white font-bold rounded transition py-3`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Outside Bets */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button onClick={() => addBet("dozen1", "1-12", 2)} className="bg-amber-900/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 font-semibold py-3 rounded-lg transition">
                1st 12
              </button>
              <button onClick={() => addBet("dozen2", "13-24", 2)} className="bg-amber-900/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 font-semibold py-3 rounded-lg transition">
                2nd 12
              </button>
              <button onClick={() => addBet("dozen3", "25-36", 2)} className="bg-amber-900/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 font-semibold py-3 rounded-lg transition">
                3rd 12
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              <button onClick={() => addBet("1-18", "1-18", 1)} className="bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 font-semibold py-3 rounded-lg transition">
                1-18
              </button>
              <button onClick={() => addBet("even", "EVEN", 1)} className="bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 font-semibold py-3 rounded-lg transition">
                EVEN
              </button>
              <button onClick={() => addBet("red", "RED", 1)} className="bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition">
                RED
              </button>
              <button onClick={() => addBet("black", "BLACK", 1)} className="bg-gray-900 hover:bg-gray-800 border border-white/20 text-white font-semibold py-3 rounded-lg transition">
                BLACK
              </button>
              <button onClick={() => addBet("odd", "ODD", 1)} className="bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 font-semibold py-3 rounded-lg transition">
                ODD
              </button>
              <button onClick={() => addBet("19-36", "19-36", 1)} className="bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 font-semibold py-3 rounded-lg transition">
                19-36
              </button>
            </div>

            {/* Active Bets Display */}
            {bets.length > 0 && (
              <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-4">
                <div className="text-sm font-semibold text-cyan-300 mb-2">Active Bets</div>
                <div className="flex flex-wrap gap-2">
                  {bets.map((bet, idx) => (
                    <div key={idx} className="rounded-lg bg-cyan-900/30 border border-cyan-500/30 px-3 py-1 text-xs text-cyan-300">
                      {bet.value}: ${bet.amount} ({bet.payout}:1)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
