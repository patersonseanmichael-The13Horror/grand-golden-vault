/* =========================================
   LOGIN / SIGN-UP
========================================= */
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");
const loginName = document.getElementById("loginName");
const loginPassword = document.getElementById("loginPassword");

const signBtn = document.getElementById("signBtn");
const signMsg = document.getElementById("signMsg");
const signName = document.getElementById("signName");
const signEmail = document.getElementById("signEmail");
const signPassword = document.getElementById("signPassword");

const demoVaultKey = "GOLDENVAULT";

if(loginBtn){
  loginBtn.addEventListener("click", () => {
    if(loginPassword.value === demoVaultKey && loginName.value !== ""){
      loginMsg.style.color = "#d4af37";
      loginMsg.textContent = "Login successful! Redirecting...";
      setTimeout(() => { window.location.href = "members.html"; }, 1200);
    } else {
      loginMsg.style.color = "red";
      loginMsg.textContent = "Invalid credentials";
    }
  });
}

if(signBtn){
  signBtn.addEventListener("click", () => {
    if(signName.value && signEmail.value && signPassword.value){
      signMsg.style.color = "#d4af37";
      signMsg.textContent = "Registration successful! Redirecting...";
      setTimeout(() => { window.location.href = "members.html"; }, 1200);
    } else {
      signMsg.style.color = "red";
      signMsg.textContent = "Please fill all fields";
    }
  });
}

/* =========================================
   CINEMATIC VAULT DOORS + GOLD DUST
========================================= */
const leftDoor = document.querySelector('.vault-door-left');
const rightDoor = document.querySelector('.vault-door-right');
const loginContainer = document.querySelector('.login-container');
const loginSection = document.querySelector('.login-section');

if(loginSection){
  // Create gold particles
  for(let i=0; i<40; i++){
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random()*100 + 'vw';
    particle.style.animationDuration = (Math.random()*8 + 5) + 's';
    particle.style.width = particle.style.height = (Math.random()*3 + 2) + 'px';
    loginSection.appendChild(particle);
  }

  window.addEventListener('load', () => {
    if(leftDoor && rightDoor && loginContainer){
      leftDoor.classList.add('open');
      rightDoor.classList.add('open');

      setTimeout(() => { loginContainer.classList.add('visible'); }, 1200);
      setTimeout(() => {
        leftDoor.style.display='none';
        rightDoor.style.display='none';
      }, 2200);
    }
  });
}

/* =========================================
   MEMBERS VAULT UNLOCK + LIVE VIP FEED
========================================= */
const unlockBtn = document.getElementById("unlockBtn");
const vaultPassword = document.getElementById("vaultPassword");
const vaultMsg = document.getElementById("vaultMsg");
const vaultContent = document.getElementById("vaultContent");

const memberFeed = document.getElementById("memberFeed");
const feedText = memberFeed ? memberFeed.querySelector(".feed-text") : null;

const vaultKey = "GOLDENVAULT";

if(unlockBtn){
  unlockBtn.addEventListener("click", () => {
    if(vaultPassword.value === vaultKey){
      vaultMsg.style.color = "#d4af37";
      vaultMsg.textContent = "Vault unlocked!";
      vaultContent.style.display = "block";
      updateMemberFeed(); // first transaction
    } else {
      vaultMsg.style.color = "red";
      vaultMsg.textContent = "Incorrect Vault Key";
    }
  });
}

/* =========================================
   FAKE VIP TRANSACTIONS
========================================= */
function generateTransaction(){
  const phone = `04******${Math.floor(Math.random()*90+10)}`; 
  const isDeposit = Math.random() > 0.5;
  let amount, action;

  if(isDeposit){
    amount = (Math.random()*(1000-10)+10).toFixed(2);
    action = `deposited $${amount}`;
  } else {
    amount = (Math.random()*(50000-500)+500).toFixed(2);
    action = `withdrew $${amount}`;
  }

  const games = ["Baccarat","Roulette","Blackjack","Private Table"];
  const game = games[Math.floor(Math.random()*games.length)];
  return `${phone} ${action} · ${game}`;
}

function playChime(){
  const audio = new Audio('https://freesound.org/data/previews/66/66717_634166-lq.mp3');
  audio.volume = 0.15;
  audio.play();
}

function updateMemberFeed(){
  if(vaultContent && vaultContent.style.display==="block" && feedText){
    const transaction = generateTransaction();
    feedText.style.opacity = 0;

    setTimeout(() => {
      feedText.textContent = transaction;
      feedText.style.opacity = 1;

      feedText.classList.remove("gold-shimmer","vip-spark");
      const amountMatch = transaction.match(/\$([\d,\.]+)/);
      if(amountMatch){
        const amountNum = parseFloat(amountMatch[1].replace(/,/g,''));

        // Gold shimmer high withdrawals (>10k)
        if(transaction.includes("withdrew") && amountNum>10000){ feedText.classList.add("gold-shimmer"); }

        // VIP sparkle mega moves >=25k
        if(amountNum >= 25000){
          feedText.classList.add("vip-spark"); playChime();
        }

        // VIP deposits >=800
        if(transaction.includes("deposited") && amountNum >=800){ feedText.classList.add("gold-shimmer"); }
      }
    },600);
  }
}

// Update every 5 minutes (demo can reduce to e.g., 10s)
setInterval(updateMemberFeed, 300000);
