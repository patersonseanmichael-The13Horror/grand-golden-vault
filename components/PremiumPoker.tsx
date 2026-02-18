"use client";

import { useState } from "react";

type Card = {
  suit: string;
  rank: string;
  value: number;
};

type Player = {
  id: number;
  name: string;
  chips: number;
  cards: Card[];
  bet: number;
  folded: boolean;
  isAI: boolean;
};

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export default function PremiumPoker() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 0, name: "You", chips: 10000, cards: [], bet: 0, folded: false, isAI: false },
    { id: 1, name: "Player 2", chips: 10000, cards: [], bet: 0, folded: false, isAI: true },
    { id: 2, name: "Player 3", chips: 10000, cards: [], bet: 0, folded: false, isAI: true },
    { id: 3, name: "Player 4", chips: 10000, cards: [], bet: 0, folded: false, isAI: true },
  ]);
  const [communityCards, setCommunityCards] = useState<Card[]>([]);
  const [pot, setPot] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [gameState, setGameState] = useState<"waiting" | "preflop" | "flop" | "turn" | "river" | "showdown">("waiting");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [deck, setDeck] = useState<Card[]>([]);
  const [message, setMessage] = useState("");
  const [raiseAmount, setRaiseAmount] = useState(100);

  const createDeck = (): Card[] => {
    const newDeck: Card[] = [];
    for (const suit of SUITS) {
      for (let i = 0; i < RANKS.length; i++) {
        newDeck.push({ suit, rank: RANKS[i], value: i + 2 });
      }
    }
    return newDeck.sort(() => Math.random() - 0.5);
  };

  const drawCard = (currentDeck: Card[]): [Card, Card[]] => {
    return [currentDeck[0], currentDeck.slice(1)];
  };

  const startNewHand = () => {
    let newDeck = createDeck();
    const newPlayers = players.map(p => ({ ...p, cards: [], bet: 0, folded: false }));
    
    // Deal 2 cards to each player
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < newPlayers.length; j++) {
        const [card, updatedDeck] = drawCard(newDeck);
        newPlayers[j].cards.push(card);
        newDeck = updatedDeck;
      }
    }
    
    // Blinds
    const smallBlind = 50;
    const bigBlind = 100;
    newPlayers[1].bet = smallBlind;
    newPlayers[1].chips -= smallBlind;
    newPlayers[2].bet = bigBlind;
    newPlayers[2].chips -= bigBlind;
    
    setPlayers(newPlayers);
    setDeck(newDeck);
    setCommunityCards([]);
    setPot(smallBlind + bigBlind);
    setCurrentBet(bigBlind);
    setGameState("preflop");
    setCurrentPlayerIndex(0);
    setMessage("Your turn");
  };

  const dealFlop = () => {
    let newDeck = deck;
    const flop: Card[] = [];
    
    // Burn card
    newDeck = newDeck.slice(1);
    
    // Deal 3 cards
    for (let i = 0; i < 3; i++) {
      const [card, updatedDeck] = drawCard(newDeck);
      flop.push(card);
      newDeck = updatedDeck;
    }
    
    setCommunityCards(flop);
    setDeck(newDeck);
    setGameState("flop");
    setCurrentBet(0);
    setPlayers(players.map(p => ({ ...p, bet: 0 })));
    setCurrentPlayerIndex(0);
    setMessage("Flop dealt");
  };

  const dealTurn = () => {
    let newDeck = deck.slice(1); // Burn card
    const [card, updatedDeck] = drawCard(newDeck);
    
    setCommunityCards([...communityCards, card]);
    setDeck(updatedDeck);
    setGameState("turn");
    setCurrentBet(0);
    setPlayers(players.map(p => ({ ...p, bet: 0 })));
    setCurrentPlayerIndex(0);
    setMessage("Turn dealt");
  };

  const dealRiver = () => {
    let newDeck = deck.slice(1); // Burn card
    const [card, updatedDeck] = drawCard(newDeck);
    
    setCommunityCards([...communityCards, card]);
    setDeck(updatedDeck);
    setGameState("river");
    setCurrentBet(0);
    setPlayers(players.map(p => ({ ...p, bet: 0 })));
    setCurrentPlayerIndex(0);
    setMessage("River dealt");
  };

  const fold = () => {
    const newPlayers = [...players];
    newPlayers[0].folded = true;
    setPlayers(newPlayers);
    
    const activePlayers = newPlayers.filter(p => !p.folded);
    if (activePlayers.length === 1) {
      endHand(activePlayers[0]);
    } else {
      aiTurn();
    }
  };

  const call = () => {
    const callAmount = currentBet - players[0].bet;
    const newPlayers = [...players];
    newPlayers[0].chips -= callAmount;
    newPlayers[0].bet += callAmount;
    setPot(prev => prev + callAmount);
    setPlayers(newPlayers);
    aiTurn();
  };

  const raise = () => {
    const totalBet = raiseAmount;
    const callAmount = currentBet - players[0].bet;
    const raiseExtra = totalBet - callAmount;
    
    const newPlayers = [...players];
    newPlayers[0].chips -= totalBet;
    newPlayers[0].bet += totalBet;
    setPot(prev => prev + totalBet);
    setCurrentBet(newPlayers[0].bet);
    setPlayers(newPlayers);
    aiTurn();
  };

  const check = () => {
    aiTurn();
  };

  const aiTurn = () => {
    setTimeout(() => {
      const newPlayers = [...players];
      let nextPlayer = (currentPlayerIndex + 1) % players.length;
      
      // Skip folded players
      while (newPlayers[nextPlayer].folded && nextPlayer !== 0) {
        nextPlayer = (nextPlayer + 1) % players.length;
      }
      
      if (nextPlayer === 0) {
        // Round complete, move to next stage
        advanceStage();
        return;
      }
      
      // Simple AI logic
      const player = newPlayers[nextPlayer];
      const callAmount = currentBet - player.bet;
      const random = Math.random();
      
      if (random < 0.2) {
        // Fold
        player.folded = true;
        setMessage(`${player.name} folds`);
      } else if (random < 0.7 || callAmount === 0) {
        // Call or check
        player.chips -= callAmount;
        player.bet += callAmount;
        setPot(prev => prev + callAmount);
        setMessage(`${player.name} ${callAmount === 0 ? 'checks' : 'calls'}`);
      } else {
        // Raise
        const raiseAmt = Math.floor(Math.random() * 200) + 100;
        player.chips -= raiseAmt;
        player.bet += raiseAmt;
        setPot(prev => prev + raiseAmt);
        setCurrentBet(player.bet);
        setMessage(`${player.name} raises $${raiseAmt}`);
      }
      
      setPlayers(newPlayers);
      setCurrentPlayerIndex(nextPlayer);
      
      const activePlayers = newPlayers.filter(p => !p.folded);
      if (activePlayers.length === 1) {
        endHand(activePlayers[0]);
      } else {
        aiTurn();
      }
    }, 1000);
  };

  const advanceStage = () => {
    if (gameState === "preflop") {
      dealFlop();
    } else if (gameState === "flop") {
      dealTurn();
    } else if (gameState === "turn") {
      dealRiver();
    } else if (gameState === "river") {
      showdown();
    }
  };

  const showdown = () => {
    setGameState("showdown");
    const activePlayers = players.filter(p => !p.folded);
    
    // Simple winner determination (in real poker, would evaluate hand rankings)
    const winner = activePlayers[Math.floor(Math.random() * activePlayers.length)];
    endHand(winner);
  };

  const endHand = (winner: Player) => {
    const newPlayers = [...players];
    const winnerIndex = newPlayers.findIndex(p => p.id === winner.id);
    newPlayers[winnerIndex].chips += pot;
    
    setPlayers(newPlayers);
    setMessage(`${winner.name} wins $${pot}!`);
    setGameState("waiting");
  };

  const getSuitColor = (suit: string) => {
    return suit === "♥" || suit === "♦" ? "text-red-500" : "text-gray-900";
  };

  const canCheck = currentBet === players[0].bet;
  const canCall = currentBet > players[0].bet;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Pot and Message */}
      <div className="mb-6 text-center">
        <div className="inline-block rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/60 to-yellow-900/60 px-8 py-4 shadow-lg shadow-amber-500/30">
          <div className="text-xs uppercase tracking-wider text-amber-500/60">Pot</div>
          <div className="text-4xl font-bold text-amber-400">${pot.toLocaleString()}</div>
        </div>
        {message && (
          <div className="mt-4 text-lg text-white font-semibold">{message}</div>
        )}
      </div>

      {/* Game Table */}
      <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-green-900/60 to-green-950/80 p-8 shadow-2xl mb-6">
        
        {/* Community Cards */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <div className="text-sm uppercase tracking-wider text-amber-500/60">Community Cards</div>
          </div>
          <div className="flex justify-center gap-3">
            {communityCards.map((card, idx) => (
              <div key={idx} className="w-20 h-28 rounded-lg bg-white border-2 border-amber-500/40 flex flex-col items-center justify-center shadow-lg">
                <div className={`text-3xl font-bold ${getSuitColor(card.suit)}`}>{card.rank}</div>
                <div className={`text-2xl ${getSuitColor(card.suit)}`}>{card.suit}</div>
              </div>
            ))}
            {[...Array(5 - communityCards.length)].map((_, idx) => (
              <div key={`empty-${idx}`} className="w-20 h-28 rounded-lg border-2 border-dashed border-amber-500/20 bg-green-900/30"></div>
            ))}
          </div>
        </div>

        {/* Players */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {players.map((player, idx) => (
            <div key={player.id} className={`rounded-2xl border-2 p-4 ${
              player.folded ? 'border-gray-600 bg-gray-900/40 opacity-50' :
              idx === 0 ? 'border-emerald-500/60 bg-emerald-950/40' :
              'border-amber-500/30 bg-amber-950/20'
            }`}>
              <div className="text-center mb-3">
                <div className="text-sm font-semibold text-white">{player.name}</div>
                <div className="text-xs text-amber-400">${player.chips.toLocaleString()}</div>
                {player.bet > 0 && (
                  <div className="text-xs text-emerald-400 mt-1">Bet: ${player.bet}</div>
                )}
              </div>
              <div className="flex justify-center gap-2">
                {player.cards.map((card, cardIdx) => (
                  <div key={cardIdx} className={`w-14 h-20 rounded-lg bg-white border border-amber-500/40 flex flex-col items-center justify-center text-sm ${
                    player.isAI && gameState !== "showdown" ? 'bg-gradient-to-br from-purple-900 to-purple-950' : ''
                  }`}>
                    {!player.isAI || gameState === "showdown" ? (
                      <>
                        <div className={`text-xl font-bold ${getSuitColor(card.suit)}`}>{card.rank}</div>
                        <div className={`text-lg ${getSuitColor(card.suit)}`}>{card.suit}</div>
                      </>
                    ) : (
                      <div className="text-2xl text-amber-400">🂠</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {gameState === "waiting" && (
          <button
            onClick={startNewHand}
            className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-4 text-white font-bold text-lg transition hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/50"
          >
            Start New Hand
          </button>
        )}

        {gameState !== "waiting" && gameState !== "showdown" && currentPlayerIndex === 0 && !players[0].folded && (
          <>
            <div className="flex justify-center gap-4 mb-4">
              <button onClick={() => setRaiseAmount(Math.max(currentBet + 50, raiseAmount - 50))} className="rounded-lg bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 font-semibold transition">
                - $50
              </button>
              <div className="flex items-center px-6 py-2 rounded-lg bg-black/40 border border-amber-500/30">
                <span className="text-amber-400 font-bold text-xl">${raiseAmount}</span>
              </div>
              <button onClick={() => setRaiseAmount(raiseAmount + 50)} className="rounded-lg bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 font-semibold transition">
                + $50
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={fold}
                className="rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-white font-bold transition hover:from-red-500 hover:to-red-400 shadow-lg"
              >
                Fold
              </button>
              {canCheck && (
                <button
                  onClick={check}
                  className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-white font-bold transition hover:from-blue-500 hover:to-blue-400 shadow-lg"
                >
                  Check
                </button>
              )}
              {canCall && (
                <button
                  onClick={call}
                  className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-white font-bold transition hover:from-blue-500 hover:to-blue-400 shadow-lg"
                >
                  Call ${currentBet - players[0].bet}
                </button>
              )}
              <button
                onClick={raise}
                disabled={players[0].chips < raiseAmount}
                className="rounded-full bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-3 text-white font-bold transition hover:from-amber-500 hover:to-amber-400 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Raise ${raiseAmount}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
