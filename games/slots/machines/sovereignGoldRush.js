(function(){
  "use strict";

  const machine = {
    id: "SOVEREIGN_GOLD_RUSH",
    bet: 150,
    reels: 5,
    rows: 3,
    delay: 1000,
    symbols: [
      { id: "BAR", weight: 2, payout: 25, wild: true },
      { id: "NUGGET", weight: 3, payout: 20, scatter: true },
      { id: "EAGLE", weight: 4, payout: 15 },
      { id: "COIN", weight: 6, payout: 10 },
      { id: "HORSESHOE", weight: 8, payout: 5 },
      { id: "PICKAXE", weight: 10, payout: 3 },
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
