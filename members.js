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
  const vaultId = document.getElementById("vaultId");
  const vaultName = document.getElementById("vaultName");
  const vaultBalance = document.getElementById("vaultBalance");
  const vaultTier = document.getElementById("vaultTier");
  if(vaultId) vaultId.innerText = user.id;
  if(vaultName) vaultName.innerText = user.name;
  if(vaultBalance) vaultBalance.innerText = user.balance + " GOLD";
  if(vaultTier) vaultTier.innerText = user.tier;
}
updateWalletDisplay();

// --- Ledger display ---
const ledgerEl = document.getElementById("ledger");
function updateLedger() {
  if(!ledgerEl) return;
  ledgerEl.innerHTML = "";
  user.ledger.forEach(tx => {
    const div = document.createElement("div");
    div.textContent = `${tx.type} | ${tx.amount} GOLD | ${tx.time} | ${tx.name || ""} | ${tx.payId || ""} | ${tx.reference || ""} | ${tx.description || ""}`;
    div.style.marginBottom = "4px";
    ledgerEl.appendChild(div);
  });
}
updateLedger();

// --- Deposit function ---
function deposit() {
  const tx = {
    type: "DEPOSIT",
    amount: 250, // default amount for demo
    time: new Date().toLocaleString(),
    name: "M Rainbow",
    payId: "0435 750 187",
    reference: "10009888",
    description: "Items Purchased"
  };
  user.balance += tx.amount;
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

// --- Add Deposit Button dynamically ---
const vaultEl = document.querySelector(".vault");
if(vaultEl){
  const depositBtn = document.createElement("button");
  depositBtn.innerText = "Deposit GOLD";
  depositBtn.classList.add("exit-slots-btn");
  depositBtn.onclick = deposit;
  vaultEl.insertBefore(depositBtn, vaultEl.querySelector(".vip-section"));
}

// --- Fake live feed ---
const feedBox = document.getElementById("feedBox");
const actions = ["Deposit", "Withdrawal"];
const amounts = ["$250", "$500", "$1,200", "$5,000", "$12,000"];

function randomPhone() {
  return "04******" + Math.floor(10 + Math.random() * 89);
}

function addFeedItem() {
  if(!feedBox) return;
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

// --- VIP BAR animation update ---
const vipBar = document.getElementById('vipBar');
function updateVIP(){
  if(!vipBar) return;
  let progress = Math.min(user.balance / 1000 * 100, 100); // arbitrary max at 1000 GOLD
  vipBar.style.width = progress + '%';
}
updateVIP();
