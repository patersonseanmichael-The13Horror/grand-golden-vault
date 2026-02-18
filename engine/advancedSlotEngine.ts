// Advanced Slot Machine Engine with Real Casino Mechanics
// Features: Weighted RNG, Multiple Paylines, RTP Control, Bonus Features

export type Reels = string[][];

export interface SlotConfig {
  symbols: string[];
  symbolWeights: Record<string, number>; // Higher weight = more likely to appear
  payTable: Record<string, Record<number, number>>;
  paylines: number[][];
  rtp: number; // Return to Player percentage (e.g., 96.5)
  volatility: 'low' | 'medium' | 'high';
  bonusSymbol?: string;
  wildSymbol?: string;
  scatterSymbol?: string;
}

export interface SpinResult {
  reels: Reels;
  wins: WinLine[];
  totalWin: number;
  bonusTriggered: boolean;
  freeSpinsAwarded: number;
}

export interface WinLine {
  paylineIndex: number;
  symbol: string;
  count: number;
  payout: number;
  positions: number[];
}

// Weighted Random Symbol Selection
function getWeightedSymbol(symbols: string[], weights: Record<string, number>): string {
  const totalWeight = symbols.reduce((sum, sym) => sum + (weights[sym] || 1), 0);
  let random = Math.random() * totalWeight;
  
  for (const symbol of symbols) {
    const weight = weights[symbol] || 1;
    if (random < weight) {
      return symbol;
    }
    random -= weight;
  }
  
  return symbols[symbols.length - 1];
}

// Generate reels with weighted probabilities
export function spinReels(config: SlotConfig): Reels {
  const reels: string[][] = [];
  
  for (let col = 0; col < 5; col++) {
    const column: string[] = [];
    for (let row = 0; row < 3; row++) {
      const symbol = getWeightedSymbol(config.symbols, config.symbolWeights);
      column.push(symbol);
    }
    reels.push(column);
  }
  
  return reels;
}

// Check a single payline for wins
function checkPayline(
  reels: Reels,
  payline: number[],
  payTable: Record<string, Record<number, number>>,
  wildSymbol?: string
): { symbol: string; count: number; payout: number } | null {
  const symbols = payline.map((row, col) => reels[col][row]);
  let firstSymbol = symbols[0];
  
  // Skip if first symbol is not in paytable (unless it's wild)
  if (!payTable[firstSymbol] && firstSymbol !== wildSymbol) {
    return null;
  }
  
  let matchCount = 1;
  
  for (let i = 1; i < symbols.length; i++) {
    const currentSymbol = symbols[i];
    
    // Wild substitution
    if (currentSymbol === wildSymbol || currentSymbol === firstSymbol) {
      matchCount++;
    } else if (firstSymbol === wildSymbol && payTable[currentSymbol]) {
      // If first was wild, adopt the new symbol
      firstSymbol = currentSymbol;
      matchCount++;
    } else {
      break;
    }
  }
  
  // Check if we have a winning combination
  if (payTable[firstSymbol]?.[matchCount]) {
    return {
      symbol: firstSymbol,
      count: matchCount,
      payout: payTable[firstSymbol][matchCount]
    };
  }
  
  return null;
}

// Calculate all wins from all paylines
export function calculateWins(reels: Reels, config: SlotConfig): WinLine[] {
  const wins: WinLine[] = [];
  
  config.paylines.forEach((payline, index) => {
    const result = checkPayline(reels, payline, config.payTable, config.wildSymbol);
    
    if (result) {
      wins.push({
        paylineIndex: index,
        symbol: result.symbol,
        count: result.count,
        payout: result.payout,
        positions: payline.slice(0, result.count)
      });
    }
  });
  
  return wins;
}

// Check for scatter wins (appear anywhere on reels)
export function checkScatters(reels: Reels, scatterSymbol: string): number {
  let count = 0;
  
  for (let col = 0; col < reels.length; col++) {
    for (let row = 0; row < reels[col].length; row++) {
      if (reels[col][row] === scatterSymbol) {
        count++;
      }
    }
  }
  
  return count;
}

// Main spin function with full casino mechanics
export function performSpin(config: SlotConfig, bet: number): SpinResult {
  const reels = spinReels(config);
  const wins = calculateWins(reels, config);
  
  let totalWin = 0;
  wins.forEach(win => {
    totalWin += win.payout * bet;
  });
  
  // Check for bonus/scatter triggers
  let bonusTriggered = false;
  let freeSpinsAwarded = 0;
  
  if (config.scatterSymbol) {
    const scatterCount = checkScatters(reels, config.scatterSymbol);
    if (scatterCount >= 3) {
      bonusTriggered = true;
      freeSpinsAwarded = scatterCount === 3 ? 10 : scatterCount === 4 ? 15 : 20;
    }
  }
  
  return {
    reels,
    wins,
    totalWin,
    bonusTriggered,
    freeSpinsAwarded
  };
}

// Standard Vegas payline patterns (20 paylines)
export const VEGAS_PAYLINES: number[][] = [
  // Straight lines
  [1, 1, 1, 1, 1], // Middle row
  [0, 0, 0, 0, 0], // Top row
  [2, 2, 2, 2, 2], // Bottom row
  
  // V shapes
  [0, 1, 2, 1, 0], // V
  [2, 1, 0, 1, 2], // Inverted V
  
  // Zigzags
  [0, 0, 1, 2, 2], // Ascending zigzag
  [2, 2, 1, 0, 0], // Descending zigzag
  [1, 0, 0, 0, 1], // Top zigzag
  [1, 2, 2, 2, 1], // Bottom zigzag
  
  // W and M shapes
  [0, 1, 0, 1, 0], // W
  [2, 1, 2, 1, 2], // M
  [1, 0, 1, 0, 1], // W variant
  [1, 2, 1, 2, 1], // M variant
  
  // Complex patterns
  [0, 1, 1, 1, 0],
  [2, 1, 1, 1, 2],
  [1, 1, 0, 1, 1],
  [1, 1, 2, 1, 1],
  [0, 0, 0, 1, 2],
  [2, 2, 2, 1, 0],
  [0, 2, 0, 2, 0]
];

// Calculate actual RTP based on paytable and symbol weights
export function calculateTheoreticalRTP(config: SlotConfig): number {
  // This is a simplified RTP calculation
  // In production, run Monte Carlo simulation with millions of spins
  let totalPayout = 0;
  const iterations = 100000;
  
  for (let i = 0; i < iterations; i++) {
    const result = performSpin(config, 1);
    totalPayout += result.totalWin;
  }
  
  return (totalPayout / iterations) * 100;
}
