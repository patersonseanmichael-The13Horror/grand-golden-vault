/* roulette.js — Golden Vault interactive roulette */

const WALLET_KEY = "goldenVaultBalance";
let balance = parseInt(localStorage.getItem(WALLET_KEY)) || 1000;
let currentBet = 0;

const tableEl = document.getElementById("rouletteTable");
const betInfo = document.getElementById("betInfo");
const spinBtn = document.getElementById("spinBtn");
const wheel = document.getElementById("wheel");
const ball = document.getElementById("ball");

// Numbers on a European roulette wheel
const numbers = [
  {num:0,color:"green"}, {num:32,color:"red"},{num:15,color:"black"},{num:19,color:"red"},
  {num:4,color:"black"},{num:21,color:"red"},{num:2,color:"black"},{num:25,color:"red"},
  {num:17,color:"black"},{num:34,color:"red"},{num:6,color:"black"},{num:27,color:"red"},
  {num:13,color:"black"},{num:36,color:"red"},{num:11,color:"black"},{num:30,color:"red"},
  {num:8,color:"black"},{num:23,color:"red"},{num:10,color:"black"},{num:5,color:"red"},
  {num:24,color:"black"},{num:16,color:"red"},{num:33,color:"black"},{num:1,color:"red"},
  {num:20,color:"black"},{num:14,color:"red"},{num:31,color:"black"},{num:9,color:"red"},
  {num:22,color:"black"},{num:18,color:"red"},{num:29,color:"black"},{num:7,color:"red"},
  {num:28,color:"black"},{num:12,color:"red"},{num:35,color:"black"},{num:3,color:"red"},
  {num:26,color:"black"}
];

// ---- CREATE TABLE CELLS ----
numbers.forEach(n=>{
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.classList.add(n.color);
  cell.textContent = n.num;
  cell.onclick = ()=>{
    if(balance<10) return alert("Not enough balance");
    currentBet += 10;
    balance -=10;
    updateBetInfo();
    cell.style.boxShadow = "0 0 15px gold";
    setTimeout(()=>cell.style.boxShadow="",300);
  }
  tableEl.appendChild(cell);
});

// ---- UPDATE BET INFO ----
function updateBetInfo(){
  betInfo.textContent = `Balance: $${balance} | Current Bet: $${currentBet}`;
}

// ---- SPIN LOGIC ----
spinBtn.onclick = ()=>{
  if(currentBet===0) return alert("Place a bet first!");
  const winningIndex = Math.floor(Math.random()*numbers.length);
  const winningNumber = numbers[winningIndex];
  animateWheelSpin(winningIndex);
};

// ---- WHEEL ANIMATION ----
function animateWheelSpin(winIdx){
  let totalRot = 360*6 + (winIdx * (360/numbers.length));
  const duration = 4000;
  const start = performance.now();

  function spin(timestamp){
    let elapsed = timestamp - start;
    let progress = Math.min(elapsed/duration,1);
    wheel.style.transform = `rotate(${totalRot*progress}deg)`;
    ball.style.transform = `translateX(-50%) rotate(${360*6*progress}deg)`;
    if(progress<1) requestAnimationFrame(spin);
    else resolveSpin(numbers[winIdx]);
  }
  requestAnimationFrame(spin);
}

// ---- RESOLVE WIN ----
function resolveSpin(winning){
  const betCells = Array.from(tableEl.children).filter(c=>c.style.boxShadow!=="");
  let won = false;
  betCells.forEach(cell=>{
    if(parseInt(cell.textContent)===winning.num){
      won = true;
      balance += currentBet*35;
      if(typeof animationController!=="undefined") animationController.winParticles();
    }
  });
  currentBet = 0;
  updateBetInfo();
  localStorage.setItem(WALLET_KEY,balance);
  // clear bets
  Array.from(tableEl.children).forEach(c=>c.style.boxShadow="");
}
