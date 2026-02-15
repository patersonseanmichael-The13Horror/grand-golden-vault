// ----------------------------------------
// IMPERIAL LOTUS — SLOT MACHINE 04
// 5 REELS | PREMIUM INSTITUTIONAL ENGINE
// ----------------------------------------

(function () {
  "use strict";

  const MACHINE_ID = "IMPERIAL_LOTUS";
  const BET_AMOUNT = 100;

  const symbols = [
    { id: "lotus", weight: 2, payout: 20 },
    { id: "dragon", weight: 3, payout: 15 },
    { id: "envelope", weight: 5, payout: 10 },
    { id: "coin", weight: 6, payout: 8 },
    { id: "lantern", weight: 8, payout: 5 },
    { id: "jade", weight: 10, payout: 3 }
  ];

  const reels = 5;
  let spinning = false;

  function weightedSymbol() {
    const pool = [];
    symbols.forEach(s => {
      for (let i = 0; i < s.weight; i++) pool.push(s);
    });
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function spinReels() {
    return Array.from({ length: reels }, weightedSymbol);
  }

  function calculateWin(result) {
    const counts = {};
    result.forEach(r => counts[r.id] = (counts[r.id] || 0) + 1);

    let payout = 0;
    for (let id in counts) {
      if (counts[id] >= 3) {
        const sym = symbols.find(s => s.id === id);
        payout += sym.payout * counts[id];
      }
    }
    return payout;
  }

  function render(result, win) {
    const display = document.getElementById("slotDisplay");
    const resultText = document.getElementById("resultText");

    display.innerHTML = result.map(r =>
      `<div class="reel-symbol">${r.id.toUpperCase()}</div>`
    ).join("");

    resultText.textContent = win > 0
      ? `IMPERIAL LOTUS PAYS ${win} GOLD`
      : `NO WIN — THE LOTUS AWAITS`;
  }

  window.spinImperialLotus = function () {
    if (spinning || VaultEngine.getBalance() < BET_AMOUNT) return;

    spinning = true;
    VaultEngine.adjustBalance(-BET_AMOUNT);

    const result = spinReels();
    const win = calculateWin(result);

    setTimeout(() => {
      if (win > 0) VaultEngine.adjustBalance(win);
      render(result, win);
      spinning = false;
    }, 900);
  };

})();
