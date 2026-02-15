// AURIC SERPENT — SLOTCORE READY

(function () {
  "use strict";

  const machine = {
    id: "AURIC_SERPENT",
    bet: 175,
    reels: 5,
    delay: 1000,

    symbols: [
      { id: "serpent", weight: 2, payout: 28, wild: true },
      { id: "idol", weight: 3, payout: 22, scatter: true },
      { id: "mask", weight: 4, payout: 16 },
      { id: "gem", weight: 6, payout: 11 },
      { id: "torch", weight: 8, payout: 6 },
      { id: "coin", weight: 10, payout: 4 }
    ],

    render(result, win) {
      const display = document.getElementById("slotDisplay");
      const resultText = document.getElementById("resultText");

      display.innerHTML = result
        .map(s => `<div class="reel-symbol serpent">${s.id.toUpperCase()}</div>`)
        .join("");

      resultText.textContent = win
        ? `THE SERPENT STRIKES: ${win} GOLD`
        : `THE SERPENT WATCHES`;
    }
  };

  window.spinAuricSerpent = () => SlotCore.spin(machine);

})();
