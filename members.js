import { initSlots } from './slots.js';
import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js';

// --- Initialize / Load User ---
let user = JSON.parse(localStorage.getItem("gv_user")) || {
    id: "GV-" + Math.floor(100000 + Math.random() * 900000),
    name: "Vault Member",
    balance: 0,
    tier: 1,
    ledger: []
};

// --- Reset Ledger ---
user.ledger = [];
localStorage.setItem("gv_user", JSON.stringify(user));

// --- Wallet Display ---
function updateWalletDisplay() {
    document.getElementById("vaultId").innerText = user.id;
    document.getElementById("vaultName").innerText = user.name;
    document.getElementById("vaultBalance").innerText = user.balance.toFixed(2) + " GOLD";
    document.getElementById("vaultTier").innerText = user.tier;
    const topWallet = document.getElementById("topWallet");
    if(topWallet) topWallet.innerText = user.balance.toFixed(2);
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

// --- Live Feed ---
const feedBox = document.getElementById("feedBox");
const maxFeedItems = 12;

function generatePlayerID() {
    const first = String(Math.floor(Math.random() * 90 + 10));
    const last = String(Math.floor(Math.random() * 900 + 100));
    return `${first}*****${last}`;
}

function addLiveFeedEntry() {
    if (!feedBox) return;
    const div = document.createElement("div");
    const amount = Math.floor(Math.random() * 5000 + 50);
    div.textContent = `${generatePlayerID()} just won ${amount} GOLD!`;
    div.style.marginBottom = "4px";
    div.style.color = "#ffd700";
    feedBox.prepend(div);
    while (feedBox.children.length > maxFeedItems) feedBox.removeChild(feedBox.lastChild);
    gsap.from(div, { opacity: 0, y: -10, duration: 0.5 });
}

for (let i = 0; i < 6; i++) addLiveFeedEntry();
setInterval(addLiveFeedEntry, 5000);

// --- Vault Doors & Navigation ---
const vault = document.getElementById('vault');
const doors = document.getElementById('doors');

function goToGame(url) {
    if (vault) vault.classList.remove('visible');
    if (doors) doors.classList.remove('open');
    setTimeout(() => window.location.href = url, 600);
}

// --- Deposit Button ---
const depositBtn = document.getElementById("depositBtn");
if (depositBtn) depositBtn.onclick = () => window.location.href = "wallet.html";

// --- Game Cards ---
document.querySelectorAll('.game-cards .card').forEach(card => {
    const text = card.textContent.trim().toLowerCase();
    if (text.includes('blackjack')) card.onclick = () => goToGame('blackjack.html');
    if (text.includes('roulette')) card.onclick = () => goToGame('roulette.html');
    if (text.includes('poker')) card.onclick = () => goToGame('poker.html');
    if (text.includes('slots')) card.onclick = () => openSlots();
});

// --- Slots Section ---
function openSlots() {
    const gameCards = document.querySelector('.game-cards');
    const slotsSection = document.getElementById('slots-section');
    if (gameCards) gameCards.style.display = 'none';
    if (slotsSection) {
        slotsSection.style.display = 'block';
        slotsSection.scrollIntoView({ behavior: 'smooth' });
        initSlots();
    }
}

function closeSlots() {
    const gameCards = document.querySelector('.game-cards');
    const slotsSection = document.getElementById('slots-section');
    if (slotsSection) slotsSection.style.display = 'none';
    if (gameCards) gameCards.style.display = 'grid';
}

document.getElementById('closeSlotsBtn').onclick = closeSlots;

// --- VIP Bar Animation ---
const vipBar = document.getElementById("vipBar");
if (vipBar) setTimeout(() => vipBar.style.width = '65%', 800);

// --- Exit Vault ---
document.getElementById('exitVaultBtn').onclick = () => {
    vault.classList.remove('visible');
    setTimeout(() => doors.classList.remove('open'), 400);
    setTimeout(() => window.location.href = "login.html", 2600);
};

// --- Particles ---
const particlesContainer = document.getElementById('particles');
particlesContainer.innerHTML='';
for(let i=0;i<70;i++){
  const p=document.createElement('div');
  p.classList.add('particle');
  p.style.left=Math.random()*100+'vw';
  p.style.top=Math.random()*100+'vh';
  p.style.width=2+Math.random()*6+'px';
  p.style.height=p.style.width;
  p.style.animationDuration=(4+Math.random()*6)+'s';
  p.style.opacity=0.5+Math.random()*0.5;
  particlesContainer.appendChild(p);
}

window.addEventListener("walletUpdated", () => {
    let updatedUser = JSON.parse(localStorage.getItem("gv_user"));
    if (updatedUser) {
        user = updatedUser;
        updateWalletDisplay();
        updateLedger();
    }
});
