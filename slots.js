// ---------------------------
// Golden Vault Slots JS
// ---------------------------

const reels = document.querySelectorAll(".reel");
const spinBtn = document.getElementById("spinBtn");
const resultText = document.getElementById("resultText");
const balanceEl = document.getElementById("balance");
let balance = 5000; // Example starting balance
balanceEl.innerText = `GOLD: ${balance}`;

// Symbols for the reels
const symbols = ["🍒", "💎", "7️⃣", "🔔", "💰", "⭐", "🪙"];
const reelCount = reels.length;

// Spin function
function spinSlots() {
    if (balance <= 0) {
        resultText.innerText = "Not enough GOLD!";
        return;
    }

    balance -= 50; // Bet amount
    balanceEl.innerText = `GOLD: ${balance}`;

    resultText.innerText = "Spinning...";

    let finalSymbols = [];

    // Spin each reel
    reels.forEach((reel, i) => {
        let spinTimes = 20 + Math.floor(Math.random() * 20);
        let index = 0;

        let spinInterval = setInterval(() => {
            reel.innerText = symbols[index % symbols.length];
            index++;
            spinTimes--;
            if (spinTimes <= 0) {
                clearInterval(spinInterval);
                finalSymbols[i] = symbols[(index - 1) % symbols.length];

                // Check if all reels finished
                if (finalSymbols.filter(s => s === undefined).length === 0) {
                    checkWin(finalSymbols);
                }
            }
        }, 80 + i * 20); // Slight delay per reel for luxury staggered spin
    });
}

// Check winning combinations
function checkWin(finalSymbols) {
    // Simple: all three symbols match = big win
    const [a, b, c] = finalSymbols;
    let winAmount = 0;

    if (a === b && b === c) {
        winAmount = 1000;
        resultText.innerText = `JACKPOT! ${finalSymbols.join(" ")} — You won ${winAmount} GOLD!`;
    } else if (a === b || b === c || a === c) {
        winAmount = 200;
        resultText.innerText = `Nice! ${finalSymbols.join(" ")} — You won ${winAmount} GOLD!`;
    } else {
        resultText.innerText = `No luck this time: ${finalSymbols.join(" ")}`;
    }

    balance += winAmount;
    balanceEl.innerText = `GOLD: ${balance}`;

    // Optional: VIP sparkle effect if win is big
    if(winAmount >= 1000){
        showVIPAnimation(1); // or tie to tier system
    }
}

// Optional: VIP glow animation (reuse from wallet.js)
function showVIPAnimation(tier){
    const badge = document.createElement("div");
    badge.className = "vip-badge";
    badge.innerText = `Big Win! VIP Tier ${tier}`;
    badge.style.position = "fixed";
    badge.style.top = "25%";
    badge.style.left = "50%";
    badge.style.transform = "translateX(-50%) scale(0)";
    badge.style.zIndex = 1000;
    badge.style.fontSize = "2rem";
    document.body.appendChild(badge);

    badge.animate([
        { transform: "translateX(-50%) scale(0)", opacity: 0 },
        { transform: "translateX(-50%) scale(1.2)", opacity: 1 },
        { transform: "translateX(-50%) scale(1)", opacity: 1 },
        { transform: "translateX(-50%) scale(1)", opacity: 0 }
    ], { duration: 2500, easing: "ease-out", fill: "forwards" });

    setTimeout(() => badge.remove(), 2500);
}

// Spin button listener
spinBtn.addEventListener("click", spinSlots);
