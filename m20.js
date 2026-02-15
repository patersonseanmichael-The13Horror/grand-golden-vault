(function(){
    "use strict";

    const machine = {
      id: "M20_IVORY_RELIC",
      bet: 150,
      reels: 5,
      rows: 3,
      delay: 1100,
      symbols: [
        {
                "id": "LOTUS",
                "weight": 2,
                "payout": 20,
                "scatter": true
        },
        {
                "id": "DRAGON",
                "weight": 3,
                "payout": 15,
                "wild": true
        },
        {
                "id": "ENVELOPE",
                "weight": 5,
                "payout": 10
        },
        {
                "id": "COIN",
                "weight": 6,
                "payout": 8
        },
        {
                "id": "LANTERN",
                "weight": 8,
                "payout": 5
        },
        {
                "id": "JADE",
                "weight": 10,
                "payout": 3
        }
],
      render(grid, win, meta){
        const resultText = document.getElementById("resultText");
        SlotRenderer.renderGrid({ grid, meta });
        resultText.textContent = `IVORY RELIC — ` + SlotRenderer.formatOutcome({ win, meta });
      }
    };

    window.SLOT_MACHINE = machine;
    window.spinSlot = () => SlotCore.spin(machine);
  })();
