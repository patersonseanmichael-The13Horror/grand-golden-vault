"use client";

import { useState } from "react";

const SAFE_TOPICS = ["nav", "navigation", "deposit", "wallet", "bonus", "check-in", "slots", "roulette", "blackjack", "poker"];

export default function OllamaConcierge() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("Ask about navigation or deposit support. Public access is restricted to safe help topics.");

  const handleAsk = () => {
    const normalized = input.toLowerCase().trim();
    if (!normalized) return;

    const allowed = SAFE_TOPICS.some((t) => normalized.includes(t));
    if (!allowed) {
      setReply("Access restricted: Valentino Concierge only supports navigation and deposit assistance.");
      return;
    }

    if (normalized.includes("deposit") || normalized.includes("wallet")) {
      setReply("Deposit flow: Members → Wallet button → enter $5-$500 → upload receipt → submit. Wallet sync is shared across all games.");
      return;
    }

    setReply("Navigation: Members is the hub. Games: /slots, /blackjack, /roulette, /poker. Loyalty: /bonus and /check-in.");
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md p-6 shadow-vv-soft">
      <div className="text-xs tracking-[0.30em] uppercase text-white/60">Concierge (Ollama Guard)</div>
      <p className="mt-3 text-white/70 leading-relaxed">Restricted assistant onboard. Scope: safe navigation and deposit only.</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about nav or deposit"
          className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
        />
        <button onClick={handleAsk} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black">Ask</button>
      </div>
      <p className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">{reply}</p>
    </div>
  );
}
