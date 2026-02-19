"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import VaultShell from "@/components/VaultShell";
import LuxeButton from "@/components/LuxeButton";

const bonusCards = [
  {
    title: "Daily Spin Booster",
    value: "+15 Free Spins",
    note: "Claim once every 24h after check-in.",
  },
  {
    title: "Deposit Match",
    value: "20% up to $100",
    note: "Unlocked for all verified members.",
  },
  {
    title: "Weekend Vault Rush",
    value: "2x Loyalty Points",
    note: "Friday to Sunday promo multiplier.",
  },
];

export default function BonusPage() {
  return (
    <ProtectedRoute>
      <VaultShell
        rightAction={
          <div className="flex gap-2">
            <LuxeButton href="/check-in" label="Check-In" variant="gold" />
            <LuxeButton href="/members" label="Members" variant="ghost" />
          </div>
        }
      >
        <section className="px-6 md:px-10 py-12">
          <div className="mx-auto max-w-5xl rounded-3xl border border-amber-500/20 bg-black/30 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80">Bonus Vault</p>
            <h1 className="mt-3 text-4xl font-semibold">Member Bonuses</h1>
            <p className="mt-3 text-white/70">Active promotions tailored for Grand Golden Vault member floor.</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {bonusCards.map((bonus) => (
                <div key={bonus.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm uppercase tracking-[0.2em] text-white/50">{bonus.title}</div>
                  <div className="mt-2 text-2xl font-bold text-emerald-300">{bonus.value}</div>
                  <p className="mt-3 text-sm text-white/65">{bonus.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </VaultShell>
    </ProtectedRoute>
  );
}
