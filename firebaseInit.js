/* ======================================================
   Firebase Init (Compat)
====================================================== */

(function () {
  "use strict";

  function hasRealConfig(cfg) {
    if (!cfg) return false;
    const vals = [cfg.apiKey, cfg.authDomain, cfg.projectId, cfg.appId];
    return vals.every(v => v && !String(v).startsWith("PASTE_"));
  }

  window.GVFirebase = window.GVFirebase || { ready: false };

  try {
    if (!window.firebase) return;

    const cfg = window.GV_FIREBASE_CONFIG;
    if (!hasRealConfig(cfg)) {
      window.GVFirebase.ready = false;
      window.GVFirebase.reason = "Firebase config not set.";
      return;
    }

    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(cfg);
    }

    window.GVFirebase.ready = true;
  } catch (e) {
    window.GVFirebase.ready = false;
    window.GVFirebase.reason = e && e.message ? e.message : String(e);
  }
})();
