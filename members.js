// ================================
// GOLD VAULT - MEMBERS.JS
// ================================


// -------------------------------
// USER INITIALIZATION
// -------------------------------
let user = JSON.parse(localStorage.getItem("gv_user"));

if (!user) {
    user = {
        id: "GV-" + Math.floor(100000 + Math.random() * 900000),
        name: "Vault Member",
        balance: 0,
        tier: 1,
        ledger: []
    };
    localStorage.setItem("gv_user", JSON.stringify(user));
}


// -------------------------------
// SAVE USER
// -------------------------------
function saveUser() {
    localStorage.setItem("gv_user", JSON.stringify(user));
}


// -------------------------------
// WALLET DISPLAY
// -------------------------------
function updateWalletDisplay() {

    const idEl = document.getElementById("vaultId");
    const nameEl = document.getElementById("vaultName");
    const balanceEl = document.getElementById("vaultBalance");
    const tierEl = document.getElementById("vaultTier");
    const depositBtn = document.getElementById("depositBtn");

    if (idEl) idEl.innerText = user.id;
    if (nameEl) nameEl.innerText = user.name;
    if (balanceEl) balanceEl.innerText = user.balance.toFixed(2) + " GOLD";
    if (tierEl) tierEl.innerText = user.tier;

    // Wallet page redirect
    if (depositBtn) {
        depositBtn.onclick = () => {
            window.location.href = "wallet.html";
        };
    }
}

updateWalletDisplay();


// -------------------------------
// LEDGER DISPLAY
// -------------------------------
function updateLedger() {

    const ledgerEl = document.getElementById("ledger");
    if (!ledgerEl) return;

    ledgerEl.innerHTML = "";

    user.ledger.forEach(tx => {

        const div = document.createElement("div");
        div.classList.add("ledger-item");

        div.innerHTML = `
            <strong>${tx.type}</strong> | 
            ${tx.amount.toFixed(2)} GOLD | 
            ${tx.time}
            ${tx.details ? `<br>${tx.details}` : ""}
        `;

        ledgerEl.appendChild(div);
    });
}

updateLedger();


// -------------------------------
// LIVE FEED GENERATORS
// -------------------------------

// Deposit for Live Feed (10–10.99 OR 1500–1599)
function randomDeposit() {
    if (Math.random() < 0.5) {
        return (Math.random() * (10.99 - 10.00) + 10.00);
    } else {
        return (Math.random() * (1599.99 - 1500.00) + 1500.00);
    }
}

// Withdrawal for Live Feed (17288–87443)
function randomWithdrawal() {
    return (Math.random() * (87443.23 - 17288.45) + 17288.45);
}

function randomMaskedPhone() {
    return "04*****" + Math.floor(100 + Math.random() * 900);
}


// -------------------------------
// SLOTS CONTROLLER
// -------------------------------
const slotsSection = document.getElementById("slots-section");

if (slotsSection) {
    slotsSection.style.display = "none";
}

function openSlots() {
    const cards = document.querySelector(".game-cards");

    if (cards) cards.style.display = "none";
    if (slotsSection) {
        slotsSection.style.display = "block";
        slotsSection.scrollIntoView({ behavior: "smooth" });
    }

    if (typeof initSlots === "function") {
        initSlots();
    }
}

function closeSlots() {
    const cards = document.querySelector(".game-cards");

    if (cards) cards.style.display = "grid";
    if (slotsSection) slotsSection.style.display = "none";
}


// -------------------------------
// VIP PROGRESS BAR
// -------------------------------
const vipBar = document.getElementById("vipBar");

if (vipBar) {
    setTimeout(() => {
        vipBar.style.width = "65%";
    }, 800);
}
