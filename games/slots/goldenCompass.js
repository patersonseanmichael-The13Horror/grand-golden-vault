/* ======================================================
   SLOT MACHINE 03 — GOLDEN COMPASS
   5 REELS / 3 ROWS / CENTER PAYLINE
====================================================== */

const GoldenCompass = (() => {

  const SYMBOLS = ["🧭","🗺️","🪙","⚓","💎","A","K","Q"];
  const PAYOUTS = {
    "🧭": 18,   // Compass (top symbol)
    "💎": 14,
    "🗺️": 9,
    "⚓": 5
  };

  function spinReel(){
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  }

  function evaluate(line, bet){
    const symbol = line[0];

    if (line.every(s => s === symbol) && PAYOUTS[symbol]){
      const win = bet * PAYOUTS[symbol];
      VaultEngine.deposit(win, "SLOTS_WIN_GOLDEN_COMPASS");
      return `True bearing! Five ${symbol} — ${win} GOLD`;
    }

    return "The compass spins… no discovery this time.";
  }

  return Object.freeze({

    spin(bet){
      if (bet <= 0) throw new Error("Invalid bet");

      VaultEngine.withdraw(bet, "SLOTS_BET_GOLDEN_COMPASS");

      const reels = Array.from({length:5}, spinReel);
      const message = evaluate(reels, bet);

      return { reels, message };
    }

  });

})();
