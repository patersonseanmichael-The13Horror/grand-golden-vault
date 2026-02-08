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

      // Reset classes
      feedText.classList.remove("gold-shimmer", "vip-spark");

      const amountMatch = transaction.match(/\$([\d,\.]+)/);
      if(amountMatch){
        const amountNum = parseFloat(amountMatch[1].replace(/,/g,''));

        // High withdrawals shimmer (> $10,000)
        if(transaction.includes("withdrew") && amountNum > 10000){
          feedText.classList.add("gold-shimmer");
        }

        // VIP transactions (ultra withdrawals/deposits)
        if(amountNum >= 25000){
          feedText.classList.add("vip-spark");
          playChime(); // subtle sound
        }

        // VIP deposits highlight ($800+)
        if(transaction.includes("deposited") && amountNum >= 800){
          feedText.classList.add("gold-shimmer");
        }
      }

    }, 600);
  }
}

// -----------------------------
// SOUND EFFECT
// -----------------------------
function playChime(){
  const audio = new Audio('https://freesound.org/data/previews/66/66717_634166-lq.mp3');
  audio.volume = 0.15;
  audio.play();
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

<script>
// GOLD DUST PARTICLES
const loginSection = document.querySelector('.login-section');

for(let i=0; i<40; i++){
  const particle = document.createElement('div');
  particle.classList.add('particle');
  particle.style.left = Math.random()*100 + 'vw';
  particle.style.animationDuration = (Math.random()*8 + 5) + 's';
  particle.style.width = particle.style.height = (Math.random()*3 + 2) + 'px';
  loginSection.appendChild(particle);
}

// VAULT DOOR ANIMATION
const leftDoor = document.querySelector('.vault-door-left');
const rightDoor = document.querySelector('.vault-door-right');
const loginContainer = document.querySelector('.login-container');

window.addEventListener('load', () => {
  // Open doors
  leftDoor.classList.add('open');
  rightDoor.classList.add('open');

  // Fade in boxes after doors start opening
  setTimeout(() => {
    loginContainer.classList.add('visible');
  }, 1200); // adjust delay for cinematic timing

  // Remove doors after animation
  setTimeout(() => {
    leftDoor.style.display = 'none';
    rightDoor.style.display = 'none';
  }, 2200);
});
</script>
