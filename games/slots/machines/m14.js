(function(){
    "use strict";

    const machine = {
      id: "M14_SILVER_SIGIL",
      bet: 150,
      reels: 5,
      rows: 3,
      delay: 1100,
      symbols: [
        {
                "id": "SERPENT",
                "weight": 2,
                "payout": 28,
                "wild": true
        },
        {
                "id": "IDOL",
                "weight": 3,
                "payout": 22,
                "scatter": true
        },
        {
                "id": "MASK",
                "weight": 4,
                "payout": 16
        },
        {
                "id": "GEM",
                "weight": 6,
                "payout": 11
        },
        {
                "id": "TORCH",
                "weight": 8,
                "payout": 6
        },
        {
                "id": "COIN",
                "weight": 10,
                "payout": 4
        }
],
      render(grid, win, meta){
        const resultText = document.getElementById("resultText");
        SlotRenderer.renderGrid({ grid, meta });
        resultText.textContent = `SILVER SIGIL — ` + SlotRenderer.formatOutcome({ win, meta });
      }
    };

    window.SLOT_MACHINE = machine;
    window.spinSlot = () => SlotCore.spin(machine);
  })();
