/* ======================================================
   SlotSymbols — Premium Iconography (No copyright)
   - Renders tasteful SVG icons instead of raw text
   - Normalizes ids (case/underscores)
====================================================== */

(function(){
  "use strict";

  const norm = (id) => String(id || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  // Small, elegant, “vault-grade” SVGs. Intentionally abstract.
  const svg = {
    crown: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M10 46h44l-4 10H14l-4-10z" fill="currentColor" opacity=".85"/>
        <path d="M12 44l6-26 14 14 14-14 6 26H12z" fill="currentColor"/>
        <circle cx="18" cy="18" r="3" fill="currentColor" opacity=".9"/>
        <circle cx="32" cy="24" r="3" fill="currentColor" opacity=".9"/>
        <circle cx="46" cy="18" r="3" fill="currentColor" opacity=".9"/>
      </svg>`,

    compass: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" stroke-width="4" opacity=".9"/>
        <path d="M32 14v6M32 44v6M14 32h6M44 32h6" stroke="currentColor" stroke-width="3" opacity=".7"/>
        <path d="M38 26l-6 14-6-14 12 0z" fill="currentColor"/>
      </svg>`,

    lotus: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M32 14c6 8 7 16 0 24-7-8-6-16 0-24z" fill="currentColor"/>
        <path d="M18 22c10 4 14 10 14 20-10-4-14-10-14-20z" fill="currentColor" opacity=".85"/>
        <path d="M46 22c0 10-4 16-14 20 0-10 4-16 14-20z" fill="currentColor" opacity=".85"/>
        <path d="M20 44c8-2 14 0 12 10-10-2-14-4-12-10z" fill="currentColor" opacity=".75"/>
        <path d="M44 44c2 6-2 8-12 10-2-10 4-12 12-10z" fill="currentColor" opacity=".75"/>
      </svg>`,

    coin: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <ellipse cx="32" cy="22" rx="18" ry="10" fill="none" stroke="currentColor" stroke-width="4"/>
        <path d="M14 22v18c0 6 8 12 18 12s18-6 18-12V22" fill="none" stroke="currentColor" stroke-width="4" opacity=".85"/>
        <path d="M24 30h16" stroke="currentColor" stroke-width="4" opacity=".55"/>
      </svg>`,

    gem: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M16 26l10-12h12l10 12-16 26H32L16 26z" fill="currentColor"/>
        <path d="M26 14l6 12 6-12" fill="none" stroke="currentColor" stroke-width="3" opacity=".75"/>
      </svg>`,

    bar: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M14 28l8-12h28l-8 28H14l8-16z" fill="currentColor"/>
        <path d="M24 22h18" stroke="currentColor" stroke-width="3" opacity=".55"/>
      </svg>`,

    nugget: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M18 42c-6-10 2-22 14-24 14-2 24 12 18 24-4 8-10 10-18 10-8 0-10-2-14-10z" fill="currentColor"/>
        <path d="M26 28c6-4 14-4 20 0" fill="none" stroke="currentColor" stroke-width="3" opacity=".5"/>
      </svg>`,

    torch: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M32 10c6 8 4 14 0 18-4-4-6-10 0-18z" fill="currentColor"/>
        <path d="M26 26h12l-2 8H28l-2-8z" fill="currentColor" opacity=".85"/>
        <path d="M28 34h8v18h-8V34z" fill="currentColor" opacity=".75"/>
      </svg>`,

    pickaxe: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M14 22c12-10 24-10 36 0" fill="none" stroke="currentColor" stroke-width="5"/>
        <path d="M32 18v38" stroke="currentColor" stroke-width="5" opacity=".85"/>
        <path d="M28 38l8 8" stroke="currentColor" stroke-width="5" opacity=".7"/>
      </svg>`,

    eagle: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M12 30c8-10 18-12 20-12s12 2 20 12c-10-4-16-4-20-4s-10 0-20 4z" fill="currentColor"/>
        <path d="M20 34c6 10 18 10 24 0" fill="none" stroke="currentColor" stroke-width="4" opacity=".7"/>
        <path d="M30 30l2 8 2-8" fill="currentColor" opacity=".8"/>
      </svg>`,

    mask: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M14 18c10-6 26-6 36 0v16c0 12-10 20-18 20S14 46 14 34V18z" fill="currentColor"/>
        <path d="M22 30c2-2 6-2 8 0M34 30c2-2 6-2 8 0" stroke="currentColor" stroke-width="3" opacity=".55"/>
      </svg>`,

    sigil: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M32 10l18 10v24L32 54 14 44V20L32 10z" fill="none" stroke="currentColor" stroke-width="4"/>
        <path d="M32 18l10 6v16l-10 6-10-6V24l10-6z" fill="currentColor" opacity=".85"/>
      </svg>`,

    chalice: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M20 14h24v10c0 10-8 18-12 18s-12-8-12-18V14z" fill="currentColor"/>
        <path d="M28 42h8v8h10v4H18v-4h10v-8z" fill="currentColor" opacity=".85"/>
      </svg>`,

    horseshoe: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M20 18c8-10 16-10 24 0v26c0 8-6 12-12 12s-12-4-12-12V18z" fill="none" stroke="currentColor" stroke-width="6"/>
        <circle cx="22" cy="24" r="2" fill="currentColor"/>
        <circle cx="42" cy="24" r="2" fill="currentColor"/>
      </svg>`,

    rope: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M22 12c-8 10-8 30 0 40" fill="none" stroke="currentColor" stroke-width="5"/>
        <path d="M42 12c8 10 8 30 0 40" fill="none" stroke="currentColor" stroke-width="5" opacity=".75"/>
      </svg>`,

    anchor: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M32 12v30" stroke="currentColor" stroke-width="6"/>
        <path d="M24 18h16" stroke="currentColor" stroke-width="6" opacity=".8"/>
        <path d="M16 36c4 10 12 16 16 16s12-6 16-16" fill="none" stroke="currentColor" stroke-width="6" opacity=".8"/>
      </svg>`,

    map: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M18 16l10-4 8 4 10-4v36l-10 4-8-4-10 4V16z" fill="none" stroke="currentColor" stroke-width="4"/>
        <path d="M28 12v36M36 16v36" stroke="currentColor" stroke-width="3" opacity=".6"/>
      </svg>`,

    boot: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M22 12h16v22c0 6 6 8 10 10v8H18v-8c6-2 10-4 10-10V12z" fill="currentColor"/>
      </svg>`,

    cart: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M18 26h30l-6 18H24l-6-18z" fill="currentColor"/>
        <circle cx="26" cy="48" r="4" fill="currentColor" opacity=".85"/>
        <circle cx="40" cy="48" r="4" fill="currentColor" opacity=".85"/>
      </svg>`,

    claim: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M18 12h28v40H18V12z" fill="none" stroke="currentColor" stroke-width="4"/>
        <path d="M24 22h16M24 30h16M24 38h12" stroke="currentColor" stroke-width="4" opacity=".6"/>
      </svg>`,

    prospector: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M16 26c6-10 26-10 32 0-6 4-10 6-16 6s-10-2-16-6z" fill="currentColor"/>
        <path d="M22 30c2 10 6 18 10 18s8-8 10-18" fill="none" stroke="currentColor" stroke-width="4" opacity=".75"/>
      </svg>`,

    serpent: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M44 14c-10-6-28 4-22 16 6 12 26 6 24 18-2 10-18 10-26 4" fill="none" stroke="currentColor" stroke-width="6"/>
        <circle cx="44" cy="16" r="2" fill="currentColor"/>
      </svg>`,

    idol: () => `
      <svg viewBox="0 0 64 64" class="gv-ico" aria-hidden="true">
        <path d="M22 14h20l-2 10H24l-2-10z" fill="currentColor"/>
        <path d="M20 24h24v28H20V24z" fill="currentColor" opacity=".85"/>
        <path d="M26 32h12" stroke="currentColor" stroke-width="4" opacity=".55"/>
      </svg>`,
  };

  function pickIcon(id){
    const k = norm(id);
    if (k === "gold_bar") return svg.bar;
    if (k === "gold_nugget") return svg.nugget;
    if (k === "royal_sigil") return svg.sigil;
    return svg[k] || null;
  }

  function render(id){
    const fn = pickIcon(id);
    if (!fn) return `<span class="gv-text">${String(id)}</span>`;
    return fn();
  }

  window.SlotSymbols = { render, norm };
})();
