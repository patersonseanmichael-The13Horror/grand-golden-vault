/* ======================================================
   ROULETTE ENGINE — Vault Consumer (Enhanced)
   - Adds spinDetailed() for visual wheel integration
====================================================== */

const RouletteEngine = (() => {

  const COLORS = ["RED", "BLACK"];

  function spinWheel(){
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function spinDetailed(betAmount, choice){
    if (!COLORS.includes(choice))
      throw new Error("Invalid bet choice");

    VaultEngine.withdraw(betAmount, "ROULETTE_BET");

    const result = spinWheel();
    const win = result === choice;

    if (win){
      VaultEngine.deposit(betAmount * 2, "ROULETTE_WIN");
    }

    return {
      result,
      win,
      message: win ? `Result: ${result}. You win.` : `Result: ${result}. You lose.`
    };
  }

  return Object.freeze({
    spin(betAmount, choice){
      const out = spinDetailed(betAmount, choice);
      return out.message;
    },
    spinDetailed
  });

})();
