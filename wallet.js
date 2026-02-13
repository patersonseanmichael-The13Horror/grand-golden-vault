// GRAND GOLDEN VAULT
// Wallet UI Controller
// Uses VaultEngine as authority

(function () {
  "use strict";

  // ----------------------------
  // DOM CACHE
  // ----------------------------

  const walletIdEl = document.getElementById("walletId");
  const walletNameEl = document.getElementById("walletName");
  const walletBalanceEl = document.getElementById("walletBalance");
  const walletTierEl = document.getElementById("walletTier");
  const ledgerEl = document.getElementById("ledger");

  const depositBtn = document.getElementById("depositBtn");
  const depositAmountEl = document.getElementById("depositAmount");
  const depositDescEl = document.getElementById("depositDesc");
  const backVaultBtn = document.getElementById("backVaultBtn");

  // ----------------------------
  // INIT ENGINE
  // ----------------------------

  const state = VaultEngine.init();

  // ----------------------------
  // TIER CALCULATION
  // ----------------------------

  function calculateTier(balance) {
    if (balance >= 10000) return 5;
    if (balance >= 5000) return 4;
    if (balance >= 2000) return 3;
    if (balance >= 1000) return 2;
    return 1;
  }

  // ----------------------------
  // UI RENDER
  // ----------------------------

  function renderWallet() {
    const vaultState = VaultEngine.getState();
    const balance = vaultState.balance;
    const tier = calculateTier(balance);

    walletIdEl.innerText = vaultState.user.id;
    walletNameEl.innerText = vaultState.user.name;
    walletBalanceEl.innerText = balance.toFixed(2) + " GOLD";
    walletTierEl.innerText = tier;

    renderLedger(vaultState.transactions);
  }

  function renderLedger(transactions) {
    ledgerEl.innerHTML = "";

    [...transactions].reverse().forEach(tx => {
      const div = document.createElement("div");

      const formattedTime = new Date(tx.timestamp).toLocaleString();

      div.innerHTML = `
        <strong>${tx.type.toUpperCase()}</strong> |
        ${tx.amount.toFixed(2)} GOLD |
        ${formattedTime}<br>
        Source: ${tx.source}
      `;

      div.style.marginBottom = "6px";
      div.style.color = "#ffd700";

      ledgerEl.appendChild(div);
    });
  }

  // ----------------------------
  // DEPOSIT HANDLER
  // ----------------------------

  depositBtn.addEventListener("click", () => {
    const amount = parseFloat(depositAmountEl.value);
    const description = depositDescEl.value || "Deposit";

    if (!amount || amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    try {
      VaultEngine.credit(amount, description);
      renderWallet();
    } catch (err) {
      alert(err.message);
    }

    depositAmountEl.value = "";
    depositDescEl.value = "";
  });

  // ----------------------------
  // NAVIGATION
  // ----------------------------

  backVaultBtn.addEventListener("click", () => {
    window.location.href = "members.html";
  });

  // ----------------------------
  // INITIAL RENDER
  // ----------------------------

  renderWallet();

})();
