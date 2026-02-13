import { shuffle } from "../core/rngEngine.js";
import { debit, credit } from "../core/betEngine.js";
import { saveBlackjackState, clearBlackjackState } from "../core/stateManager.js";

let deck = [];
let player = [];
let dealer = [];
let bet = 0;
let gameOver = true;

function createDeck() {
    const suits = ["♠","♥","♦","♣"];
    const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
    deck = [];
    for (let s of suits)
        for (let v of values)
            deck.push(v+s);
    deck = shuffle(deck);
}

function cardValue(card) {
    const v = card.slice(0,-1);
    if (v === "A") return 11;
    if (["J","Q","K"].includes(v)) return 10;
    return parseInt(v);
}

function handValue(hand) {
    let total = 0;
    let aces = 0;
    hand.forEach(c=>{
        total += cardValue(c);
        if (c[0] === "A") aces++;
    });
    while (total > 21 && aces--) total -= 10;
    return total;
}

export function startGame(amount) {
    if (!gameOver) return;

    debit(amount);
    bet = amount;

    createDeck();
    player = [deck.pop(), deck.pop()];
    dealer = [deck.pop(), deck.pop()];
    gameOver = false;

    saveBlackjackState({ deck, player, dealer, bet, gameOver });

    return { player, dealer, bet };
}

export function hit() {
    if (gameOver) return;
    player.push(deck.pop());
    if (handValue(player) > 21) return endGame();
    return { player, dealer, bet };
}

export function stand() {
    if (gameOver) return;
    while (handValue(dealer) < 17)
        dealer.push(deck.pop());
    return endGame();
}

function endGame() {
    gameOver = true;

    const playerTotal = handValue(player);
    const dealerTotal = handValue(dealer);

    let result;

    if (playerTotal > 21) {
        result = "lose";
    } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
        credit(bet * 2);
        result = "win";
    } else if (playerTotal === dealerTotal) {
        credit(bet);
        result = "push";
    } else {
        result = "lose";
    }

    clearBlackjackState();

    return { player, dealer, result, bet };
}
