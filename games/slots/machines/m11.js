(function(){
    "use strict";

    const machine = {
      id: "M11_ROYAL_MINT",
      bet: 225,
      reels: 5,
      rows: 3,
      delay: 1025,
      symbols: [
        {
                "id": "BAR",
                "weight": 2,
                "payout": 25,
                "wild": true
        },
        {
                "id": "NUGGET",
                "weight": 3,
                "payout": 20,
                "scatter": true
        },
        {
                "id": "EAGLE",
                "weight": 4,
                "payout": 15
        },
        {
                "id": "COIN",
                "weight": 6,
                "payout": 10
        },
        {
                "id": "HORSESHOE",
                "weight": 8,
                "payout": 5
        },
        {
                "id": "PICKAXE",
                "weight": 10,
                "payout": 3
        }
],
      render(grid, win, meta){
        const resultText = document.getElementById("resultText");
        SlotRenderer.renderGrid({ grid, meta });
        resultText.textContent = `ROYAL MINT — ` + SlotRenderer.formatOutcome({ win, meta });
      }
    };

    window.SLOT_MACHINE = machine;
    window.spinSlot = () => SlotCore.spin(machine);
  })();
