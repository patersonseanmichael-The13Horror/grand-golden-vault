"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import VaultShell from "@/components/VaultShell";
import LuxeButton from "@/components/LuxeButton";
import HeroBackdrop from "@/components/HeroBackdrop";
import { useAuth } from "@/lib/AuthContext";
import { defaultDepositLedger, getVipTierForDeposits, type DepositLedger } from "@/lib/loyalty";

const CHECK_IN_KEY_PREFIX = "vv.checkin";

export default function CheckInPage() {
  const { user } = useAuth();
  const ledgerStorageKey = useMemo(() => `vv.deposits.${user?.uid ?? "guest"}`, [user?.uid]);
  const checkInStorageKey = useMemo(() => `${CHECK_IN_KEY_PREFIX}.${user?.uid ?? "guest"}`, [user?.uid]);
  const [ledger, setLedger] = useState<DepositLedger>(defaultDepositLedger);
  const [checkInStreak, setCheckInStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);

  useEffect(() => {
    const rawLedger = window.localStorage.getItem(ledgerStorageKey);
    if (rawLedger) {
      try {
        const parsed = JSON.parse(rawLedger) as DepositLedger;
        if (Array.isArray(parsed.deposits) && typeof parsed.totalDeposited === "number") {
          setLedger(parsed);
        }
      } catch {
        setLedger(defaultDepositLedger);
      }
    }

    const rawCheckIn = window.localStorage.getItem(checkInStorageKey);
    if (rawCheckIn) {
      try {
        const parsed = JSON.parse(rawCheckIn) as { streak: number; lastCheckIn: string | null };
        setCheckInStreak(parsed.streak || 0);
        setLastCheckIn(parsed.lastCheckIn || null);
      } catch {
        setCheckInStreak(0);
        setLastCheckIn(null);
      }
    }
  }, [checkInStorageKey, ledgerStorageKey]);

  const canCheckInToday = useMemo(() => {
    if (!lastCheckIn) return true;
    const last = new Date(lastCheckIn);
    const now = new Date();
    return last.toDateString() !== now.toDateString();
  }, [lastCheckIn]);

  const handleDailyCheckIn = () => {
    const nowIso = new Date().toISOString();
    const nextStreak = canCheckInToday ? checkInStreak + 1 : checkInStreak;
    const payload = { streak: nextStreak, lastCheckIn: nowIso };
    window.localStorage.setItem(checkInStorageKey, JSON.stringify(payload));
    setCheckInStreak(nextStreak);
    setLastCheckIn(nowIso);
  };

  const tier = getVipTierForDeposits(ledger.totalDeposited);

  return (
    <ProtectedRoute>
      <VaultShell
        rightAction={
          <div className="flex flex-wrap gap-2">
            <LuxeButton href="/bonus" label="Bonus" variant="gold" />
            <LuxeButton href="/members" label="Members" variant="ghost" />
          </div>
        }
      >
        <section className="relative py-12">
          <HeroBackdrop src="/assets/images/horizon-vault.jpg" alt="Loyalty Check-In Hall" />
          <div className="vv-page-wrap grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 vv-panel rounded-3xl p-6 vv-reveal">
              <p className="vv-kicker">Loyalty Check-In</p>
              <h1 className="vv-display vv-heading mt-3 text-4xl text-white">Daily Member Check-In</h1>
              <p className="mt-3 vv-subtle">Check in once per day to keep your streak active and unlock better bonus drops.</p>

              <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-300/24 bg-emerald-950/20 p-5">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/72">Current streak</div>
                  <div className="text-3xl font-bold text-emerald-300">{checkInStreak} days</div>
                </div>
                <button
                  onClick={handleDailyCheckIn}
                  disabled={!canCheckInToday}
                  className="vv-action-emerald disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {canCheckInToday ? "Check In Now" : "Checked In Today"}
                </button>
              </div>
            </div>

            <div className="vv-panel rounded-3xl p-6 vv-reveal vv-reveal-delay-2">
              <p className="vv-kicker">VIP Status</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{tier.name}</h2>
              <p className="mt-2 text-sm vv-subtle">{tier.note}</p>
              <p className="mt-4 text-sm text-white/86">
                Total Deposits: <span className="font-semibold text-amber-300">${ledger.totalDeposited.toLocaleString()}</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {tier.perks.map((perk) => (
                  <li key={perk}>• {perk}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </VaultShell>
    </ProtectedRoute>
  );
}
