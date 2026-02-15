/* ======================================================
   VAULT ENGINE — INSTITUTIONAL AUTHORITY
   Single Source of Truth (Wallet + Ledger)
====================================================== */

const VaultEngine = (() => {

  const STORAGE_KEY = "GV_VAULT_STATE";

  const defaultState = {
    balance: 0,
    ledger: [],
    currency: "GOLD",
    lastUpdated: null
  };

  function loadState() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(defaultState);
  }

  function saveState(state) {
    state.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function log(type, amount, source) {
    return {
      id: crypto.randomUUID(),
      type,
      amount,
      source,
      timestamp: new Date().toISOString()
    };
  }

  return Object.freeze({

    getBalance() {
      return loadState().balance;
    },

    getLedger() {
      return loadState().ledger.slice().reverse();
    },

    deposit(amount, source = "MANUAL") {
      if (amount <= 0) throw new Error("Invalid deposit amount");

      const state = loadState();
      state.balance += amount;
      state.ledger.push(log("DEPOSIT", amount, source));
      saveState(state);
    },

    withdraw(amount, source = "MANUAL") {
      const state = loadState();
      if (amount <= 0) throw new Error("Invalid withdrawal amount");
      if (state.balance < amount) throw new Error("Insufficient funds");

      state.balance -= amount;
      state.ledger.push(log("WITHDRAW", amount, source));
      saveState(state);
    },

    resetVault() {
      saveState(structuredClone(defaultState));
    }

  });

})();

// Expose to window for classic + module interop
window.VaultEngine = VaultEngine;
