// ----------------------------------------
// SLOTCORE.JS — INSTITUTIONAL SLOT ENGINE
// Golden Vault | Phase C
// ----------------------------------------

(function () {
  "use strict";

  if (!window.VaultEngine) {
    console.error("VaultEngine missing");
    return;
  }

  const SlotCore = {
    spinning: false,

    spin(machine) {
      if (this.spinning) return;
      if (VaultEngine.getBalance() < machine.bet) return;

      this.spinning = true;
      VaultEngine.adjustBalance(-machine.bet);

      const result = this.spinReels(machine.reels, machine.symbols);
      const win = this.calculateWin(result, machine.symbols);

      setTimeout(() => {
        if (win > 0) VaultEngine.adjustBalance(win);
        machine.render(result, win);
        this.spinning = false;
      }, machine.delay || 1000);
    },

    spinReels(reels, symbols) {
      return Array.from({ length: reels }, () => {
        const pool = [];
        symbols.forEach(s => {
          for (let i = 0; i < s.weight; i++) pool.push(s);
        });
        return pool[Math.floor(Math.random() * pool.length)];
      });
    },

    calculateWin(result, symbols) {
      const counts = {};
      let scatters = 0;

      result.forEach(s => {
        counts[s.id] = (counts[s.id] || 0) + 1;
        if (s.scatter) scatters++;
      });

      let payout = 0;

      for (let id in counts) {
        if (counts[id] >= 3) {
          const sym = symbols.find(x => x.id === id);
          payout += sym.payout * counts[id];
        }
      }

      if (scatters >= 3) {
        payout += scatters * 250;
      }

      return payout;
    }
  };

  window.SlotCore = SlotCore;

})();
