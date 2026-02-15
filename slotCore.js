// ----------------------------------------
// SLOTCORE.JS — INSTITUTIONAL SLOT ENGINE (PASS 4)
// - 5 reels x 3 rows
// - Multi-line paylines
// - Wild + Scatter
// - VaultEngine is sole money authority
// ----------------------------------------

(function () {
  "use strict";

  if (!window.VaultEngine) {
    console.error("VaultEngine missing");
    return;
  }

  // 10 premium paylines (row index per reel)
  const DEFAULT_PAYLINES = [
    [1, 1, 1, 1, 1], // mid
    [0, 0, 0, 0, 0], // top
    [2, 2, 2, 2, 2], // bottom
    [0, 1, 2, 1, 0], // V
    [2, 1, 0, 1, 2], // ^
    [0, 0, 1, 0, 0], // top dip
    [2, 2, 1, 2, 2], // bottom rise
    [1, 0, 1, 2, 1], // zig
    [1, 2, 1, 0, 1], // zag
    [0, 1, 1, 1, 2], // ramp
  ];

  function inferPayouts(sym) {
    if (sym && sym.payouts) return sym.payouts;
    // If only sym.payout exists (treated as 5OAK multiplier), infer 3/4.
    const p5 = Number(sym && sym.payout ? sym.payout : 0);
    if (!p5) return { 3: 0, 4: 0, 5: 0 };
    const p4 = Math.max(1, Math.floor(p5 / 2));
    const p3 = Math.max(1, Math.floor(p5 / 6));
    return { 3: p3, 4: p4, 5: p5 };
  }

  // index in a 15-cell grid stored reel-major: [R1 row0,row1,row2, R2 row0,row1,row2, ...]
  function idx(row, reel) {
    return reel * 3 + row;
  }

  function buildPool(symbols) {
    const pool = [];
    symbols.forEach((s) => {
      const w = Math.max(1, Number(s.weight || 1));
      for (let i = 0; i < w; i++) pool.push(s);
    });
    return pool;
  }

  const SlotCore = {
    spinning: false,

    spin(machine) {
      if (this.spinning) return;

      try {
        const rows = machine.rows || 3;
        const reels = machine.reels || 5;
        const paylines = machine.paylines || DEFAULT_PAYLINES;

        if (rows !== 3 || reels !== 5) {
          throw new Error("SlotCore expects 5 reels x 3 rows in this build");
        }

        if (VaultEngine.getBalance() < machine.bet) return;
        this.spinning = true;

        const anim = window.SlotAnimator?.animateSpin
          ? window.SlotAnimator.animateSpin({
              duration: machine.delay || 1000,
              stopStagger: 70,
            })
          : Promise.resolve();

        VaultEngine.withdraw(machine.bet, `SLOTS_BET_${machine.id}`);

        const grid = this.spinGrid(reels, rows, machine.symbols);
        const outcome = this.calculateOutcome({
          grid,
          paylines,
          symbols: machine.symbols,
          bet: machine.bet,
        });

        Promise.resolve(anim).then(() => {
          if (outcome.totalWin > 0) {
            VaultEngine.deposit(outcome.totalWin, `SLOTS_WIN_${machine.id}`);
          }

          machine.render(grid, outcome.totalWin, outcome.meta);

          if (window.SlotAnimator?.markWin) {
            window.SlotAnimator.markWin(outcome.totalWin > 0, outcome.meta);
          }

          this.spinning = false;
        });
      } catch (e) {
        this.spinning = false;
        alert(e.message);
      }
    },

    spinGrid(reels, rows, symbols) {
      const pool = buildPool(symbols);
      const out = [];
      for (let reel = 0; reel < reels; reel++) {
        for (let row = 0; row < rows; row++) {
          out.push(pool[Math.floor(Math.random() * pool.length)]);
        }
      }
      return out;
    },

    calculateOutcome({ grid, paylines, symbols, bet }) {
      const wins = [];
      let total = 0;

      const wildPositions = [];
      const scatterPositions = [];
      grid.forEach((s, i) => {
        if (s.wild) wildPositions.push(i);
        if (s.scatter) scatterPositions.push(i);
      });

      // Scatter bonus anywhere
      const scatters = scatterPositions.length;
      let scatterBonus = 0;
      if (scatters >= 3) {
        scatterBonus = scatters * 250;
        total += scatterBonus;
      }

      const winPositionsSet = new Set();

      // Payline evaluation (left-to-right, wild substitutes, scatters break)
      for (let li = 0; li < paylines.length; li++) {
        const line = paylines[li];

        const lineCells = [];
        for (let reel = 0; reel < 5; reel++) {
          const row = line[reel];
          const i = idx(row, reel);
          lineCells.push({ s: grid[i], i, reel, row });
        }

        // target = first non-wild, non-scatter; else first
        let target = null;
        for (const c of lineCells) {
          if (!c.s.scatter && !c.s.wild) {
            target = c.s;
            break;
          }
        }
        if (!target) target = lineCells[0].s;

        const matched = [];
        for (const c of lineCells) {
          if (c.s.scatter) break;
          if (c.s.wild || String(c.s.id) === String(target.id)) {
            matched.push(c);
          } else {
            break;
          }
        }

        const count = matched.length;
        if (count >= 3) {
          const payouts = inferPayouts(target);
          const mult = Number(payouts[count] || 0);
          if (mult > 0) {
            const lineWin = bet * mult;
            total += lineWin;
            matched.forEach((m) => winPositionsSet.add(m.i));
            wins.push({
              line: li + 1,
              symbol: String(target.id),
              count,
              mult,
              lineWin,
              positions: matched.map((m) => m.i),
            });
          }
        }
      }

      const winPositions = Array.from(winPositionsSet.values());

      // choose primary win for display (highest lineWin)
      let primary = null;
      wins.forEach((w) => {
        if (!primary || w.lineWin > primary.lineWin) primary = w;
      });

      return {
        totalWin: total,
        meta: {
          paylinesCount: paylines.length,
          wins,
          primary,
          winPositions,
          wildPositions,
          scatterPositions,
          scatters,
          scatterBonus,
        },
      };
    },
  };

  window.SlotCore = SlotCore;
})();
