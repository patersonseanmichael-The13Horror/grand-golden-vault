(function () {
  "use strict";

  const machine = {
    id: "SOVEREIGN_GOLD_RUSH",
    bet: 150,
    reels: 5,

    symbols: [
      { id: "bar", weight: 2, payout: 25, wild: true },
      { id: "nugget", weight: 3, payout: 20, scatter: true },
      { id: "eagle", weight: 4, payout: 15 },
      { id: "coin", weight: 6, payout: 10 },
      { id: "horseshoe", weight: 8, payout: 5 },
      { id: "pickaxe", weight: 10, payout: 3 }
    ],

    render(result, win) {
      slotDisplay.innerHTML = result.map(s =>
        `<div class="reel-symbol">${s.id}</div>`
      ).join("");

      resultText.textContent =
        win ? `SOVEREIGN WIN ${win} GOLD` : "NO STRIKE THIS TIME";
    }
  };

  window.spinSovereignGoldRush = () => SlotCore.spin(machine);
})();
