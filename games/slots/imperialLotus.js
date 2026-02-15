(function () {
  "use strict";

  const machine = {
    id: "IMPERIAL_LOTUS",
    bet: 100,
    reels: 5,

    symbols: [
      { id: "lotus", weight: 2, payout: 20, scatter: true },
      { id: "dragon", weight: 3, payout: 15, wild: true },
      { id: "envelope", weight: 5, payout: 10 },
      { id: "coin", weight: 6, payout: 8 },
      { id: "lantern", weight: 8, payout: 5 },
      { id: "jade", weight: 10, payout: 3 }
    ],

    render(result, win) {
      slotDisplay.innerHTML = result.map(s =>
        `<div class="reel-symbol">${s.id}</div>`
      ).join("");

      resultText.textContent =
        win ? `LOTUS PAYS ${win} GOLD` : "THE LOTUS WAITS";
    }
  };

  window.spinImperialLotus = () => SlotCore.spin(machine);
})();
