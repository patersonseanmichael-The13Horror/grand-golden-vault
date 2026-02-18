"use client";

import { useState } from "react";
import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";
import JackpotTicker from "@/components/JackpotTicker";
import BrisbaneClock from "@/components/BrisbaneClock";
import VipTiers from "@/components/VipTiers";
import GameGallery from "@/components/GameGallery";
import LuxeButton from "@/components/LuxeButton";
import ProtectedRoute from "@/components/ProtectedRoute";
import WelcomeBonusModal from "@/components/WelcomeBonusModal";
import DepositModal from "@/components/DepositModal";
import { useAuth } from "@/lib/AuthContext";

export default function Members() {
  const { logout } = useAuth();
  const [showDepositModal, setShowDepositModal] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedRoute>
      <WelcomeBonusModal />
      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
      
      <VaultShell 
        rightAction={
          <div className="flex gap-3">
            <button
              onClick={() => setShowDepositModal(true)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Wallet</span>
            </button>
            <LuxeButton href="/slots" label="Slots" variant="gold" />
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white/70 hover:bg-white/10 transition-all text-sm"
            >
              Logout
            </button>
          </div>
        }
      >
        <JackpotTicker />
        <section className="relative px-6 md:px-10 pt-12 pb-16">
          <HeroBackdrop src="/assets/images/members-page.jpg" alt="Members Hall" />
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="text-xs tracking-[0.35em] uppercase text-white/55">Members Hall</div>
                <h1 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight">The Lounge Awaits.</h1>
                <p className="mt-4 max-w-2xl text-white/70 leading-relaxed">
                  Conduct is currency. Elegance is policy. Proceed with composure.
                </p>
              </div>
              <BrisbaneClock />
            </div>

            <div className="mt-10 grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <GameGallery />
                <div className="rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md p-6 shadow-vv-soft">
                  <div className="text-xs tracking-[0.30em] uppercase text-white/60">Concierge (Ollama)</div>
                  <p className="mt-3 text-white/70 leading-relaxed">
                    Concierge boot-in point. Wire to a server-side gatekeeper endpoint (never expose your model directly to the browser).
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <VipTiers />
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-vv-soft">
                  <div className="text-xs tracking-[0.30em] uppercase text-white/60">VIP Deposit Progressive</div>
                  <p className="mt-3 text-white/70 leading-relaxed">
                    Progressive jackpot contribution is VIP-only on deposits. Implement on server with audit logs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </VaultShell>
    </ProtectedRoute>
  );
}
