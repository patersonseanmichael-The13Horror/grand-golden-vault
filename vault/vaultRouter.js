/* ======================================================
   VAULT ROUTER — SINGLE NAVIGATION AUTHORITY
   - Works on GitHub Pages (repo sub-path) and local
   - Resolves routes relative to this script location
====================================================== */

const VaultRouter = (() => {
  "use strict";

  // Resolve URLs relative to /vault/vaultRouter.js
  const BASE = (() => {
    const src = (document.currentScript && document.currentScript.src) || "";
    return src ? new URL(".", src) : new URL("./vault/", window.location.href);
  })();

  const ROUTES = Object.freeze({
    LOGIN: new URL("../pages/login.html", BASE).toString(),
    LOBBY: new URL("../pages/lobby.html", BASE).toString(),
    BLACKJACK: new URL("../pages/blackjack.html", BASE).toString(),
    ROULETTE: new URL("../pages/roulette.html", BASE).toString(),
    SLOTS_LOBBY: new URL("../games/slots/slotsLobby.html", BASE).toString(),
  });

  function go(url) {
    window.location.replace(url);
  }

  return Object.freeze({
    toLogin() {
      go(ROUTES.LOGIN);
    },

    toLobby() {
      go(ROUTES.LOBBY);
    },

    toGame(game) {
      // Require session for all protected routes
      if (window.VaultAuth && typeof VaultAuth.enforce === "function") {
        VaultAuth.enforce();
      }

      if (game === "BLACKJACK") return go(ROUTES.BLACKJACK);
      if (game === "ROULETTE") return go(ROUTES.ROULETTE);
      if (game === "SLOTS") return go(ROUTES.SLOTS_LOBBY);

      alert("This game is currently unavailable.");
    },

    logout() {
      if (window.VaultAuth && typeof VaultAuth.destroy === "function") {
        VaultAuth.destroy();
      }
      go(ROUTES.LOGIN);
    },
  });
})();

// Expose to window for classic + module interop
window.VaultRouter = VaultRouter;
