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

// --- Deposit / Withdrawal Live Feed ---
document.getElementById("depositBtn").onclick = () => {
    window.location.href = "wallet.html";
};

function randomDeposit() {
    const cents = (Math.random() * 0.99).toFixed(2);
    const amount = Math.random() < 0.5
        ? (Math.random() * (10.99 - 10.01) + 10.01).toFixed(2)  
        : (Math.random() * (1599 - 1501) + 1501).toFixed(2);    
    return parseFloat(amount) + parseFloat(cents);
}

function randomWithdrawal() {
    return (Math.random() * (87443.23 - 17288.45) + 17288.45).toFixed(2);
}

function randomPhone() { 
    return "04******" + Math.floor(10 + Math.random() * 90); 
}

function addFeedItem() {
    const type = Math.random() < 0.5 ? "DEPOSIT" : "WITHDRAWAL";
    const amount = type === "DEPOSIT" ? randomDeposit() : randomWithdrawal();
    const time = new Date().toLocaleTimeString();

    const div = document.createElement("div");
    div.textContent = `${type} | $${amount} | ${randomPhone()} | ${time}`;
    div.style.marginBottom = "6px";
    div.style.color = type === "DEPOSIT" ? "#ffd700" : "#e5c55a";
    div.style.textShadow = "0 0 3px #ffd700";

    feedBox.prepend(div);
    if(feedBox.children.length>6) feedBox.removeChild(feedBox.lastChild);
}
setInterval(addFeedItem, 3500);

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
