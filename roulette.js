// --------------------------------------
// GRAND GOLDEN VAULT
// Institutional Roulette Table
// --------------------------------------

(function () {
  "use strict";

  const spinBtn = document.getElementById("spinBtn");
  const resultText = document.getElementById("resultText");
  const balanceEl = document.getElementById("balance");

  const BET_AMOUNT = 100;

  let selectedBet = null;
  let spinning = false;

  // ----------------------------
  // ROULETTE DATA
  // ----------------------------

  const redNumbers = [
    1,3,5,7,9,12,14,16,18,19,
    21,23,25,27,30,32,34,36
  ];

  function isRed(num) {
    return redNumbers.includes(num);
  }

  function secureRandomNumber() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % 37; // 0–36
  }

  // ----------------------------
  // INIT
  // ----------------------------

  VaultEngine.init();
  updateBalanceUI();

  function updateBalanceUI() {
    balanceEl.innerText =
      "GOLD: " + VaultEngine.getBalance().toFixed(2);
  }

  // ----------------------------
  // BET SELECTION
  // ----------------------------

  document.querySelectorAll(".bet-option").forEach(btn => {
    btn.addEventListener("click", () => {
      if (spinning) return;

      selectedBet = btn.dataset.bet;
      document.querySelectorAll(".bet-option")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // ----------------------------
  // SPIN LOGIC
  // ----------------------------

  spinBtn.addEventListener("click", () => {
    if (spinning) return;

    if (!selectedBet) {
      resultText.innerText = "Select a bet first.";
      return;
    }

    const balance = VaultEngine.getBalance();

    if (balance < BET_AMOUNT) {
      resultText.innerText = "Insufficient GOLD.";
      return;
    }

    try {
      VaultEngine.debit(BET_AMOUNT, "roulette-bet");
    } catch (err) {
      resultText.innerText = err.message;
      return;
    }

    updateBalanceUI();

    spinning = true;
    spinBtn.disabled = true;
    resultText.innerText = "Spinning wheel...";

    setTimeout(() => {
      const winningNumber = secureRandomNumber();
      resolveSpin(winningNumber);
    }, 2000);
  });

  // ----------------------------
  // PAYOUT ENGINE
  // ----------------------------

  function resolveSpin(number) {
    let winAmount = 0;
    let win = false;

    if (selectedBet === "red" && isRed(number)) {
      winAmount = BET_AMOUNT * 2;
      win = true;
    }

    else if (selectedBet === "black" && number !== 0 && !isRed(number)) {
      winAmount = BET_AMOUNT * 2;
      win = true;
    }

    else if (!isNaN(parseInt(selectedBet))) {
      if (parseInt(selectedBet) === number) {
        winAmount = BET_AMOUNT * 36;
        win = true;
      }
    }

    if (win) {
      VaultEngine.credit(winAmount, "roulette-win");
      resultText.innerText =
        `Ball: ${number} — YOU WIN +${winAmount} GOLD`;
      triggerWinEffect();
    } else {
      resultText.innerText =
        `Ball: ${number} — No Win`;
    }

    updateBalanceUI();

    spinning = false;
    spinBtn.disabled = false;
  }

  // ----------------------------
  // WIN EFFECT
  // ----------------------------

  function triggerWinEffect() {
    document.body.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.02)" },
        { transform: "scale(1)" }
      ],
      { duration: 300, easing: "ease-out" }
    );
  }

})();
