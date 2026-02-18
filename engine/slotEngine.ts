export type Reels = string[][];

export function spinReels(symbols: string[]): Reels {
  const reels: string[][] = [];
  for (let col = 0; col < 5; col++) {
    const column: string[] = [];
    for (let row = 0; row < 3; row++) {
      const randIndex = Math.floor(Math.random() * symbols.length);
      column.push(symbols[randIndex]);
    }
    reels.push(column);
  }
  return reels;
}

export function calculateWin(reels: Reels, payTable: Record<string, Record<number, number>>) {
  let totalWin = 0;
  for (let row = 0; row < 3; row++) {
    const firstSymbol = reels[0][row];
    let matchCount = 1;
    for (let col = 1; col < 5; col++) {
      if (reels[col][row] === firstSymbol) matchCount++;
      else break;
    }
    if (payTable[firstSymbol]?.[matchCount]) totalWin += payTable[firstSymbol][matchCount];
  }
  return totalWin;
}
