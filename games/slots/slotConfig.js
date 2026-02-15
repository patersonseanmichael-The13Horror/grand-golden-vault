/* ======================================================
   SlotConfig — Institutional Controls (Client-side)
   - Tiers: STANDARD, VIP, PRIVATE
   - Access gates: minTier, minBalance
====================================================== */

(function () {
  "use strict";

  const TIER_ORDER = ["STANDARD", "VIP", "PRIVATE"];

  function getSessionTier() {
    const s = window.VaultAuth?.getSession ? VaultAuth.getSession() : null;
    return (s && s.tier) || "STANDARD";
  }

  function tierAtLeast(tier, required) {
    return TIER_ORDER.indexOf(tier) >= TIER_ORDER.indexOf(required);
  }

  window.SlotConfig = {
    getTier: getSessionTier,
    getSessionTier,
    tierAtLeast,
    // Default guard used by lobby and machines
    canAccess(slot) {
      const tier = getSessionTier();
      if (slot.minTier && !tierAtLeast(tier, slot.minTier)) return false;
      if (typeof slot.minBalance === "number" && VaultEngine.getBalance() < slot.minBalance) return false;
      return true;
    }
  };
})();
