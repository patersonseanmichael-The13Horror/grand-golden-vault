let progressiveJackpot = 100000;

export function deposit(amount: number, isVIP: boolean) {
  // VIP ONLY on deposits (jackpot grows only from VIP deposits)
  if (isVIP) progressiveJackpot += amount * 0.02;
}

export function getJackpot() {
  return progressiveJackpot;
}

export function resetJackpot(seed = 100000) {
  progressiveJackpot = seed;
}
