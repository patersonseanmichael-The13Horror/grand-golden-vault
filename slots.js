// --------------------------------------
// GRAND GOLDEN VAULT
// Institutional Slots Table
// --------------------------------------

(function () {
  "use strict";

  const reels = document.querySelectorAll(".reel");
  const spinBtn = document.getElementById("spinBtn");
  const resultText = document.getElementById("resultText");
  const balanceEl = document.getElementById("balance");

  const BET_AMOUNT = 50;
  const symbols = ["🍒", "💎", "7️⃣", "🔔", "💰", "⭐", "🪙"];

  let spinning = false;

  // ----------------------------
  // INIT
  // ----------------------------

 VaultEngine.init();       // Loads or initializes user balance
StateManager.load();      // Load current slots state if any

  function updateBalanceUI() {
    const balance = VaultEngine.getBalance();
    balanceEl.innerText = `GOLD: ${balance.toFixed(2)}`;
  }

  // ----------------------------
  // CONTROLLED RNG
  // ----------------------------

  function secureRandomIndex() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % symbols.length;
  }

  // ----------------------------
  // SPIN LOGIC
  // ----------------------------

  function spinSlots() {
    if (spinning) return; // spin lock

    const balance = VaultEngine.getBalance();

    if (balance < BET_AMOUNT) {
      resultText.innerText = "Insufficient GOLD.";
      return;
    }

    try {
      VaultEngine.debit(BET_AMOUNT, "slots-bet");
    } catch (err) {
      resultText.innerText = err.message;
      return;
    }

    updateBalanceUI();
    resultText.innerText = "Spinning...";
    spinning = true;
    spinBtn.disabled = true;

    const finalSymbols = [];

    reels.forEach((reel, i) => {
      let spinCount = 25 + secureRandomIndex();
      let current = 0;

      const interval = setInterval(() => {
        reel.innerText = symbols[current % symbols.length];
        current++;
        spinCount--;

        if (spinCount <= 0) {
          clearInterval(interval);

          const finalIndex = secureRandomIndex();
          const finalSymbol = symbols[finalIndex];

          reel.innerText = finalSymbol;
          finalSymbols[i] = finalSymbol;

          if (finalSymbols.filter(s => s === undefined).length === 0) {
            resolveSpin(finalSymbols);
          }
        }

      }, 70 + i * 40);
    });
  }

  // ----------------------------
  // PAYOUT ENGINE
  // ----------------------------

  function resolveSpin(finalSymbols) {
    const [a, b, c] = finalSymbols;
    let winAmount = 0;

    if (a === b && b === c) {
      winAmount = BET_AMOUNT * 20; // jackpot multiplier
      resultText.innerText =
        `JACKPOT! ${finalSymbols.join(" ")} — +${winAmount} GOLD`;
    }
    else if (a === b || b === c || a === c) {
      winAmount = BET_AMOUNT * 4;
      resultText.innerText =
        `Match! ${finalSymbols.join(" ")} — +${winAmount} GOLD`;
    }
    else {
      resultText.innerText =
        `No Win: ${finalSymbols.join(" ")}`;
    }

    if (winAmount > 0) {
      VaultEngine.credit(winAmount, "slots-win");
    }

    updateBalanceUI();

    spinning = false;
    spinBtn.disabled = false;

    if (winAmount >= BET_AMOUNT * 20) {
      triggerBigWinEffect();
    }
  }

  // ----------------------------
  // BIG WIN EFFECT
  // ----------------------------

  function triggerBigWinEffect() {
    const badge = document.createElement("div");
    badge.className = "vip-badge";
    badge.innerText = "VAULT JACKPOT";
    badge.style.position = "fixed";
    badge.style.top = "30%";
    badge.style.left = "50%";
    badge.style.transform = "translateX(-50%) scale(0)";
    badge.style.zIndex = "9999";
    badge.style.fontSize = "2.5rem";

    document.body.appendChild(badge);

    badge.animate([
      { transform: "translateX(-50%) scale(0)", opacity: 0 },
      { transform: "translateX(-50%) scale(1.3)", opacity: 1 },
      { transform: "translateX(-50%) scale(1)", opacity: 1 },
      { transform: "translateX(-50%) scale(1)", opacity: 0 }
    ], {
      duration: 2200,
      easing: "ease-out",
      fill: "forwards"
    });

    setTimeout(() => badge.remove(), 2200);
  }

  // ----------------------------
  // EVENT BINDING
  // ----------------------------

  spinBtn.addEventListener("click", spinSlots);

})();
