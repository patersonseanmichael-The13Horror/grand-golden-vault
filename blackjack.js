/* ===== GOLDEN VAULT BLACKJACK LOGIC ===== */
const WALLET_KEY = "goldenVaultBalance";
const STATE_KEY = "goldenVaultBJState";

/* ===== GAME STATE ===== */
let balance = parseInt(localStorage.getItem(WALLET_KEY)) || 1000;
let deck = [], playerHands = [], currentHand = 0, dealer = [];
let bet = 0, insuranceBet = 0, gameOver = true;

const balanceEl = document.getElementById("balance");
const dealerEl = document.getElementById("dealer-cards");
const playerEl = document.getElementById("player-cards");
const messageEl = document.getElementById("message");

balanceEl.textContent = "$" + balance;

/* ===== DECK & CARDS ===== */
function createDeck() {
  const suits = ["♠","♥","♦","♣"];
  const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  deck = [];
  for (let s of suits) for (let v of values) deck.push(v+s);
  deck.sort(() => Math.random() - 0.5);
}

function cardValue(c) {
  const v = c.slice(0, -1);
  if (v === "A") return 11;
  if (["J","Q","K"].includes(v)) return 10;
  return parseInt(v);
}

function handValue(h) {
  let v = 0, a = 0;
  h.forEach(c => { v += cardValue(c); if(c[0]==="A") a++; });
  while (v > 21 && a--) v -= 10;
  return v;
}

/* ===== RENDER HANDS ===== */
function renderHands(showDealer=true) {
  playerEl.innerHTML = playerHands[currentHand].map(c => `<div class="card">${c}</div>`).join("");
  dealerEl.innerHTML = dealer.map((c,i) =>
    (!showDealer && i===0) ? `<div class="card">🂠</div>` : `<div class="card">${c}</div>`
  ).join("");

  // Hook for animation controller
  if(typeof animationController !== "undefined") {
    animationController.renderPlayerHand(playerHands[currentHand]);
    animationController.renderDealerHand(dealer, showDealer);
  }
}

/* ===== BETTING ===== */
function setBet(a) {
  if (!gameOver) return;
  if (a > balance) return messageEl.textContent = "Not enough balance";
  bet = a;
  insuranceBet = 0;
  startGame();
}

/* ===== GAME START ===== */
function startGame() {
  gameOver = false;
  createDeck();
  dealer = [deck.pop(), deck.pop()];
  playerHands = [[deck.pop(), deck.pop()]];
  currentHand = 0;

  renderHands(false);
  messageEl.textContent = "";

  // Show insurance button if dealer has Ace
  if (dealer[0][0] === "A" && typeof animationController !== "undefined") {
    animationController.showInsuranceButton();
  }

  // Show split button if first two cards match
  if (playerHands[0][0].slice(0,-1) === playerHands[0][1].slice(0,-1) &&
      typeof animationController !== "undefined") {
    animationController.showSplitButton();
  }

  saveState();
}

/* ===== PLAYER ACTIONS ===== */
function hit() {
  if(gameOver) return;
  playerHands[currentHand].push(deck.pop());
  renderHands(false);
  saveState();

  if(handValue(playerHands[currentHand]) > 21) {
    nextHandOrEnd();
  }
}

function stand() {
  if(gameOver) return;
  nextHandOrEnd();
}

function doubleDown() {
  if(gameOver || balance < bet) return;
  bet *= 2;
  playerHands[currentHand].push(deck.pop());
  renderHands(false);
  nextHandOrEnd();
}

function split() {
  if(gameOver || playerHands.length > 1) return;
  if(balance < bet) return messageEl.textContent = "Not enough balance to split";

  const hand = playerHands[0];
  playerHands = [[hand[0]], [hand[1]]];
  currentHand = 0;
  balance -= bet; // duplicate bet for split hand
  renderHands(false);
  if(typeof animationController !== "undefined") animationController.hideSplitButton();
  saveState();
}

function insurance() {
  if(gameOver || insuranceBet > 0) return;
  insuranceBet = Math.floor(bet/2);
  balance -= insuranceBet;
  balanceEl.textContent = "$" + balance;
  if(typeof animationController !== "undefined") animationController.hideInsuranceButton();
  saveState();
}

/* ===== DEALER & END GAME ===== */
function nextHandOrEnd() {
  if(currentHand < playerHands.length - 1) {
    currentHand++;
    renderHands(false);
    saveState();
  } else {
    dealerPlay();
  }
}

function dealerPlay() {
  while(handValue(dealer) < 17) dealer.push(deck.pop());
  endGame();
}

function endGame() {
  gameOver = true;
  renderHands(true);

  let resultText = "";
  const dealerTotal = handValue(dealer);

  // Handle insurance payout
  if(insuranceBet > 0) {
    if(dealerTotal === 21) {
      balance += insuranceBet * 3; // 2:1 payout + return bet
      resultText += `Insurance wins! `;
    } else {
      resultText += `Insurance lost. `;
    }
    insuranceBet = 0;
  }

  // Evaluate each hand
  for(let hand of playerHands) {
    const playerTotal = handValue(hand);
    if(playerTotal === 21 && hand.length === 2) { // Blackjack
      balance += Math.floor(bet * 1.5);
      resultText += "Blackjack! You win! ";
    } else if(playerTotal > 21) {
      balance -= bet;
      resultText += "BUST! You lose! ";
    } else if(dealerTotal > 21 || playerTotal > dealerTotal) {
      balance += bet;
      resultText += "You win! ";
    } else if(playerTotal < dealerTotal) {
      balance -= bet;
      resultText += "You lose! ";
    } else {
      resultText += "Push. ";
    }
  }

  balanceEl.textContent = "$" + balance;
  messageEl.textContent = resultText.trim();

  localStorage.setItem(WALLET_KEY, balance);
  localStorage.removeItem(STATE_KEY);
}

/* ===== ANTI-REFRESH ===== */
function saveState() {
  localStorage.setItem(STATE_KEY, JSON.stringify({
    deck, playerHands, currentHand, dealer, bet, insuranceBet, gameOver
  }));
}

const saved = localStorage.getItem(STATE_KEY);
if(saved){
  const s = JSON.parse(saved);
  ({deck, playerHands, currentHand, dealer, bet, insuranceBet, gameOver} = s);
  renderHands(gameOver);
}
