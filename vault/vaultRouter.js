/* ======================================================
   VAULT ROUTER — SINGLE NAVIGATION AUTHORITY
====================================================== */

const VaultRouter = (() => {

  const ROUTES = Object.freeze({
    LOGIN: "/pages/login.html",
    LOBBY: "/pages/lobby.html"
  });

  function go(path) {
    window.location.replace(path);
  }

  return Object.freeze({

    toLogin() {
      go(ROUTES.LOGIN);
    },

    toLobby() {
      go(ROUTES.LOBBY);
    },

    logout() {
      VaultAuth.destroy();
      go(ROUTES.LOGIN);
    }

  });

})();
