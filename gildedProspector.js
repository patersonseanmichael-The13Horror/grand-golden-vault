(function(){
  "use strict";

  const machine = {
    id: "GILDED_PROSPECTOR",
    bet: 125,
    reels: 5,
    rows: 3,
    delay: 950,
    symbols: [
      { id: "PROSPECTOR", weight: 3, payout: 20, wild: true },
      { id: "CLAIM", weight: 4, payout: 18, scatter: true },
      { id: "PICKAXE", weight: 5, payout: 14 },
      { id: "CART", weight: 6, payout: 10 },
      { id: "NUGGET", weight: 8, payout: 6 },
      { id: "BOOT", weight: 10, payout: 4 },
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
