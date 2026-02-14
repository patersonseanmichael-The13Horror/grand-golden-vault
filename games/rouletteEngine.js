/* ======================================================
   ROULETTE ENGINE — VAULT CONSUMER
====================================================== */

const RouletteEngine = (() => {

  const COLORS = ["RED", "BLACK"];

  function spinWheel(){
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  return Object.freeze({

    spin(betAmount, choice){
      if (!COLORS.includes(choice))
        throw new Error("Invalid bet choice");

      VaultEngine.withdraw(betAmount, "ROULETTE_BET");

      const result = spinWheel();

      if (result === choice){
        VaultEngine.deposit(betAmount * 2, "ROULETTE_WIN");
        return `Result: ${result}. You win.`;
      }

      return `Result: ${result}. You lose.`;
    }

  });

})();
