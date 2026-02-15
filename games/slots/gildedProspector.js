// GILDED PROSPECTOR — SLOTCORE READY

(function () {
  "use strict";

  const machine = {
    id: "GILDED_PROSPECTOR",
    bet: 125,
    reels: 5,
    delay: 950,

    symbols: [
      { id: "prospector", weight: 3, payout: 20, wild: true },
      { id: "claim", weight: 4, payout: 18, scatter: true },
      { id: "pickaxe", weight: 5, payout: 14 },
      { id: "cart", weight: 6, payout: 10 },
      { id: "nugget", weight: 8, payout: 6 },
      { id: "boot", weight: 10, payout: 4 }
    ],

    render(result, win) {
      const display = document.getElementById("slotDisplay");
      const resultText = document.getElementById("resultText");

      display.innerHTML = result
        .map(s => `<div class="reel-symbol prospector">${s.id.toUpperCase()}</div>`)
        .join("");

      resultText.textContent = win
        ? `CLAIM PAID: ${win} GOLD`
        : `NO GOLD THIS DIG`;
    }
  };

  window.spinGildedProspector = () => SlotCore.spin(machine);

})();
