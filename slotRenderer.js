/* ======================================================
   SlotRenderer — Premium Grid Rendering
   - Applies wild/scatter tags
   - Applies payline highlight positions
====================================================== */

(function(){
  "use strict";

  function renderGrid({ grid, meta, symbolLabel }){
    const display = document.getElementById("slotDisplay");
    if (!display) return;

    const winSet = new Set((meta && meta.winPositions) || []);
    const wildSet = new Set((meta && meta.wildPositions) || []);
    const scatSet = new Set((meta && meta.scatterPositions) || []);

    const hasSymbols = !!window.SlotSymbols && typeof window.SlotSymbols.render === "function";

    display.innerHTML = grid.map((s, i) => {
      const isPay = winSet.has(i);
      const isWild = wildSet.has(i);
      const isScat = scatSet.has(i);

      const cls = ["reel-symbol"]
        .concat(isPay ? ["gv-pay"] : [])
        .concat(isWild ? ["gv-wild"] : [])
        .concat(isScat ? ["gv-scatter"] : [])
        .join(" ");

      const label = symbolLabel
        ? symbolLabel(s)
        : (hasSymbols ? window.SlotSymbols.render(s.id) : String(s.id));

      const tag = isWild ? "WILD" : (isScat ? "SCATTER" : "");
      const tagAttr = tag ? ` data-tag="${tag}"` : "";

      return `<div class="${cls}" data-i="${i}"${tagAttr}><div class="gv-iconwrap">${label}</div></div>`;
    }).join("");
  }

  function formatOutcome({ win, meta }){
    if (!meta) return win > 0 ? `PAYS ${win} GOLD` : `NO WIN`;

    const lines = (meta.wins || []).length;
    const scat = meta.scatters || 0;
    const sb = meta.scatterBonus || 0;

    if (win <= 0) return `NO WIN — ALIGNMENT REQUIRED`;

    const parts = [];
    if (lines) parts.push(`${lines} LINE${lines===1?"":"S"}`);
    if (scat >= 3) parts.push(`${scat} SCATTER (+${sb})`);
    return `PAYS ${win} GOLD • ${parts.join(" • ")}`;
  }

  window.SlotRenderer = { renderGrid, formatOutcome };
})();
