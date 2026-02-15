(function(){
  "use strict";

  const machine = {
    id: "OBSIDIAN_CROWN",
    bet: 200,
    reels: 5,
    rows: 3,
    delay: 1100,
    symbols: [
      { id: "CROWN", weight: 2, payout: 30, wild: true },
      { id: "SIGIL", weight: 3, payout: 25, scatter: true },
      { id: "CHALICE", weight: 4, payout: 18 },
      { id: "GEM", weight: 6, payout: 12 },
      { id: "TORCH", weight: 8, payout: 6 },
      { id: "COIN", weight: 10, payout: 4 },
    ],

    render(grid, win, meta){
      const resultText = document.getElementById("resultText");
      if (window.SlotRenderer) {
        SlotRenderer.renderGrid({ grid, meta });
        resultText.textContent = SlotRenderer.formatOutcome({ win, meta });
      } else {
        const display = document.getElementById("slotDisplay");
        display.innerHTML = grid.map(s => `<div class="reel-symbol">${s.id}</div>`).join("");
        resultText.textContent = win > 0 ? `PAYS ${win} GOLD` : `NO WIN`;
      }
    }
  };

  window.SLOT_MACHINE = machine;
  window.spinSlot = () => SlotCore.spin(machine);
})();
