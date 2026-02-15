(function () {
  "use strict";

  // Enforce private access
  if (window.VaultTransition) VaultTransition.playIfMarked();
  if (window.VaultAuth && typeof VaultAuth.enforce === "function") {
    VaultAuth.enforce();
  }

  const slots = (window.SLOT_CATALOG || []).map(s => ({...s, bet: s.bet, minTier: s.minTier}));

  const grid = document.getElementById("slotGrid");
  const balanceEl = document.getElementById("balance");
  const tierLabel = document.getElementById("tierLabel");
  const searchEl = document.getElementById("slotSearch");

  function tier() {
    return window.SlotConfig?.getTier ? SlotConfig.getTier() : (window.SlotConfig?.getSessionTier ? SlotConfig.getSessionTier() : "STANDARD");
  }

  function canEnter(slot) {
    return window.SlotConfig?.canAccess ? SlotConfig.canAccess(slot) : true;
  }

  function renderLobby(filterText = "") {
    if (balanceEl && window.VaultEngine) balanceEl.textContent = VaultEngine.getBalance();
    if (tierLabel) tierLabel.textContent = tier();

    const q = (filterText || "").trim().toLowerCase();

    const list = slots.filter(s => !q || s.name.toLowerCase().includes(q));

    grid.innerHTML = list.map(slot => {
      const ok = canEnter(slot);
      const lockedClass = ok ? "" : "locked";
      const tierTag = slot.minTier ? `• ${slot.minTier}` : "";
      return `
        <div class="slot-card ${lockedClass}" data-id="${slot.id}">
          <h2>${slot.name}</h2>
          <span>BET: ${slot.bet} GOLD ${tierTag}</span>
        </div>
      `;
    }).join("");

    // attach clicks
    grid.querySelectorAll(".slot-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        const slot = slots.find(s => s.id === id);
        if (!slot) return;
        if (!canEnter(slot)) return;

        sessionStorage.setItem("activeSlot", id);
        sessionStorage.setItem("entryTime", Date.now().toString());
        if (window.VaultTransition) VaultTransition.markNext();
        window.location.href = `./${id}.html`;
      });
    });
  }

  if (searchEl) {
    searchEl.addEventListener("input", (e) => renderLobby(e.target.value));
  }

  window.returnToVault = function () {
    sessionStorage.removeItem("activeSlot");
    sessionStorage.removeItem("entryTime");
    if (window.VaultRouter) VaultRouter.toLobby();
    else window.location.href = "../../pages/members.html";
  };

  renderLobby();
})();
