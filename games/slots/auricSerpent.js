/* ======================================================
   SLOT MACHINE 01 — AURIC SERPENT
   5 REELS / 3 ROWS / CENTER PAYLINE
====================================================== */

const AuricSerpent = (() => {

  const SYMBOLS = ["🐉","🪙","🔔","🍀","💎","A","K","Q"];
  const PAYOUTS = {
    "🐉": 20,
    "💎": 10,
    "🪙": 6,
    "🔔": 4,
    "🍀": 3
  };

  function spinReel(){
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  }

  function evaluate(reels, bet){
    const centerLine = reels;
    const symbol = centerLine[0];

    if (centerLine.every(s => s === symbol) && PAYOUTS[symbol]){
      const win = bet * PAYOUTS[symbol];
      VaultEngine.deposit(win, "SLOTS_WIN_AURIC_SERPENT");
      return `Five ${symbol} — You win ${win} GOLD`;
    }

    return "No win this spin.";
  }

  return Object.freeze({

    spin(bet){
      if (bet <= 0) throw new Error("Invalid bet amount");

      VaultEngine.withdraw(bet, "SLOTS_BET_AURIC_SERPENT");

      const reels = Array.from({length:5}, spinReel);
      const message = evaluate(reels, bet);

      return { reels, message };
    }

  });

})();
