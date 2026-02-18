"use client";

import { useState } from "react";

type Card = {
  suit: string;
  rank: string;
  value: number;
};

type Hand = {
  cards: Card[];
  bet: number;
  doubled: boolean;
  split: boolean;
};

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export default function PremiumBlackjack() {
  const [balance, setBalance] = useState(10000);
  const [bet, setBet] = useState(100);
  const [playerHands, setPlayerHands] = useState<Hand[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<"betting" | "playing" | "dealer" | "finished">("betting");
  const [currentHandIndex, setCurrentHandIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [showDealerCard, setShowDealerCard] = useState(false);

  const createDeck = (): Card[] => {
    const newDeck: Card[] = [];
    for (let i = 0; i < 6; i++) { // 6 deck shoe
      for (const suit of SUITS) {
        for (const rank of RANKS) {
          let value = parseInt(rank);
          if (rank === "A") value = 11;
          else if (["J", "Q", "K"].includes(rank)) value = 10;
          newDeck.push({ suit, rank, value });
        }
      }
    }
    return newDeck.sort(() => Math.random() - 0.5);
  };

  const drawCard = (currentDeck: Card[]): [Card, Card[]] => {
    const card = currentDeck[0];
    return [card, currentDeck.slice(1)];
  };

  const calculateHandValue = (cards: Card[]): number => {
    let value = cards.reduce((sum, card) => sum + card.value, 0);
    let aces = cards.filter(card => card.rank === "A").length;
    
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  };

  const dealInitialCards = () => {
    if (balance < bet) return;
    
    let newDeck = createDeck();
    const playerCards: Card[] = [];
    const dealerCards: Card[] = [];
    
    [playerCards[0], newDeck] = drawCard(newDeck);
    [dealerCards[0], newDeck] = drawCard(newDeck);
    [playerCards[1], newDeck] = drawCard(newDeck);
    [dealerCards[1], newDeck] = drawCard(newDeck);
    
    setDeck(newDeck);
    setPlayerHands([{ cards: playerCards, bet, doubled: false, split: false }]);
    setDealerHand(dealerCards);
    setBalance(prev => prev - bet);
    setGameState("playing");
    setCurrentHandIndex(0);
    setShowDealerCard(false);
    setMessage("");
    
    // Check for blackjack
    if (calculateHandValue(playerCards) === 21) {
      setTimeout(() => finishGame(), 500);
    }
  };

  const hit = () => {
    if (gameState !== "playing") return;
    
    const currentHand = playerHands[currentHandIndex];
    const [newCard, newDeck] = drawCard(deck);
    const updatedCards = [...currentHand.cards, newCard];
    
    const newHands = [...playerHands];
    newHands[currentHandIndex] = { ...currentHand, cards: updatedCards };
    
    setPlayerHands(newHands);
    setDeck(newDeck);
    
    const handValue = calculateHandValue(updatedCards);
    if (handValue > 21) {
      if (currentHandIndex < playerHands.length - 1) {
        setCurrentHandIndex(prev => prev + 1);
      } else {
        finishGame();
      }
    }
  };

  const stand = () => {
    if (gameState !== "playing") return;
    
    if (currentHandIndex < playerHands.length - 1) {
      setCurrentHandIndex(prev => prev + 1);
    } else {
      finishGame();
    }
  };

  const doubleDown = () => {
    if (gameState !== "playing" || balance < playerHands[currentHandIndex].bet) return;
    
    const currentHand = playerHands[currentHandIndex];
    if (currentHand.cards.length !== 2) return;
    
    const [newCard, newDeck] = drawCard(deck);
    const updatedCards = [...currentHand.cards, newCard];
    
    const newHands = [...playerHands];
    newHands[currentHandIndex] = { ...currentHand, cards: updatedCards, doubled: true };
    
    setPlayerHands(newHands);
    setDeck(newDeck);
    setBalance(prev => prev - currentHand.bet);
    
    if (currentHandIndex < playerHands.length - 1) {
      setCurrentHandIndex(prev => prev + 1);
    } else {
      finishGame();
    }
  };

  const split = () => {
    if (gameState !== "playing" || balance < playerHands[currentHandIndex].bet) return;
    
    const currentHand = playerHands[currentHandIndex];
    if (currentHand.cards.length !== 2 || currentHand.cards[0].rank !== currentHand.cards[1].rank) return;
    
    let newDeck = deck;
    const [card1, deck1] = drawCard(newDeck);
    const [card2, deck2] = drawCard(deck1);
    
    const hand1: Hand = { cards: [currentHand.cards[0], card1], bet: currentHand.bet, doubled: false, split: true };
    const hand2: Hand = { cards: [currentHand.cards[1], card2], bet: currentHand.bet, doubled: false, split: true };
    
    const newHands = [...playerHands];
    newHands[currentHandIndex] = hand1;
    newHands.splice(currentHandIndex + 1, 0, hand2);
    
    setPlayerHands(newHands);
    setDeck(deck2);
    setBalance(prev => prev - currentHand.bet);
  };

  const finishGame = () => {
    setGameState("dealer");
    setShowDealerCard(true);
    
    let newDeck = deck;
    let newDealerHand = [...dealerHand];
    
    // Dealer draws until 17 or higher
    while (calculateHandValue(newDealerHand) < 17) {
      const [card, updatedDeck] = drawCard(newDeck);
      newDealerHand.push(card);
      newDeck = updatedDeck;
    }
    
    setDealerHand(newDealerHand);
    setDeck(newDeck);
    
    const dealerValue = calculateHandValue(newDealerHand);
    let totalWinnings = 0;
    let results: string[] = [];
    
    playerHands.forEach((hand, idx) => {
      const playerValue = calculateHandValue(hand.cards);
      const handBet = hand.doubled ? hand.bet * 2 : hand.bet;
      
      if (playerValue > 21) {
        results.push(`Hand ${idx + 1}: Bust`);
      } else if (dealerValue > 21) {
        totalWinnings += handBet * 2;
        results.push(`Hand ${idx + 1}: Win!`);
      } else if (playerValue > dealerValue) {
        totalWinnings += handBet * 2;
        results.push(`Hand ${idx + 1}: Win!`);
      } else if (playerValue === dealerValue) {
        totalWinnings += handBet;
        results.push(`Hand ${idx + 1}: Push`);
      } else {
        results.push(`Hand ${idx + 1}: Lose`);
      }
      
      // Blackjack bonus
      if (playerValue === 21 && hand.cards.length === 2 && !hand.split) {
        totalWinnings += handBet * 0.5;
      }
    });
    
    setBalance(prev => prev + totalWinnings);
    setMessage(results.join(" | "));
    setGameState("finished");
  };

  const newRound = () => {
    setPlayerHands([]);
    setDealerHand([]);
    setGameState("betting");
    setCurrentHandIndex(0);
    setMessage("");
  };

  const getSuitColor = (suit: string) => {
    return suit === "♥" || suit === "♦" ? "text-red-500" : "text-gray-900";
  };

  const canSplit = () => {
    const currentHand = playerHands[currentHandIndex];
    return currentHand && currentHand.cards.length === 2 && 
           currentHand.cards[0].rank === currentHand.cards[1].rank && 
           balance >= currentHand.bet;
  };

  const canDouble = () => {
    const currentHand = playerHands[currentHandIndex];
    return currentHand && currentHand.cards.length === 2 && balance >= currentHand.bet;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-amber-500/20 bg-black/40 p-4">
          <div className="text-xs uppercase tracking-wider text-amber-500/60">Balance</div>
          <div className="mt-1 text-2xl font-bold text-amber-400">${balance.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-4">
          <div className="text-xs uppercase tracking-wider text-emerald-500/60">Current Bet</div>
          <div className="mt-1 text-2xl font-bold text-emerald-400">${bet.toLocaleString()}</div>
        </div>
      </div>

      {/* Game Table */}
      <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-green-900/40 to-green-950/60 p-8 shadow-2xl">
        
        {/* Dealer Hand */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <div className="text-sm uppercase tracking-wider text-amber-500/60">Dealer</div>
            {dealerHand.length > 0 && (
              <div className="text-2xl font-bold text-white mt-2">
                {showDealerCard ? calculateHandValue(dealerHand) : "?"}
              </div>
            )}
          </div>
          <div className="flex justify-center gap-2">
            {dealerHand.map((card, idx) => (
              <div key={idx} className={`w-20 h-28 rounded-lg bg-white border-2 border-amber-500/40 flex flex-col items-center justify-center shadow-lg ${!showDealerCard && idx === 1 ? 'bg-gradient-to-br from-purple-900 to-purple-950' : ''}`}>
                {showDealerCard || idx === 0 ? (
                  <>
                    <div className={`text-3xl font-bold ${getSuitColor(card.suit)}`}>{card.rank}</div>
                    <div className={`text-2xl ${getSuitColor(card.suit)}`}>{card.suit}</div>
                  </>
                ) : (
                  <div className="text-4xl text-amber-400">🂠</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Player Hands */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <div className="text-sm uppercase tracking-wider text-amber-500/60">Player</div>
          </div>
          <div className="flex justify-center gap-6">
            {playerHands.map((hand, handIdx) => (
              <div key={handIdx} className={`${currentHandIndex === handIdx && gameState === "playing" ? 'ring-4 ring-amber-500/50 rounded-2xl p-4' : 'p-4'}`}>
                <div className="text-center mb-2">
                  <div className="text-2xl font-bold text-white">{calculateHandValue(hand.cards)}</div>
                  <div className="text-xs text-amber-400">Bet: ${hand.doubled ? hand.bet * 2 : hand.bet}</div>
                </div>
                <div className="flex gap-2">
                  {hand.cards.map((card, cardIdx) => (
                    <div key={cardIdx} className="w-20 h-28 rounded-lg bg-white border-2 border-amber-500/40 flex flex-col items-center justify-center shadow-lg">
                      <div className={`text-3xl font-bold ${getSuitColor(card.suit)}`}>{card.rank}</div>
                      <div className={`text-2xl ${getSuitColor(card.suit)}`}>{card.suit}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="text-center mb-6">
            <div className="inline-block rounded-full bg-amber-500/20 border border-amber-500/40 px-6 py-2 text-amber-300 font-semibold">
              {message}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-4">
          {gameState === "betting" && (
            <>
              <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => setBet(Math.max(10, bet - 10))} className="rounded-lg bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 font-semibold transition">
                  - $10
                </button>
                <div className="flex items-center px-6 py-2 rounded-lg bg-black/40 border border-amber-500/30">
                  <span className="text-amber-400 font-bold text-xl">${bet}</span>
                </div>
                <button onClick={() => setBet(bet + 10)} className="rounded-lg bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 font-semibold transition">
                  + $10
                </button>
              </div>
              <button
                onClick={dealInitialCards}
                disabled={balance < bet}
                className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-4 text-white font-bold text-lg transition hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deal Cards
              </button>
            </>
          )}

          {gameState === "playing" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={hit}
                className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-white font-bold transition hover:from-blue-500 hover:to-blue-400 shadow-lg"
              >
                Hit
              </button>
              <button
                onClick={stand}
                className="rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-white font-bold transition hover:from-red-500 hover:to-red-400 shadow-lg"
              >
                Stand
              </button>
              <button
                onClick={doubleDown}
                disabled={!canDouble()}
                className="rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-3 text-white font-bold transition hover:from-purple-500 hover:to-purple-400 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Double
              </button>
              <button
                onClick={split}
                disabled={!canSplit()}
                className="rounded-full bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-3 text-white font-bold transition hover:from-amber-500 hover:to-amber-400 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Split
              </button>
            </div>
          )}

          {gameState === "finished" && (
            <button
              onClick={newRound}
              className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-4 text-white font-bold text-lg transition hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/50"
            >
              New Round
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
