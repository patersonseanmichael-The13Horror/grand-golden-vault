"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function WelcomeBonusModal() {
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<"nodeposit" | "deposit">("deposit");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Check if user has already seen the welcome bonus
    const bonusShown = localStorage.getItem(`welcomeBonus_${user.uid}`);
    
    if (!bonusShown) {
      // Show modal after a short delay for better UX
      setTimeout(() => {
        setShowModal(true);
      }, 1000);
    }
  }, [user]);

  const handleClaim = () => {
    if (user) {
      localStorage.setItem(`welcomeBonus_${user.uid}`, "claimed");
      setShowModal(false);
      
      if (selectedOffer === "deposit") {
        alert("First Deposit Bonus Selected! Please contact VGTPartnership@outlook.com to arrange your deposit and receive manual approval for your 50% bonus + VIP perks.");
      } else {
        alert("No Deposit Bonus Claimed! $100 has been added to your account with x50 wagering requirement.");
      }
    }
  };

  const handleDismiss = () => {
    if (user) {
      localStorage.setItem(`welcomeBonus_${user.uid}`, "dismissed");
      setShowModal(false);
    }
  };

  if (!showModal || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative max-w-4xl w-full my-8">
        {/* Animated glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/30 via-purple-500/30 to-pink-500/30 blur-3xl animate-pulse"></div>
        
        {/* Modal content */}
        <div className="relative rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-black via-gray-900 to-black p-8 shadow-2xl">
          
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/50 mb-4">
              <span className="text-4xl">🎁</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 animate-shimmer">
              Welcome to Grand Golden Vault!
            </h2>
            <p className="mt-2 text-gray-400 text-sm tracking-wider uppercase">
              Choose Your Exclusive Welcome Offer
            </p>
          </div>

          {/* Offer Selection */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            
            {/* Option 1: No Deposit Bonus */}
            <button
              onClick={() => setSelectedOffer("nodeposit")}
              className={`text-left rounded-2xl border-2 p-6 transition-all ${
                selectedOffer === "nodeposit"
                  ? "border-amber-500 bg-gradient-to-br from-amber-950/60 to-purple-950/60 shadow-lg shadow-amber-500/30"
                  : "border-gray-700 bg-gradient-to-br from-gray-900/40 to-gray-800/40 hover:border-gray-600"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-amber-400">No Deposit Bonus</h3>
                  <p className="text-gray-400 text-sm mt-1">Try risk-free</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedOffer === "nodeposit" ? "border-amber-500 bg-amber-500" : "border-gray-600"
                }`}>
                  {selectedOffer === "nodeposit" && (
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="text-4xl font-bold text-white mb-4">$100</div>

              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <p>Free $100 bonus</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <p>No deposit required</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <p>x50 wagering ($5,000)</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <p>Max withdrawal: $100</p>
                </div>
              </div>
            </button>

            {/* Option 2: First Deposit Bonus (RECOMMENDED) */}
            <button
              onClick={() => setSelectedOffer("deposit")}
              className={`text-left rounded-2xl border-2 p-6 transition-all relative ${
                selectedOffer === "deposit"
                  ? "border-purple-500 bg-gradient-to-br from-purple-950/60 to-pink-950/60 shadow-lg shadow-purple-500/30"
                  : "border-gray-700 bg-gradient-to-br from-gray-900/40 to-gray-800/40 hover:border-gray-600"
              }`}
            >
              {/* Recommended badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                ⭐ RECOMMENDED
              </div>

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-purple-400">First Deposit Bonus</h3>
                  <p className="text-gray-400 text-sm mt-1">Best value + VIP perks</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedOffer === "deposit" ? "border-purple-500 bg-purple-500" : "border-gray-600"
                }`}>
                  {selectedOffer === "deposit" && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-4xl font-bold text-white">$150+</div>
                <p className="text-purple-300 text-sm mt-1">($100 deposit + $50 bonus)</p>
              </div>

              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <p><strong className="text-white">50% deposit bonus</strong></p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <p>Minimum deposit: $100</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <p><strong className="text-purple-300">VIP tier perks included</strong></p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <p>Manual approval process</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">💎</span>
                  <p className="text-purple-300">Better wagering terms</p>
                </div>
              </div>
            </button>
          </div>

          {/* Selected offer details */}
          {selectedOffer === "deposit" && (
            <div className="mb-6 rounded-2xl border border-purple-500/30 bg-purple-950/20 p-6">
              <h3 className="text-purple-300 font-semibold mb-4 flex items-center gap-2">
                <span>💎</span>
                <span>VIP Tier Perks Included</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-purple-200/80">
                <div>
                  <div className="text-purple-400 font-semibold mb-1">Priority Support</div>
                  <p className="text-xs text-purple-300/60">Dedicated VIP assistance</p>
                </div>
                <div>
                  <div className="text-purple-400 font-semibold mb-1">Enhanced Rewards</div>
                  <p className="text-xs text-purple-300/60">Better comp points rate</p>
                </div>
                <div>
                  <div className="text-purple-400 font-semibold mb-1">Exclusive Access</div>
                  <p className="text-xs text-purple-300/60">VIP-only tournaments</p>
                </div>
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="mb-6 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4">
            <h3 className="text-cyan-300 font-semibold mb-3 text-center">
              {selectedOffer === "deposit" ? "Deposit Bonus Process" : "How It Works"}
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-xs text-cyan-200/70">
              {selectedOffer === "deposit" ? (
                <>
                  <div className="text-center">
                    <div className="text-2xl mb-2">1️⃣</div>
                    <p>Contact us to arrange deposit</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">2️⃣</div>
                    <p>Deposit $100+ (min)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">3️⃣</div>
                    <p>Receive 50% bonus + VIP perks</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-2xl mb-2">1️⃣</div>
                    <p>Claim your $100 bonus</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">2️⃣</div>
                    <p>Wager $5,000 on slots</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">3️⃣</div>
                    <p>Withdraw up to $100</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Contact info for deposit bonus */}
          {selectedOffer === "deposit" && (
            <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-center">
              <p className="text-amber-300 text-sm mb-2">
                📧 Contact us to arrange your deposit:
              </p>
              <a 
                href="mailto:VGTPartnership@outlook.com" 
                className="text-amber-400 hover:text-amber-300 font-semibold text-lg"
              >
                VGTPartnership@outlook.com
              </a>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClaim}
              className={`flex-1 rounded-full px-8 py-4 font-bold text-lg transition-all shadow-lg hover:scale-105 ${
                selectedOffer === "deposit"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-500/50 hover:shadow-purple-500/70"
                  : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-900 shadow-amber-500/50 hover:shadow-amber-500/70"
              }`}
            >
              {selectedOffer === "deposit" ? "Contact Us for Deposit" : "Claim $100 Bonus Now!"}
            </button>
            <button
              onClick={handleDismiss}
              className="sm:w-auto rounded-full border-2 border-gray-600 bg-gray-800/50 px-6 py-4 text-gray-300 font-semibold transition-all hover:border-gray-500 hover:bg-gray-800"
            >
              Maybe Later
            </button>
          </div>

          {/* Terms notice */}
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>
              By claiming this bonus, you agree to our{" "}
              <a href="/terms" className="text-amber-400 hover:text-amber-300 underline">
                Terms & Conditions
              </a>
              . One-time offer for new members only.
            </p>
            <p className="mt-1">
              {selectedOffer === "deposit" 
                ? "Deposit bonus requires manual approval. Funds will be credited after verification."
                : "Bonus funds are subject to wagering requirements before withdrawal."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
