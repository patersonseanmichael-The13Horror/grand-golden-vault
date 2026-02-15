// OBSIDIAN CROWN — SLOT MACHINE 06 (CORE-READY)

(function () {
  "use strict";

  const machine = {
    id: "OBSIDIAN_CROWN",
    bet: 200,
    reels: 5,
    delay: 1100,

    symbols: [
      { id: "crown", weight: 2, payout: 30, wild: true },
      { id: "sigil", weight: 3, payout: 25, scatter: true },
      { id: "chalice", weight: 4, payout: 18 },
      { id: "gem", weight: 6, payout: 12 },
      { id: "torch", weight: 8, payout: 6 },
      { id: "coin", weight: 10, payout: 4 }
    ],

    render(result, win) {
      const display = document.getElementById("slotDisplay");
      const resultText = document.getElementById("resultText");

      display.innerHTML = result.map(s =>
        `<div class="reel-symbol obsidian">${s.id.toUpperCase()}</div>`
      ).join("");

      resultText.textContent = win > 0
        ? `THE CROWN REWARDS ${win} GOLD`
        : `THE CROWN REMAINS SILENT`;
    }
  };

  window.spinObsidianCrown = () => SlotCore.spin(machine);

})();
