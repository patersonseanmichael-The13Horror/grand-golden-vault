// GRAND GOLDEN VAULT — Modular Slots
(function(){
  "use strict";

  // ----- DOM Elements -----
  const reels = document.querySelectorAll(".reel");
  const spinBtn = document.getElementById("spinBtn");
  const balanceEl = document.getElementById("balance");
  const resultText = document.getElementById("resultText");

  // ----- Config -----
  const symbols = ["🍒","💎","7️⃣","🔔","💰","⭐","🪙"];
  const BET_AMOUNT = 50; 
  let spinning = false;

  // ----- Initialize Vault and State -----
  VaultEngine.init();
  StateManager.load();  // load previous state if any
  updateBalanceUI();

  function updateBalanceUI(){
    balanceEl.textContent = VaultEngine.getBalance();
  }

  function getRandomSymbol(){
    return symbols[RNGEngine.getRandom(0,symbols.length-1)];
  }

  function spinSlots(){
  if(spinning) return;

  // Check balance
  if(BET_AMOUNT > VaultEngine.getBalance()){
    resultText.textContent = "Insufficient GOLD!";
    return;
  }

  VaultEngine.debit(BET_AMOUNT, "slots-bet");
  updateBalanceUI();
  resultText.textContent = "Spinning...";
  spinning = true;
  spinBtn.disabled = true;

  const finalSymbols = [];
  reels.forEach((reel, i)=>{
    let spinCount = 25 + RNGEngine.getRandom(0,10);
    let current = 0;

    const interval = setInterval(()=>{
      reel.innerText = symbols[current % symbols.length];
      current++;
      spinCount--;

      if(spinCount <= 0){
        clearInterval(interval);
        const finalSymbol = symbols[RNGEngine.getRandom(0,symbols.length-1)];
        reel.innerText = finalSymbol;
        finalSymbols[i] = finalSymbol;

        if(finalSymbols.filter(s=>s===undefined).length===0){
          resolveSpin(finalSymbols);
        }
      }
    }, 70 + i*30);
  });
}

  function resolveSpin(finalSymbols){
    const [a,b,c] = finalSymbols;
    let winAmount = 0;
    let message = "No Win";

    if(a===b && b===c){
      winAmount = BET_AMOUNT*20;
      message = `JACKPOT! ${finalSymbols.join(" ")} — +${winAmount} GOLD`;
      if(window.animationController) animationController.triggerBigWin();
    } else if(a===b || b===c || a===c){
      winAmount = BET_AMOUNT*4;
      message = `Match! ${finalSymbols.join(" ")} — +${winAmount} GOLD`;
    }

    if(winAmount>0){
      VaultEngine.credit(winAmount,"slots-win");
    }

    resultText.textContent = message;
    updateBalanceUI();
    StateManager.save({
      reels: finalSymbols,
      lastResult: message,
      balance: VaultEngine.getBalance()
    });

    spinning = false;
    spinBtn.disabled = false;
  }

  spinBtn.addEventListener("click", spinSlots);

  document.getElementById("autoSpinBtn").addEventListener("click", ()=>{
  let spins = 10;
  const autoSpin = setInterval(()=>{
    if(spins-- <= 0 || VaultEngine.getBalance() < BET_AMOUNT){
      clearInterval(autoSpin);
      return;
    }
    spinSlots();
  }, 1200);
});

document.getElementById("doubleUpBtn").addEventListener("click", ()=>{
  if(spinning) return;
  const doubleBet = BET_AMOUNT * 2;
  if(doubleBet > VaultEngine.getBalance()){
    resultText.textContent = "Cannot Double Up!";
    return;
  }
  VaultEngine.debit(doubleBet, "slots-double");
  spinSlots();
});

})();
