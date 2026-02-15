// ----------------------------------------
// OBSIDIAN CROWN — SLOT MACHINE 06
// 5 REELS | HIGH VOLATILITY | DARK ROYALTY
// ----------------------------------------

(function () {
  "use strict";

  const MACHINE_ID = "OBSIDIAN_CROWN";
  const BET_AMOUNT = 200;
  const REELS = 5;

  const symbols = [
    { id: "crown", weight: 2, payout: 30, wild: true },
    { id: "sigil", weight: 3, payout: 25, scatter: true },
    { id: "chalice", weight: 4, payout: 18 },
    { id: "gem", weight: 6, payout: 12 },
    { id: "torch", weight: 8, payout: 6 },
    { id: "coin", weight: 10, payout: 4 }
  ];

  let spinning = false;

  function weightedPick() {
    const pool = [];
    symbols.forEach(s => {
      for (let i = 0; i < s.weight; i++) pool.push(s);
    });
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function spinReels() {
    return Array.from({ length: REELS }, weightedPick);
  }

  function calculateWin(result) {
    const counts = {};
    let scatters = 0;

    result.forEach(sym => {
      if (sym.scatter) scatters++;
      counts[sym.id] = (counts[sym.id] || 0) + 1;
    });

    let payout = 0;

    for (let id in counts) {
      if (counts[id] >= 3) {
        const s = symbols.find(x => x.id === id);
        payout += s.payout * counts[id];
      }
    }

    // Scatter-based royal bonus
    if (scatters >= 3) {
      payout += scatters * 300;
    }

    return payout;
  }

  function render(result, win) {
    const display = document.getElementById("slotDisplay");
    const resultText = document.getElementById("resultText");

    display.innerHTML = result.map(s =>
      `<div class="reel-symbol obsidian">${s.id.toUpperCase()}</div>`
    ).join("");

    resultText.textContent = win > 0
      ? `THE CROWN REWARDS ${win} GOLD`
      : `THE CROWN REMAINS SILENT`;
  }

  window.spinObsidianCrown = function () {
    if (spinning || VaultEngine.getBalance() < BET_AMOUNT) return;

    spinning = true;
    VaultEngine.adjustBalance(-BET_AMOUNT);

    const result = spinReels();
    const win = calculateWin(result);

    setTimeout(() => {
      if (win > 0) VaultEngine.adjustBalance(win);
      render(result, win);
      spinning = false;
    }, 1100);
  };

})();
