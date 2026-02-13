// GRAND GOLDEN VAULT
// VaultEngine v1.0
// Central Authority Layer

(function () {
  "use strict";

  const STORAGE_KEY = "ggv_state_v1";

  // Private in-memory state
  let state = {
    user: {
      id: null,
      name: "Vault Member"
    },
    transactions: [],
    initialized: false
  };

  // ----------------------------
  // Internal Utilities
  // ----------------------------

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadState() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      state = JSON.parse(existing);
    }
  }

  function generateTxId() {
    return "TX-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
  }

  function validateAmount(amount) {
    return typeof amount === "number" &&
           !isNaN(amount) &&
           isFinite(amount) &&
           amount > 0;
  }

  function calculateBalance() {
    return state.transactions.reduce((acc, tx) => {
      return tx.type === "credit"
        ? acc + tx.amount
        : acc - tx.amount;
    }, 0);
  }

  function recordTransaction(type, amount, source) {
    const tx = {
      id: generateTxId(),
      type,
      amount,
      source,
      timestamp: Date.now()
    };

    state.transactions.push(tx);
    saveState();
    return tx;
  }

  // ----------------------------
  // Public API
  // ----------------------------

  const VaultEngine = {

    init(userId, userName) {
      loadState();

      if (!state.initialized) {
        state.user.id = userId || "GV-" + Math.floor(Math.random() * 1000000);
        state.user.name = userName || "Vault Member";
        state.initialized = true;
        saveState();
      }

      return this.getState();
    },

    getState() {
      return {
        user: state.user,
        balance: calculateBalance(),
        transactions: [...state.transactions]
      };
    },

    getBalance() {
      return calculateBalance();
    },

    credit(amount, source = "system") {
      if (!validateAmount(amount)) {
        throw new Error("Invalid credit amount.");
      }

      return recordTransaction("credit", amount, source);
    },

    debit(amount, source = "system") {
      if (!validateAmount(amount)) {
        throw new Error("Invalid debit amount.");
      }

      const currentBalance = calculateBalance();
      if (amount > currentBalance) {
        throw new Error("Insufficient funds.");
      }

      return recordTransaction("debit", amount, source);
    },

    resetVault() {
      state.transactions = [];
      saveState();
    }
  };

  // Freeze public API to prevent tampering
  Object.freeze(VaultEngine);

  // Expose globally
  window.VaultEngine = VaultEngine;

})();
