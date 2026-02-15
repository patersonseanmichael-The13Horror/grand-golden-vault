(function(){
  "use strict";

  const machine = {
    id: "GOLDEN_COMPASS",
    bet: 100,
    reels: 5,
    rows: 3,
    delay: 900,
    symbols: [
      { id: "COMPASS", weight: 3, payout: 15 },
      { id: "MAP", weight: 4, payout: 12 },
      { id: "ANCHOR", weight: 6, payout: 8 },
      { id: "COIN", weight: 8, payout: 5 },
      { id: "ROPE", weight: 10, payout: 3 },
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
