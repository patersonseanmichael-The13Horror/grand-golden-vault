// --- Load User Data ---
let user = JSON.parse(localStorage.getItem("gv_user")) || {
    id: "GV-" + Math.floor(100000 + Math.random() * 900000),
    name: "Vault Member",
    balance: 0,
    tier: 1,
    ledger: []
};

// --- Update Wallet Display ---
function updateWallet() {
    document.getElementById("walletId").innerText = user.id;
    document.getElementById("walletName").innerText = user.name;
    document.getElementById("walletBalance").innerText = user.balance.toFixed(2) + " GOLD";
    document.getElementById("walletTier").innerText = user.tier;
    updateLedger();
}

// --- Ledger Display ---
const ledgerEl = document.getElementById("ledger");
function updateLedger() {
    ledgerEl.innerHTML = "";
    user.ledger.slice().reverse().forEach(tx => {
        const div = document.createElement("div");
        div.innerHTML = `
            <strong>${tx.type}</strong> | ${tx.amount.toFixed(2)} GOLD | ${tx.time}<br>
            ${tx.description ? 'Desc: ' + tx.description : ''}
        `;
        div.style.marginBottom = "6px";
        div.style.color = "#ffd700";
        ledgerEl.appendChild(div);
    });
}

// --- Deposit Function ---
document.getElementById("depositBtn").onclick = () => {
    const amount = parseFloat(document.getElementById("depositAmount").value);
    const desc = document.getElementById("depositDesc").value || "Deposit";

    if (!amount || amount <= 0) return alert("Enter a valid amount");

    const tx = {
        type: "Deposit",
        amount: amount,
        time: new Date().toLocaleString(),
        description: desc,
    };

    user.balance += amount;
    user.ledger.push(tx);

    // VIP Tier Progress
    if(user.balance >= 10000) user.tier = 5;
    else if(user.balance >= 5000) user.tier = 4;
    else if(user.balance >= 2000) user.tier = 3;
    else if(user.balance >= 1000) user.tier = 2;

    localStorage.setItem("gv_user", JSON.stringify(user));
    updateWallet();

    // Back to Vault Update
    if(localStorage.getItem("gv_lastPage") === "members") {
        const event = new Event("walletUpdated");
        window.dispatchEvent(event);
    }

    document.getElementById("depositAmount").value = "";
    document.getElementById("depositDesc").value = "";
}

// --- Back to Vault ---
document.getElementById("backVaultBtn").onclick = () => {
    localStorage.setItem("gv_lastPage", "members");
    window.location.href = "members.html";
}

// --- Initial Load ---
updateWallet();
