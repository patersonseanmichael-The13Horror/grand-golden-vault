/* ======================================================
   Firebase Auth Wrapper (Compat)
   - Email/Password sign-in
   - Optional guest (anonymous) sign-in
   - Tier allowlists (client-side demo)
====================================================== */

(function () {
  "use strict";

  const VIP_ALLOWLIST = [
    // "vip@example.com",
  ];

  const PRIVATE_ALLOWLIST = [
    // "admin@example.com",
  ];

  function getTierForEmail(email) {
    if (!email) return "STANDARD";
    const e = String(email).toLowerCase();
    if (PRIVATE_ALLOWLIST.map(x=>String(x).toLowerCase()).includes(e)) return "PRIVATE";
    if (VIP_ALLOWLIST.map(x=>String(x).toLowerCase()).includes(e)) return "VIP";
    return "STANDARD";
  }

  function requireFirebaseReady() {
    if (!window.GVFirebase || !GVFirebase.ready) {
      throw new Error(GVFirebase && GVFirebase.reason ? GVFirebase.reason : "Firebase not initialized.");
    }
    if (!window.firebase || !firebase.auth) throw new Error("Firebase Auth not available.");
  }

  const GVAuth = {
    async signIn(email, password) {
      requireFirebaseReady();
      const cred = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = cred.user;
      const tier = getTierForEmail(user.email);
      // create local session for app routing + tier display
      if (window.VaultAuth) VaultAuth.createSession(user.uid, tier);
      return { user, tier };
    },

    async signUp(email, password) {
      requireFirebaseReady();
      const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = cred.user;
      const tier = getTierForEmail(user.email);
      if (window.VaultAuth) VaultAuth.createSession(user.uid, tier);
      return { user, tier };
    },

    async signInGuest() {
      requireFirebaseReady();
      const cred = await firebase.auth().signInAnonymously();
      const user = cred.user;
      const tier = "STANDARD";
      if (window.VaultAuth) VaultAuth.createSession(user.uid, tier);
      return { user, tier };
    },

    async signOut() {
      try {
        if (window.firebase && firebase.auth) await firebase.auth().signOut();
      } finally {
        if (window.VaultAuth) VaultAuth.destroy();
      }
    },

    onAuthStateChanged(cb) {
      try {
        if (window.firebase && firebase.auth) {
          return firebase.auth().onAuthStateChanged(cb);
        }
      } catch (_) {}
      return () => {};
    },

    getTier() {
      // prefer session tier
      try {
        const s = VaultAuth.getSession && VaultAuth.getSession();
        return (s && s.tier) ? s.tier : "STANDARD";
      } catch (_) {
        return "STANDARD";
      }
    }
  };

  window.GVAuth = GVAuth;
})();
