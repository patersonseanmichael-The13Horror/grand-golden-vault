(function(){
    "use strict";

    const machine = {
      id: "M15_ONYX_PROTOCOL",
      bet: 175,
      reels: 5,
      rows: 3,
      delay: 1175,
      symbols: [
        {
                "id": "CROWN",
                "weight": 2,
                "payout": 30,
                "wild": true
        },
        {
                "id": "SIGIL",
                "weight": 3,
                "payout": 25,
                "scatter": true
        },
        {
                "id": "CHALICE",
                "weight": 4,
                "payout": 18
        },
        {
                "id": "GEM",
                "weight": 6,
                "payout": 12
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
        resultText.textContent = `ONYX PROTOCOL — ` + SlotRenderer.formatOutcome({ win, meta });
      }
    };

    window.SLOT_MACHINE = machine;
    window.spinSlot = () => SlotCore.spin(machine);
  })();
