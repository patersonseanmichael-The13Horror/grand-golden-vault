/* ======================================================
   BLACKJACK ENGINE — VAULT CONSUMER
====================================================== */

const BlackjackEngine = (() => {

  let active = false;
  let bet = 0;
  let result = "";

  function randomCard(){
    return Math.floor(Math.random() * 10) + 1;
  }

  return Object.freeze({

    startRound(amount){
      if (active) throw new Error("Round already in progress");

      VaultEngine.withdraw(amount, "BLACKJACK_BET");
      bet = amount;
      active = true;

      const player = randomCard() + randomCard();
      const dealer = randomCard() + randomCard();

      if (player > dealer){
        VaultEngine.deposit(bet * 2, "BLACKJACK_WIN");
        result = "You win.";
      } else if (player === dealer){
        VaultEngine.deposit(bet, "BLACKJACK_PUSH");
        result = "Push.";
      } else {
        result = "Dealer wins.";
      }

      active = false;
    },

    finishRound(){
      if (active) active = false;
    },

    getStatus(){
      return result || "Awaiting action.";
    }

  });

})();
