// --- Load or initialize user ---
let user = JSON.parse(localStorage.getItem("gv_user")) || {
  id: "GV-" + Math.floor(100000 + Math.random() * 900000),
  name: "Vault Member",
  balance: 0,
  tier: 1,
  ledger: []
};

// --- Display wallet info ---
function updateWalletDisplay() {
  document.getElementById("vaultId").innerText = user.id;
  document.getElementById("vaultName").innerText = user.name;
  document.getElementById("vaultBalance").innerText = user.balance + " GOLD";
  document.getElementById("vaultTier").innerText = user.tier;
}
updateWalletDisplay();

// --- Ledger display ---
const ledgerEl = document.getElementById("ledger");
function updateLedger() {
  ledgerEl.innerHTML = "";
  user.ledger.forEach(tx => {
    const div = document.createElement("div");
    div.textContent = `${tx.type} | ${tx.amount} GOLD | ${tx.time}`;
    div.style.marginBottom = "4px";
    ledgerEl.appendChild(div);
  });
}
updateLedger();

// --- Deposit function ---
function deposit(amount) {
  const tx = {
    type: "DEPOSIT",
    amount: amount,
    time: new Date().toLocaleString()
  };
  user.balance += amount;
  user.ledger.unshift(tx);

  // --- Vault tier unlock logic ---
  if (user.balance >= 500 && user.tier === 1) {
    user.tier = 2;
    alert("🔓 Vault Tier II Unlocked: The Emerald Descent");
  }

  // --- Save & refresh UI ---
  localStorage.setItem("gv_user", JSON.stringify(user));
  updateWalletDisplay();
  updateLedger();
}
