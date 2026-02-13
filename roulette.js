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

  // --------------------------------------
// SOVEREIGN UPGRADE LAYER
// --------------------------------------

let sessionStats = {
  spins: 0,
  wagered: 0,
  paidOut: 0
};

const historyPanel = document.getElementById("rouletteHistory");
const analyticsPanel = document.getElementById("analyticsPanel");
const ticker = document.getElementById("highRollerTicker");

const spinSound = document.getElementById("spinSound");
const tickSound = document.getElementById("tickSound");
const winSound = document.getElementById("winSound");

function playSound(sound){
  if(!sound) return;
  sound.currentTime = 0;
  sound.play().catch(()=>{});
}

// ----------------------------
// A) BALL ORBIT EFFECT
// ----------------------------

function simulateBallTicks(duration=2000){
  const interval = setInterval(()=>{
    playSound(tickSound);
  }, 120);

  setTimeout(()=>{
    clearInterval(interval);
  }, duration);
}

// ----------------------------
// B) ANALYTICS
// ----------------------------

function updateAnalytics(){
  const edge = sessionStats.wagered > 0
    ? ((sessionStats.wagered - sessionStats.paidOut)
      / sessionStats.wagered * 100).toFixed(2)
    : 0;

  analyticsPanel.innerText =
    `Spins: ${sessionStats.spins} | Wagered: ${sessionStats.wagered} | Paid: ${sessionStats.paidOut} | House Edge: ${edge}%`;
}

// ----------------------------
// C) HISTORY PANEL
// ----------------------------

function addHistory(number){
  const ball = document.createElement("div");
  ball.className="history-ball";

  if(number===0) ball.style.background="#0f800f";
  else if(isRed(number)) ball.style.background="#b00000";
  else ball.style.background="#000";

  ball.innerText = number;

  historyPanel.prepend(ball);

  if(historyPanel.children.length>15){
    historyPanel.removeChild(historyPanel.lastChild);
  }
}

// ----------------------------
// D) HIGH ROLLER TICKER
// ----------------------------

function randomMaskedId(){
  return Math.floor(10+Math.random()*89)+"*****"+Math.floor(100+Math.random()*899);
}

function randomWin(){
  return Math.floor(200+Math.random()*5000);
}

function startTicker(){
  setInterval(()=>{
    ticker.innerText =
      `${randomMaskedId()} just won ${randomWin()} GOLD`;
  }, 3500);
}

startTicker();

// ----------------------------
// E) HOOK INTO EXISTING FLOW
// ----------------------------

// Wrap original resolveSpin safely
const originalResolve = resolveSpin;

resolveSpin = function(number){

  sessionStats.spins++;
  sessionStats.wagered += BET_AMOUNT;

  playSound(spinSound);
  simulateBallTicks(1500);

  const balanceBefore = VaultEngine.getBalance();

  originalResolve(number);

  const balanceAfter = VaultEngine.getBalance();

  const paid = Math.max(balanceAfter - balanceBefore, 0);
  sessionStats.paidOut += paid;

  if(paid>0){
    playSound(winSound);
  }

  addHistory(number);
  updateAnalytics();
};

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
