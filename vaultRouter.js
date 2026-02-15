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
    MEMBERS: new URL("../pages/members.html", BASE).toString(),
    TERMS: new URL("../pages/terms.html", BASE).toString(),

    LOBBY: new URL("../pages/lobby.html", BASE).toString(),

    BLACKJACK: new URL("../pages/blackjack.html", BASE).toString(),
    ROULETTE: new URL("../pages/roulette.html", BASE).toString(),
    POKER: new URL("../pages/poker.html", BASE).toString(),

    SLOTS_LOBBY: new URL("../games/slots/slotsLobby.html", BASE).toString(),
  });

  function go(url) {
    window.location.replace(url);
  }

  function enforceIfNeeded(){
    if (window.VaultAuth && typeof VaultAuth.enforce === "function") {
      VaultAuth.enforce();
    }
  }

  return Object.freeze({
    routes: ROUTES,

    toLogin() { go(ROUTES.LOGIN); },
    toMembers(){ enforceIfNeeded(); go(ROUTES.MEMBERS); },
    toTerms(){ go(ROUTES.TERMS); },
    toLobby() { enforceIfNeeded(); go(ROUTES.LOBBY); },

    toGame(game) {
      enforceIfNeeded();

      if (game === "BLACKJACK") return go(ROUTES.BLACKJACK);
      if (game === "ROULETTE") return go(ROUTES.ROULETTE);
      if (game === "POKER") return go(ROUTES.POKER);
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

window.VaultRouter = VaultRouter;
