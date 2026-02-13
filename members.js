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
    document.getElementById("vaultBalance").innerText = user.balance.toFixed(2) + " GOLD";
    document.getElementById("vaultTier").innerText = user.tier;
}
updateWalletDisplay();

// --- Ledger Display ---
const ledgerEl = document.getElementById("ledger");
function updateLedger() {
    ledgerEl.innerHTML = "";
    user.ledger.forEach(tx => {
        const div = document.createElement("div");
        div.innerHTML = `
            <strong>${tx.type}</strong> | ${tx.amount.toFixed(2)} GOLD | ${tx.time}
            ${tx.name ? `<br>Name: ${tx.name} | PayID: ${tx.payId} | Ref: ${tx.reference} | Desc: ${tx.description}` : ""}
        `;
        div.style.marginBottom = "6px";
        div.style.color = "#ffd700";
        ledgerEl.appendChild(div);
    });
}
updateLedger();

function randomDeposit() {
    // Either small $10.00–$10.99 OR high $1500–$1599
    if (Math.random() < 0.5) {
        return (Math.random() * (10.99 - 10.00) + 10.00).toFixed(2);
    } else {
        return (Math.random() * (1599.99 - 1500.00) + 1500.00).toFixed(2);
    }
}

function randomWithdrawal() {
    return (Math.random() * (87443.23 - 17288.45) + 17288.45).toFixed(2);
}

function randomPhone() {
    return "04*****" + Math.floor(100 + Math.random() * 900);
}

// --- PayID Proof Upload ---
document.getElementById("submitProofBtn").onclick = () => {
    const file = document.getElementById("proofUpload").files[0];
    if(!file) return alert("Please select a screenshot!");
    document.getElementById("proofMessage").innerText = `✅ Proof uploaded: ${file.name}`;
    // TODO: Integrate Firebase Storage upload
};

// --- Vault Tier / Slots Handlers ---
const slotsSection = document.getElementById("slots-section");
if(slotsSection) slotsSection.style.display = "none";
function openSlots() {
    document.querySelector(".game-cards").style.display='none';
    slotsSection.style.display='block';
    slotsSection.scrollIntoView({behavior:'smooth'});
    if(typeof initSlots==='function') initSlots();
}
function closeSlots() {
    slotsSection.style.display='none';
    document.querySelector(".game-cards").style.display='grid';
}

// --- VIP Bar Animation ---
const vipBar = document.getElementById("vipBar");
setTimeout(()=>vipBar.style.width='65%',800);
