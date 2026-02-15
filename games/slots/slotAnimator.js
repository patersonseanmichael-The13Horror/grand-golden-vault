/* ======================================================
   SlotAnimator — Premium Vegas Motion (Institutional)
   - No external assets (WebAudio)
   - Subtle ticks, stop thunk, win chime
   - Optional win-line highlighting via DOM
====================================================== */

(function () {
  "use strict";

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function getReelsEl() {
    // Slot pages use: <div class="reels" id="slotDisplay">
    return document.getElementById("slotDisplay");
  }

  function setState(el, state, on) {
    if (!el) return;
    el.classList.toggle(state, !!on);
  }

  // -----------------------
  // WebAudio (subtle)
  // -----------------------
  let ctx;
  function audioCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function blip({ freq = 220, dur = 0.045, type = "sine", gain = 0.04 } = {}) {
    try {
      const c = audioCtx();
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.value = 0.0001;
      o.connect(g); g.connect(c.destination);
      const t = c.currentTime;
      g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t);
      o.stop(t + dur + 0.02);
    } catch {}
  }

  function tick() { blip({ freq: 240 + Math.random()*40, dur: 0.03, type:"triangle", gain:0.025 }); }
  function stopThump() { blip({ freq: 110, dur: 0.06, type:"sine", gain:0.05 }); }
  function winChime() {
    blip({ freq: 392, dur: 0.06, type:"sine", gain:0.04 });
    setTimeout(()=>blip({ freq: 523.25, dur: 0.07, type:"sine", gain:0.035 }), 90);
  }

  // -----------------------
  // Highlighting helpers
  // -----------------------
  function clearHits() {
    const reels = getReelsEl();
    if (!reels) return;
    reels.querySelectorAll(".reel-symbol").forEach(el => el.classList.remove("gv-hit","gv-hit-strong"));
  }

  function highlight(meta) {
  clearHits();
  const reels = getReelsEl();
  if (!reels || !meta) return;

  const cells = Array.from(reels.querySelectorAll(".reel-symbol"));
  const pos = Array.isArray(meta.winPositions) ? meta.winPositions : [];

  pos.forEach((i, n) => {
    const el = cells[i];
    if (!el) return;
    el.classList.add("gv-hit");
    if (n < 5) el.classList.add("gv-hit-strong");
  });
}

  // -----------------------
  // Motion
  // -----------------------
  async function animateSpin({ duration = 950, stopStagger = 85 } = {}) {
    const reels = getReelsEl();
    if (!reels) return;

    clearHits();
    setState(reels, "is-win", false);
    setState(reels, "is-stopping", false);
    setState(reels, "is-spinning", true);

    // Ticks during spin (subtle)
    const tickEvery = 120;
    let ticking = true;
    (async ()=>{
      while (ticking) { tick(); await sleep(tickEvery); }
    })();

    await sleep(Math.max(260, duration - (stopStagger * 5)));

    setState(reels, "is-stopping", true);

    const cells = Array.from(reels.querySelectorAll(".reel-symbol"));
    for (let i = 0; i < cells.length; i++) {
      await sleep(stopStagger);
      cells[i].classList.remove("gv-settle");
      void cells[i].offsetWidth;
      cells[i].classList.add("gv-settle");
    }

    ticking = false;
    await sleep(90);
    stopThump();

    setState(reels, "is-spinning", false);
    setState(reels, "is-stopping", false);
  }

  function markWin(on = true, meta = null) {
    const reels = getReelsEl();
    if (!reels) return;
    setState(reels, "is-win", !!on);

    if (on) {
      winChime();
      highlight(meta);
    } else {
      clearHits();
    }
  }

  // Allow first interaction to unlock AudioContext
  window.addEventListener("pointerdown", () => { try { audioCtx().resume(); } catch {} }, { once: true });

  window.SlotAnimator = { animateSpin, markWin, highlight, clearHits };

})();
