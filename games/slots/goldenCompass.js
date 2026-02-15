(function () {
  "use strict";

  const machine = {
    id: "GOLDEN_COMPASS",
    bet: 100,
    reels: 5,
    delay: 900,

    symbols: [
      { id: "compass", weight: 3, payout: 15 },
      { id: "map", weight: 4, payout: 12 },
      { id: "anchor", weight: 6, payout: 8 },
      { id: "coin", weight: 8, payout: 5 },
      { id: "rope", weight: 10, payout: 3 }
    ],

    render(result, win) {
      document.getElementById("slotDisplay").innerHTML =
        result.map(s => `<div class="reel-symbol">${s.id}</div>`).join("");

      document.getElementById("resultText").textContent =
        win ? `COMPASS WIN: ${win} GOLD` : "CHART A NEW COURSE";
    }
  };

  window.spinGoldenCompass = () => SlotCore.spin(machine);
})();
