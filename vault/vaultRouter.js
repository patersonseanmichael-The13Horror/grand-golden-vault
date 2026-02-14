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

     /* ======================================================
   VAULT ROUTER — PHASE C (BLACKJACK ENABLED)
====================================================== */

const VaultRouter = (() => {

  const ROUTES = Object.freeze({
    LOGIN: "/pages/login.html",
    LOBBY: "/pages/lobby.html",

    BLACKJACK: "/pages/blackjack.html",

    // Still locked
    ROULETTE: "/pages/roulette.html",
    SLOTS: "/pages/slots.html",
    POKER: "/pages/poker.html"
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

    toBlackjack() {
      VaultAuth.enforce();
      go(ROUTES.BLACKJACK);
    },

    toGame(game) {
      if (game === "BLACKJACK") return this.toBlackjack();
      alert("This game is currently unavailable.");
    },

    logout() {
      VaultAuth.destroy();
      go(ROUTES.LOGIN);
    }

  });

})();

    logout() {
      VaultAuth.destroy();
      go(ROUTES.LOGIN);
    }

  });

})();

/* ======================================================
   VAULT ROUTER — PHASE B EXTENSION
====================================================== */

const VaultRouter = (() => {

  const ROUTES = Object.freeze({
    LOGIN: "/pages/login.html",
    LOBBY: "/pages/lobby.html",

    // Future (locked)
    BLACKJACK: "/pages/blackjack.html",
    ROULETTE: "/pages/roulette.html",
    SLOTS: "/pages/slots.html",
    POKER: "/pages/poker.html"
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

    toGame(game) {
      // Phase B lock — no game access yet
      alert("This game is currently unavailable.");
    },

    logout() {
      VaultAuth.destroy();
      go(ROUTES.LOGIN);
    }

  });

})();

/* ======================================================
   VAULT ROUTER — PHASE C (BLACKJACK + ROULETTE)
====================================================== */

const VaultRouter = (() => {

  const ROUTES = Object.freeze({
    LOGIN: "/pages/login.html",
    LOBBY: "/pages/lobby.html",

    BLACKJACK: "/pages/blackjack.html",
    ROULETTE: "/pages/roulette.html",

    // Still locked
    SLOTS: "/pages/slots.html",
    POKER: "/pages/poker.html"
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

    toGame(game) {
      VaultAuth.enforce();

      if (game === "BLACKJACK") return go(ROUTES.BLACKJACK);
      if (game === "ROULETTE") return go(ROUTES.ROULETTE);

      alert("This game is currently unavailable.");
    },

    logout() {
      VaultAuth.destroy();
      go(ROUTES.LOGIN);
    }

  });

})();
