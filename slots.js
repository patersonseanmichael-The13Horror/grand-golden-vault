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

    // Validate bet
    if(!BetEngine.canBet(BET_AMOUNT)){
      resultText.textContent = "Cannot place bet!";
      return;
    }

    try {
      VaultEngine.debit(BET_AMOUNT,"slots-bet");
      BetEngine.placeBet(BET_AMOUNT,"slots");
    } catch(e){
      resultText.textContent = e.message;
      return;
    }

    updateBalanceUI();
    resultText.textContent = "Spinning...";
    spinning = true;
    spinBtn.disabled = true;

    // Spin animation
    const finalSymbols = [];
    reels.forEach((reel,i)=>{
      let spinCount = 25 + RNGEngine.getRandom(0,10);
      let current = 0;

      const interval = setInterval(()=>{
        reel.innerText = symbols[current % symbols.length];
        current++;
        spinCount--;
        if(spinCount <=0){
          clearInterval(interval);
          const finalSymbol = getRandomSymbol();
          reel.innerText = finalSymbol;
          finalSymbols[i] = finalSymbol;

          // Once all reels finished
          if(finalSymbols.filter(s=>s===undefined).length===0){
            resolveSpin(finalSymbols);
          }
        }
      },70 + i*30);
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

})();
