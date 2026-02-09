// --- Initialize / Load user ---
let user = JSON.parse(localStorage.getItem("gv_user")) || {
  id: "GV-" + Math.floor(100000 + Math.random() * 900000),
  name: "Vault Member",
  balance: 0,
  tier: 1,
  ledger: []
};

// --- Wallet display ---
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

  // Vault tier unlock
  if (user.balance >= 500 && user.tier === 1) {
    user.tier = 2;
    alert("🔓 Vault Tier II Unlocked: The Emerald Descent");
  }

  localStorage.setItem("gv_user", JSON.stringify(user));
  updateWalletDisplay();
  updateLedger();
}

// --- Fake live feed ---
const feedBox = document.getElementById("feedBox");
const actions = ["Deposit", "Withdrawal"];
const amounts = ["$250", "$500", "$1,200", "$5,000", "$12,000"];

function randomPhone() {
  return "04******" + Math.floor(10 + Math.random() * 89);
}

function addFeedItem() {
  const action = actions[Math.floor(Math.random() * actions.length)];
  const amount = amounts[Math.floor(Math.random() * amounts.length)];
  const time = new Date().toLocaleTimeString();

  const div = document.createElement("div");
  div.textContent = `${action} | ${amount} | ${randomPhone()} | ${time}`;
  div.style.marginBottom = "6px";
  div.style.color = action === "Deposit" ? "#d4af37" : "#e5c55a";

  feedBox.prepend(div);
  if (feedBox.children.length > 6) feedBox.removeChild(feedBox.lastChild);
}
setInterval(addFeedItem, 3500);
