// --- Initialize / Load User ---
let user = JSON.parse(localStorage.getItem("gv_user")) || {
    id: "GV-" + Math.floor(100000 + Math.random() * 900000),
    name: "Vault Member",
    balance: 0,
    tier: 1,
    ledger: []
};

// --- Reset Ledger to Nil ---
user.ledger = [];
localStorage.setItem("gv_user", JSON.stringify(user));

// --- Wallet Display ---
function updateWalletDisplay() {
    const depositBtn = document.getElementById("depositBtn");
    if (depositBtn) depositBtn.onclick = () => {
        window.location.href = "wallet.html";
    };

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

// --- Live Feed (Scrolling Casino Wins) ---
const feedBox = document.getElementById("feedBox");
const maxFeedItems = 12; // max number of lines to show

function addLiveFeedEntry() {
    if (!feedBox) return;

    // Randomized winner info
    const phone = "04*****" + Math.floor(100 + Math.random() * 900);
    const amount = Math.floor(Math.random() * 5000) + 50;
    const div = document.createElement("div");
    div.textContent = `${phone} just won ${amount} GOLD!`;
    div.style.marginBottom = "4px";
    div.style.color = "#ffd700";

    // Add to top of feed
    feedBox.prepend(div);

    // Keep feed length limited
    while (feedBox.children.length > maxFeedItems) {
        feedBox.removeChild(feedBox.lastChild);
    }

    // Animate scrolling (optional smooth slide)
    gsap.from(div, { opacity: 0, y: -10, duration: 0.5 });
}

// Initialize with a few entries
for (let i = 0; i < 6; i++) addLiveFeedEntry();

// Add a new entry every 5 seconds
setInterval(addLiveFeedEntry, 5000);

// --- Game Buttons ---
function goToGame(url) {
    const vault = document.getElementById('vault');
    const doors = document.getElementById('doors');
    if (vault) vault.classList.remove('visible');
    if (doors) doors.classList.remove('open');
    setTimeout(() => window.location.href = url, 600); // short delay for animation
}

document.querySelectorAll('.card').forEach(card => {
    const text = card.textContent.trim().toLowerCase();
    if (text.includes('blackjack')) card.onclick = () => goToGame('blackjack.html');
    if (text.includes('roulette')) card.onclick = () => goToGame('roulette.html');
    if (text.includes('poker')) card.onclick = () => goToGame('poker.html');
    if (text.includes('slots')) card.onclick = () => {
        document.querySelector('.game-cards').style.display='none';
        const slotsSection = document.getElementById('slots-section');
        if (slotsSection) slotsSection.style.display='block';
        if (typeof initSlots === 'function') initSlots();
    };
});

// --- VIP Bar Animation ---
const vipBar = document.getElementById("vipBar");
if (vipBar) setTimeout(() => vipBar.style.width = '65%', 800);

// --- Deposit Button ---
const depositBtn = document.getElementById("depositBtn");
if (depositBtn) depositBtn.onclick = () => {
    // Redirect to wallet
    window.location.href = "wallet.html";
};

function goToGame(url){
    vault.classList.remove('visible');
    setTimeout(() => doors.classList.remove('open'), 400);
    setTimeout(() => window.location.href = url, 2600);
}

// Assign cards
document.querySelectorAll('.game-cards .card').forEach(card => {
    const gameText = card.textContent.trim().toLowerCase();
    if(gameText.includes('blackjack')) card.onclick = () => goToGame('blackjack.html');
    if(gameText.includes('roulette')) card.onclick = () => goToGame('roulette.html');
    if(gameText.includes('poker')) card.onclick = () => goToGame('poker.html');
    if(gameText.includes('platinum slots')) card.onclick = () => openSlots();
});
