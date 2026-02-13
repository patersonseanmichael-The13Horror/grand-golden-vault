/* ===== GOLDEN VAULT ANIMATION CONTROLLER ===== */
const animationController = {
  /* ===== CARD ANIMATION ===== */
  renderPlayerHand(hand) {
    const playerEl = document.getElementById("player-cards");
    playerEl.innerHTML = ""; // Clear
    hand.forEach((card, i) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      cardDiv.textContent = card;
      cardDiv.style.opacity = 0;
      cardDiv.style.transform = "translateY(-30px)";
      playerEl.appendChild(cardDiv);

      // Slide-in animation
      setTimeout(() => {
        cardDiv.style.transition = "all 0.3s ease-out";
        cardDiv.style.opacity = 1;
        cardDiv.style.transform = "translateY(0)";
      }, i * 200);
    });
  },

  renderDealerHand(hand, showAll=true) {
    const dealerEl = document.getElementById("dealer-cards");
    dealerEl.innerHTML = "";
    hand.forEach((card, i) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      cardDiv.textContent = (!showAll && i === 0) ? "🂠" : card;
      cardDiv.style.opacity = 0;
      cardDiv.style.transform = "translateY(-30px)";
      dealerEl.appendChild(cardDiv);

      setTimeout(() => {
        cardDiv.style.transition = "all 0.3s ease-out";
        cardDiv.style.opacity = 1;
        cardDiv.style.transform = "translateY(0)";
      }, i * 250);
    });
  },

  /* ===== CHIP / BALANCE ANIMATION ===== */
  animateBalanceChange(newBalance) {
    const balanceEl = document.getElementById("balance");
    let current = parseInt(balanceEl.textContent.replace("$",""));
    const step = (newBalance - current) / 20;
    let i = 0;
    const anim = setInterval(() => {
      current += step;
      balanceEl.textContent = "$" + Math.max(0, Math.floor(current));
      i++;
      if(i >= 20) clearInterval(anim);
    }, 30);
  },

  /* ===== BUTTON EFFECTS ===== */
  highlightButton(btn) {
    btn.style.transition = "all 0.2s ease";
    btn.style.transform = "scale(1.1)";
    btn.style.background = "rgba(212,175,55,0.2)";
    setTimeout(() => {
      btn.style.transform = "scale(1)";
      btn.style.background = "transparent";
    }, 200);
  },

  showInsuranceButton() {
    // Custom: create an insurance button
    if(document.getElementById("insuranceBtn")) return;
    const btn = document.createElement("button");
    btn.id = "insuranceBtn";
    btn.textContent = "Insurance";
    btn.onclick = () => { insurance(); btn.remove(); };
    document.querySelector(".buttons").appendChild(btn);
  },

  hideInsuranceButton() {
    const btn = document.getElementById("insuranceBtn");
    if(btn) btn.remove();
  },

  showSplitButton() {
    if(document.getElementById("splitBtn")) return;
    const btn = document.createElement("button");
    btn.id = "splitBtn";
    btn.textContent = "Split";
    btn.onclick = () => { split(); btn.remove(); };
    document.querySelector(".buttons").appendChild(btn);
  },

  hideSplitButton() {
    const btn = document.getElementById("splitBtn");
    if(btn) btn.remove();
  },

  /* ===== WIN PARTICLE EFFECT ===== */
  winParticles() {
    const vault = document.getElementById("vault");
    for(let i=0;i<30;i++){
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.width = particle.style.height = Math.random()*8 + 4 + "px";
      particle.style.background = "gold";
      particle.style.borderRadius = "50%";
      particle.style.left = Math.random()*vault.offsetWidth + "px";
      particle.style.top = Math.random()*vault.offsetHeight + "px";
      particle.style.opacity = 1;
      particle.style.pointerEvents = "none";
      vault.appendChild(particle);

      const dx = (Math.random()-0.5)*6;
      const dy = -Math.random()*8-2;
      let life = 0;
      const anim = setInterval(()=>{
        particle.style.left = parseFloat(particle.style.left)+dx+"px";
        particle.style.top = parseFloat(particle.style.top)+dy+"px";
        particle.style.opacity -= 0.03;
        life++;
        if(life>30){
          clearInterval(anim);
          particle.remove();
        }
      },30);
    }
  },

  /* ===== VAULT AMBIENCE ===== */
  pulseVaultGlow() {
    const vault = document.getElementById("vault");
    vault.animate([
      {boxShadow: "0 0 30px rgba(212,175,55,0.3)"},
      {boxShadow: "0 0 60px rgba(212,175,55,0.6)"},
      {boxShadow: "0 0 30px rgba(212,175,55,0.3)"}
    ], {duration: 2000, iterations: Infinity});
  }
};

/* ===== INITIALIZE AMBIENCE ===== */
setTimeout(()=>animationController.pulseVaultGlow(), 2200);
