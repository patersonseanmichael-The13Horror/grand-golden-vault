/* ======================================================
   SLOT MACHINE 02 — GILDED PROSPECTOR
   5 REELS / 3 ROWS / CENTER PAYLINE
====================================================== */

const GildedProspector = (() => {

  const SYMBOLS = ["⛏️","🧱","🪙","💰","⭐","A","K","Q"];
  const PAYOUTS = {
    "⛏️": 25,   // pickaxe (top symbol)
    "💰": 15,
    "🪙": 8,
    "⭐": 5
  };

  function spinReel(){
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  }

  function evaluate(line, bet){
    const symbol = line[0];

    if (line.every(s => s === symbol) && PAYOUTS[symbol]){
      const win = bet * PAYOUTS[symbol];
      VaultEngine.deposit(win, "SLOTS_WIN_GILDED_PROSPECTOR");
      return `Strike gold! Five ${symbol} — ${win} GOLD`;
    }

    return "No find this spin.";
  }

  return Object.freeze({

    spin(bet){
      if (bet <= 0) throw new Error("Invalid bet");

      VaultEngine.withdraw(bet, "SLOTS_BET_GILDED_PROSPECTOR");

      const reels = Array.from({length:5}, spinReel);
      const message = evaluate(reels, bet);

      return { reels, message };
    }

  });

})();
