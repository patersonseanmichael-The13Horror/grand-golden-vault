"use client";

import { useMemo, useState } from "react";

type Card = {
  suit: string;
  rank: string;
  value: number;
};

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const AI_DEALER = "Valentino";

const createDeck = () => {
  const shoe: Card[] = [];
  for (let d = 0; d < 6; d += 1) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        shoe.push({
          suit,
          rank,
          value: rank === "A" ? 11 : ["J", "Q", "K"].includes(rank) ? 10 : Number(rank),
        });
      }
    }
  }
  return shoe.sort(() => Math.random() - 0.5);
};

const handValue = (cards: Card[]) => {
  let total = cards.reduce((acc, c) => acc + c.value, 0);
  let aces = cards.filter((c) => c.rank === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
};

export default function PremiumBlackjack() {
  const [balance, setBalance] = useState(10000);
  const [bet, setBet] = useState(100);
  const [shoe, setShoe] = useState<Card[]>([]);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [revealHoleCard, setRevealHoleCard] = useState(false);
  const [stage, setStage] = useState<"betting" | "dealing" | "playing" | "dealer" | "finished">("betting");
  const [message, setMessage] = useState("Place your wager to challenge Valentino.");

  const playerTotal = useMemo(() => handValue(playerCards), [playerCards]);
  const dealerVisible = useMemo(() => (revealHoleCard ? dealerCards : dealerCards.slice(0, 1)), [dealerCards, revealHoleCard]);
  const dealerTotal = useMemo(() => handValue(dealerVisible), [dealerVisible]);

  const draw = (deck: Card[]) => [deck[0], deck.slice(1)] as const;

  const deal = async () => {
    if (balance < bet || stage === "dealing") return;

    let deck = createDeck();
    const p: Card[] = [];
    const d: Card[] = [];

    setStage("dealing");
    setMessage("Valentino is concentrating... cards incoming.");
    setBalance((prev) => prev - bet);
    setRevealHoleCard(false);

    await new Promise((r) => setTimeout(r, 250));
    [p[0], deck] = draw(deck);
    setPlayerCards([...p]);

    await new Promise((r) => setTimeout(r, 250));
    [d[0], deck] = draw(deck);
    setDealerCards([...d]);

    await new Promise((r) => setTimeout(r, 250));
    [p[1], deck] = draw(deck);
    setPlayerCards([...p]);

    await new Promise((r) => setTimeout(r, 250));
    [d[1], deck] = draw(deck);
    setDealerCards([...d]);

    setShoe(deck);
    setStage("playing");
    setMessage("Your move: hit, stand, or double down.");

    if (handValue(p) === 21) {
      stand(deck, p, d);
    }
  };

  const settle = (pCards: Card[], dCards: Card[], currentBet: number) => {
    const p = handValue(pCards);
    const d = handValue(dCards);

    if (p > 21) {
      setMessage("Bust. Valentino takes the hand.");
    } else if (d > 21 || p > d) {
      const blackjackBonus = p === 21 && pCards.length === 2 ? 1.5 : 1;
      const win = Math.round(currentBet * (1 + blackjackBonus));
      setBalance((prev) => prev + win);
      setMessage(`You win ${win.toLocaleString()} AUD against Valentino.`);
    } else if (p === d) {
      setBalance((prev) => prev + currentBet);
      setMessage("Push. Wager returned.");
    } else {
      setMessage("Valentino wins this round.");
    }

    setStage("finished");
  };

  const hit = () => {
    if (stage !== "playing" || shoe.length === 0) return;
    const [card, next] = draw(shoe);
    const nextPlayer = [...playerCards, card];
    setPlayerCards(nextPlayer);
    setShoe(next);

    if (handValue(nextPlayer) > 21) {
      setRevealHoleCard(true);
      settle(nextPlayer, dealerCards, bet);
    }
  };

  const stand = async (forcedShoe?: Card[], forcedPlayer?: Card[], forcedDealer?: Card[]) => {
    if (stage !== "playing" && !forcedShoe) return;

    let deck = forcedShoe ?? shoe;
    let dealer = [...(forcedDealer ?? dealerCards)];
    const player = forcedPlayer ?? playerCards;

    setStage("dealer");
    setRevealHoleCard(true);
    setMessage("Valentino reveals the hole card and draws...");

    while (handValue(dealer) < 17 && deck.length > 0) {
      await new Promise((r) => setTimeout(r, 350));
      const [card, next] = draw(deck);
      dealer = [...dealer, card];
      deck = next;
      setDealerCards([...dealer]);
    }

    setShoe(deck);
    settle(player, dealer, bet);
  };

  const doubleDown = async () => {
    if (stage !== "playing" || playerCards.length !== 2 || balance < bet || shoe.length === 0) return;
    setBalance((prev) => prev - bet);
    const [card, next] = draw(shoe);
    const nextPlayer = [...playerCards, card];
    setPlayerCards(nextPlayer);
    setShoe(next);
    await stand(next, nextPlayer, dealerCards);
  };

  const reset = () => {
    setPlayerCards([]);
    setDealerCards([]);
    setRevealHoleCard(false);
    setShoe([]);
    setStage("betting");
    setMessage("Place your wager to challenge Valentino.");
  };

  const renderCard = (card: Card, idx: number, hidden = false) => (
    <div
      key={`${card.rank}-${card.suit}-${idx}`}
      className={`h-24 w-16 rounded-xl border bg-white text-black shadow-xl transition-all duration-500 ${
        hidden ? "border-slate-700 bg-gradient-to-br from-slate-700 to-slate-900" : "border-black/10"
      } ${stage === "dealing" ? "animate-pulse" : ""}`}
    >
      {hidden ? (
        <div className="h-full w-full rounded-xl bg-[radial-gradient(circle_at_30%_30%,#334155,#0f172a)]" />
      ) : (
        <div className="flex h-full flex-col justify-between p-2 font-bold">
          <span>{card.rank}</span>
          <span className={`self-end text-xl ${card.suit === "♥" || card.suit === "♦" ? "text-red-500" : "text-black"}`}>{card.suit}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="rounded-3xl border-2 border-amber-400/30 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.25),rgba(2,6,23,0.95))] p-6 shadow-2xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/35 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300/70">Balance</p>
          <p className="text-2xl font-bold text-amber-300">{balance.toLocaleString()} AUD</p>
        </div>
        <div className="rounded-2xl border border-purple-400/30 bg-purple-950/20 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.25em] text-purple-200/70">AI Dealer</p>
          <p className="text-lg font-semibold text-purple-200">{AI_DEALER} • Hard High-Roller Focus</p>
        </div>
      </div>

      <div className="mb-5 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-emerald-200">Dealer Lane</h3>
          <div className={`rounded-full px-3 py-1 text-xs ${stage === "dealing" || stage === "dealer" ? "bg-emerald-400 text-black animate-pulse" : "bg-white/10 text-white/70"}`}>
            {stage === "dealing" || stage === "dealer" ? "Dealing Animation Live" : "Ready"}
          </div>
        </div>
        <div className="mb-3 flex items-center gap-3">
          <div className={`h-12 w-12 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 ${stage === "dealer" ? "animate-bounce" : "animate-pulse"}`} />
          <p className="text-sm text-white/80">Valentino monitors every hand with high concentration.</p>
        </div>
        <div className="flex gap-3">
          {dealerCards.map((c, i) => renderCard(c, i, !revealHoleCard && i === 1))}
        </div>
        <p className="mt-2 text-sm text-white/70">Dealer total: {dealerTotal}</p>
      </div>

      <div className="mb-5 rounded-3xl border border-cyan-500/30 bg-cyan-950/20 p-5">
        <h3 className="mb-2 text-lg font-semibold text-cyan-200">Player Lane</h3>
        <div className="flex gap-3">{playerCards.map((c, i) => renderCard(c, i))}</div>
        <p className="mt-2 text-sm text-white/70">Player total: {playerTotal || 0}</p>
      </div>

      <p className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">{message}</p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="text-xs uppercase tracking-[0.2em] text-white/60">Bet</label>
        <input
          type="number"
          min={10}
          max={1000}
          value={bet}
          onChange={(e) => setBet(Math.max(10, Math.min(1000, Number(e.target.value) || 10)))}
          className="w-28 rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-amber-300"
          disabled={stage === "playing" || stage === "dealer" || stage === "dealing"}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <button onClick={deal} disabled={stage === "playing" || stage === "dealer" || stage === "dealing"} className="rounded-xl bg-amber-500 px-4 py-2 font-semibold text-black disabled:opacity-50">Deal</button>
        <button onClick={hit} disabled={stage !== "playing"} className="rounded-xl border border-cyan-300/40 bg-cyan-950/40 px-4 py-2 text-cyan-200 disabled:opacity-50">Hit</button>
        <button onClick={() => void stand()} disabled={stage !== "playing"} className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-white disabled:opacity-50">Stand</button>
        <button onClick={doubleDown} disabled={stage !== "playing" || playerCards.length !== 2 || balance < bet} className="rounded-xl border border-purple-300/40 bg-purple-950/40 px-4 py-2 text-purple-200 disabled:opacity-50">Double</button>
        <button onClick={reset} className="rounded-xl border border-red-300/40 bg-red-950/40 px-4 py-2 text-red-200">Reset</button>
      </div>
    </div>
  );
}
