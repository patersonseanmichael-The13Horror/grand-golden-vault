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
        VaultEngine.deposit(bet, "BLACKJACK_PUSH");/* ======================================================
   BLACKJACK ENGINE — Vault Consumer (Enhanced)
   - Exposes hands for UI
   - Supports Hit / Stand
   - Simple ace-less scoring (1–10) for now
====================================================== */

const BlackjackEngine = (() => {

  let active = false;
  let bet = 0;
  let result = "";
  let player = [];
  let dealer = [];

  function drawCard(){
    // Vault-friendly, simple deck: 1–10
    return Math.floor(Math.random() * 10) + 1;
  }

  function score(hand){
    return hand.reduce((a,b)=>a+b,0);
  }

  function settle(){
    const ps = score(player);
    const ds = score(dealer);

    if (ps > 21){
      result = `Bust — Dealer wins.`;
      active = false;
      return;
    }

    while (ds < 17){
      dealer.push(drawCard());
      if (score(dealer) > 21) break;
    }

    const ds2 = score(dealer);

    if (ds2 > 21 || ps > ds2){
      VaultEngine.deposit(bet * 2, "BLACKJACK_WIN");
      result = `You win.`;
    } else if (ps === ds2){
      VaultEngine.deposit(bet, "BLACKJACK_PUSH");
      result = `Push.`;
    } else {
      result = `Dealer wins.`;
    }

    active = false;
  }

  return Object.freeze({

    startRound(amount){
      if (active) throw new Error("Round already in progress");
      if (amount <= 0) throw new Error("Invalid bet");

      VaultEngine.withdraw(amount, "BLACKJACK_BET");
      bet = amount;
      result = "";
      player = [drawCard(), drawCard()];
      dealer = [drawCard(), drawCard()];
      active = true;

      // Auto settle on natural 21
      if (score(player) === 21) settle();
    },

    hit(){
      if (!active) throw new Error("No active round");
      player.push(drawCard());
      if (score(player) >= 21) settle();
    },

    stand(){
      if (!active) throw new Error("No active round");
      settle();
    },

    getHands(){
      return {
        active,
        bet,
        player: [...player],
        dealer: [...dealer],
        playerScore: score(player),
        dealerScore: active ? "?" : score(dealer)
      };
    },

    getStatus(){
      return result || (active ? "Round in progress." : "Place your bet to begin.");
    }

  });

})();

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
