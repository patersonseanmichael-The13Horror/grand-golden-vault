// ----------------------------------------
// SOVEREIGN GOLD RUSH — SLOT MACHINE 05
// 5 REELS | HIGH VOLATILITY | INSTITUTIONAL
// ----------------------------------------

(function () {
  "use strict";

  const MACHINE_ID = "SOVEREIGN_GOLD_RUSH";
  const BET_AMOUNT = 150;
  const REELS = 5;

  const symbols = [
    { id: "bar", weight: 2, payout: 25, wild: true },
    { id: "nugget", weight: 3, payout: 20, scatter: true },
    { id: "eagle", weight: 4, payout: 15 },
    { id: "coin", weight: 6, payout: 10 },
    { id: "horseshoe", weight: 8, payout: 5 },
    { id: "pickaxe", weight: 10, payout: 3 }
  ];

  let spinning = false;

  function getWeightedSymbol() {
    const pool = [];
    symbols.forEach(sym => {
      for (let i = 0; i < sym.weight; i++) pool.push(sym);
    });
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function spin() {
    return Array.from({ length: REELS }, getWeightedSymbol);
  }

  function calculateWin(result) {
    const counts = {};
    let scatters = 0;

    result.forEach(s => {
      if (s.scatter) scatters++;
      counts[s.id] = (counts[s.id] || 0) + 1;
    });

    let payout = 0;

    for (let id in counts) {
      if (counts[id] >= 3) {
        const sym = symbols.find(s => s.id === id);
        payout += sym.payout * counts[id];
      }
    }

    // Scatter bonus (no paylines needed)
    if (scatters >= 3) {
      payout += scatters * 200;
    }

    return payout;
  }

  function render(result, win) {
    const display = document.getElementById("slotDisplay");
    const resultText = document.getElementById("resultText");

    display.innerHTML = result.map(s =>
      `<div class="reel-symbol">${s.id.toUpperCase()}</div>`
    ).join("");

    resultText.textContent = win > 0
      ? `SOVEREIGN PAYOUT: ${win} GOLD`
      : `NO STRIKE — GOLD REMAINS BURIED`;
  }

  window.spinSovereignGoldRush = function () {
    if (spinning || VaultEngine.getBalance() < BET_AMOUNT) return;

    spinning = true;
    VaultEngine.adjustBalance(-BET_AMOUNT);

    const result = spin();
    const win = calculateWin(result);

    setTimeout(() => {
      if (win > 0) VaultEngine.adjustBalance(win);
      render(result, win);
      spinning = false;
    }, 1000);
  };

})();
