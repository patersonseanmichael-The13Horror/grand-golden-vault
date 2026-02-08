const activities = [
  "04******92 deposited $8,500 · Baccarat",
  "04******17 withdrew $12,000 · Roulette",
  "04******45 deposited $3,200 · Blackjack",
  "04******61 deposited $15,750 · Private Table",
  "04******08 withdrew $6,400 · Baccarat",
  "04******39 deposited $21,000 · High Roller Room",
  "04******74 deposited $4,950 · Roulette",
  "04******56 withdrew $9,300 · Blackjack"
];

const feed = document.getElementById("liveFeed");
const text = feed.querySelector(".feed-text");

let index = 0;

function updateFeed() {
  text.style.opacity = 0;

  setTimeout(() => {
    text.textContent = activities[index];
    text.style.opacity = 1;
    index = (index + 1) % activities.length;
  }, 600);
}

// -----------------------------
// MEMBERS VAULT FAKE TRANSACTIONS FEED
// -----------------------------
const memberFeed = document.getElementById("memberFeed");
const feedText = memberFeed.querySelector(".feed-text");

function generateTransaction() {
  const phone = `04******${Math.floor(Math.random()*90+10)}`; // AU-style masked
  const isDeposit = Math.random() > 0.5;

  let amount;
  let action;

  if (isDeposit) {
    amount = (Math.random() * (1000 - 10) + 10).toFixed(2); // $10-$1000
    action = `deposited $${amount}`;
  } else {
    amount = (Math.random() * (50000 - 500) + 500).toFixed(2); // $500-$50,000
    action = `withdrew $${amount}`;
  }

  const games = ["Baccarat", "Roulette", "Blackjack", "Private Table"];
  const game = games[Math.floor(Math.random()*games.length)];

  return `${phone} ${action} · ${game}`;
}

// Only show feed when vault unlocked
function updateMemberFeed() {
  if(vaultContent.style.display === "block") {
    const transaction = generateTransaction();

    feedText.style.opacity = 0;

    setTimeout(() => {
      feedText.textContent = transaction;
      feedText.style.opacity = 1;

      // Check for high withdrawals (> $10,000)
      if(transaction.includes("withdrew")) {
        // Extract amount
        const amountMatch = transaction.match(/\$([\d,\.]+)/);
        if(amountMatch){
          const amountNum = parseFloat(amountMatch[1].replace(/,/g,''));
          if(amountNum > 10000){
            feedText.classList.add("gold-shimmer");
            setTimeout(() => {
              feedText.classList.remove("gold-shimmer");
            }, 3000); // shimmer lasts 3 seconds
          }
        }
      }
    }, 600);
  }
}

// Update every 5 minutes (300000ms)
setInterval(updateMemberFeed, 300000);

// First run after unlock
unlockBtn.addEventListener("click", () => {
  if(vaultPassword.value === vaultKey){
    updateMemberFeed(); // Initial transaction when unlocked
  }
});

setInterval(updateFeed, 7500);
updateFeed();
