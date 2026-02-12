// --- Initialize / Load User ---
let user = JSON.parse(localStorage.getItem("gv_user")) || {
    id: "GV-" + Math.floor(100000 + Math.random() * 900000),
    name: "Vault Member",
    balance: 0,
    tier: 1,
    ledger: []
};

// --- Wallet Display ---
function updateWalletDisplay() {
    document.getElementById("vaultId").innerText = user.id;
    document.getElementById("vaultName").innerText = user.name;
    document.getElementById("vaultBalance").innerText = user.balance + " GOLD";
    document.getElementById("vaultTier").innerText = user.tier;
}
updateWalletDisplay();

// --- Ledger Display ---
const ledgerEl = document.getElementById("ledger");
function updateLedger() {
    ledgerEl.innerHTML = "";
    user.ledger.forEach(tx => {
        const div = document.createElement("div");
        div.textContent = `${tx.type} | ${tx.amount} GOLD | ${tx.time}`;
        div.style.marginBottom = "4px";
        div.style.color = "#ffd700";
        ledgerEl.appendChild(div);
    });
}
updateLedger();

// --- Deposit Function (Pre-filled for M Rainbow) ---
function deposit(amount) {
    const tx = {
        type: "DEPOSIT",
        amount: amount,
        time: new Date().toLocaleString(),
        name: "M Rainbow",
        payId: "0435 750 187",
        reference: "10009888",
        description: "Items Purchased"
    };
    user.balance += amount;
    user.ledger.unshift(tx);

    // Vault Tier Unlock
    if (user.balance >= 500 && user.tier === 1) {
        user.tier = 2;
        alert("🔓 Vault Tier II Unlocked: The Emerald Descent");
    }

    localStorage.setItem("gv_user", JSON.stringify(user));
    updateWalletDisplay();
    updateLedger();
}

// --- Deposit Proof Upload ---
const depositProofSection = document.createElement("div");
depositProofSection.className = "deposit-proof";
depositProofSection.innerHTML = `
    <h3>Upload Proof of Payment</h3>
    <input type="file" id="depositProofInput" accept="image/*"/>
    <button id="submitProofBtn">Submit Proof</button>
`;
document.querySelector(".wallet-section").appendChild(depositProofSection);

document.getElementById("submitProofBtn").onclick = () => {
    const file = document.getElementById("depositProofInput").files[0];
    if (!file) return alert("Please select an image file!");
    alert("✅ Proof uploaded: " + file.name);
};

// --- Live Feed ---
const feedBox = document.getElementById("feedBox");
const actions = ["Deposit", "Withdrawal"];
const amounts = ["$250", "$500", "$1,200", "$5,000", "$12,000"];

function randomPhone() { return "04******" + Math.floor(10 + Math.random() * 89); }

function addFeedItem() {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    const time = new Date().toLocaleTimeString();

    const div = document.createElement("div");
    div.textContent = `${action} | ${amount} | ${randomPhone()} | ${time}`;
    div.style.marginBottom = "6px";
    div.style.color = action === "Deposit" ? "#ffd700" : "#e5c55a";
    div.style.textShadow = "0 0 3px #ffd700";

    feedBox.prepend(div);
    if (feedBox.children.length > 6) feedBox.removeChild(feedBox.lastChild);
}
setInterval(addFeedItem, 3500);

// --- Particles Effect ---
const particlesContainer = document.getElementById("particles");
particlesContainer.innerHTML = "";
for (let i = 0; i < 70; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");
    p.style.left = Math.random() * 100 + "vw";
    p.style.top = Math.random() * 100 + "vh";
    p.style.width = 2 + Math.random() * 6 + "px";
    p.style.height = p.style.width;
    p.style.animationDuration = (4 + Math.random() * 6) + "s";
    p.style.opacity = 0.5 + Math.random() * 0.5;
    particlesContainer.appendChild(p);
}

// --- Vault Doors Animation ---
const doors = document.getElementById("doors");
const vault = document.getElementById("vault");
setTimeout(() => doors.classList.add("open"), 600);
setTimeout(() => vault.classList.add("visible"), 2000);

function exitVault() {
    vault.classList.remove("visible");
    setTimeout(() => doors.classList.remove("open"), 400);
    setTimeout(() => alert("Signing out..."), 2600); // Replace with actual signOut if Firebase
}

function goToGame(url) {
    vault.classList.remove("visible");
    setTimeout(() => doors.classList.remove("open"), 400);
    setTimeout(() => window.location.href = url, 2600);
}

// --- VIP Bar Animation ---
const vipBar = document.getElementById("vipBar");
setTimeout(() => vipBar.style.width = "65%", 800);
