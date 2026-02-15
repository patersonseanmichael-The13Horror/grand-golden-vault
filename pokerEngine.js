/* ======================================================
   POKER ENGINE — 5-Card Draw (Lite)
   - Simple & clean: highest-card comparison
   - Ledger-backed bet/win
====================================================== */

const PokerEngine = (() => {
  const ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];

  function drawCard(){
    const r = Math.floor(Math.random()*ranks.length);
    const s = ["♠","♥","♦","♣"][Math.floor(Math.random()*4)];
    return { r, label: `${ranks[r]}${s}` };
  }

  function hand(){
    const h = [];
    while (h.length < 5) h.push(drawCard());
    return h;
  }

  function bestRank(h){
    return Math.max(...h.map(c=>c.r));
  }

  return Object.freeze({
    play(bet){
      bet = Number(bet||0);
      if (!bet || bet < 25) throw new Error("Minimum bet is 25");
      VaultEngine.withdraw(bet, "POKER_BET");

      const p = hand();
      const d = hand();

      const pr = bestRank(p);
      const dr = bestRank(d);

      let win = 0;
      let outcome = "Dealer wins.";

      if (pr > dr){
        win = bet * 2;
        VaultEngine.deposit(win, "POKER_WIN");
        outcome = "You win.";
      } else if (pr === dr){
        win = bet;
        VaultEngine.deposit(win, "POKER_PUSH");
        outcome = "Push.";
      }

      return {
        player: p,
        dealer: d,
        outcome,
        win
      };
    }
  });
})();
