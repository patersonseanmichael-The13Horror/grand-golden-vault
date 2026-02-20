"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import VaultShell from "@/components/VaultShell";
import LuxeButton from "@/components/LuxeButton";
import HeroBackdrop from "@/components/HeroBackdrop";

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
          <div className="flex flex-wrap gap-2">
            <LuxeButton href="/check-in" label="Check-In" variant="gold" />
            <LuxeButton href="/members" label="Members" variant="ghost" />
          </div>
        }
      >
        <section className="relative py-12">
          <HeroBackdrop src="/assets/images/treasure-floor.jpg" alt="Bonus Vault Hall" />
          <div className="vv-page-wrap">
            <div className="vv-panel rounded-3xl p-8 vv-reveal">
              <p className="vv-kicker">Bonus Vault</p>
              <h1 className="vv-display vv-heading mt-3 text-4xl text-white">Member Bonuses</h1>
              <p className="mt-3 vv-subtle">Active promotions tailored for Grand Golden Vault member floor.</p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
              {bonusCards.map((bonus) => (
                <div key={bonus.title} className="rounded-2xl border border-white/12 bg-black/25 p-5">
                  <div className="text-sm uppercase tracking-[0.2em] text-white/58">{bonus.title}</div>
                  <div className="mt-2 text-2xl font-bold text-[#9be8ca]">{bonus.value}</div>
                  <p className="mt-3 text-sm vv-subtle">{bonus.note}</p>
                </div>
              ))}
              </div>
            </div>
          </div>
        </section>
      </VaultShell>
    </ProtectedRoute>
  );
}
