/* ======================================================
   SlotAnimator — Premium Vegas Motion (Institutional)
====================================================== */

(function () {
  "use strict";

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  function getReelsEl() {
    // Your template uses: <div class="reels" id="slotDisplay">
    const el = document.getElementById("slotDisplay");
    return el ? el : null;
  }

  function setState(el, state, on) {
    if (!el) return;
    el.classList.toggle(state, !!on);
  }

  async function animateSpin({ duration = 900, stopStagger = 90 } = {}) {
    const reels = getReelsEl();
    if (!reels) return;

    setState(reels, "is-win", false);
    setState(reels, "is-stopping", false);
    setState(reels, "is-spinning", true);

    // Fake staggered stop feel
    await sleep(Math.max(250, duration - (stopStagger * 5)));

    setState(reels, "is-stopping", true);

    // Stagger “settle” class per symbol cell
    const cells = Array.from(reels.querySelectorAll(".reel-symbol"));
    for (let i = 0; i < cells.length; i++) {
      await sleep(stopStagger);
      cells[i].classList.remove("gv-settle");
      // force reflow so animation can retrigger
      void cells[i].offsetWidth;
      cells[i].classList.add("gv-settle");
    }

    await sleep(120);
    setState(reels, "is-spinning", false);
    setState(reels, "is-stopping", false);
  }

  function markWin(on = true) {
    const reels = getReelsEl();
    if (!reels) return;
    setState(reels, "is-win", !!on);
  }

  window.SlotAnimator = { animateSpin, markWin };

})();
