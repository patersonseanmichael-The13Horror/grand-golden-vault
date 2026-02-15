/* ======================================================
   VAULT AUTH — PRIVATE SESSION CONTROL
====================================================== */

const VaultAuth = (() => {

  const SESSION_KEY = "GV_SESSION";
  const SESSION_DURATION_MIN = 30;

  function now() {
    return Date.now();
  }

  return {

    createSession(userId = "VAULT_MEMBER", tier = "STANDARD") {
      const session = {
        id: crypto.randomUUID(),
        userId,
        tier,
        issuedAt: now(),
        expiresAt: now() + SESSION_DURATION_MIN * 60 * 1000
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    },

    getSession() {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    },

    isValid() {
      const session = this.getSession();
      return session && session.expiresAt > now();
    },

    enforce() {
      if (!this.isValid()) {
        VaultRouter.toLogin();
      }
    },

    destroy() {
      localStorage.removeItem(SESSION_KEY);
    }

  };

})();

// Expose to window for classic + module interop
window.VaultAuth = VaultAuth;
