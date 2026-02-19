"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import VaultShell from "@/components/VaultShell";
import LuxeButton from "@/components/LuxeButton";
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
          <div className="flex gap-2">
            <LuxeButton href="/bonus" label="Bonus" variant="gold" />
            <LuxeButton href="/members" label="Members" variant="ghost" />
          </div>
        }
      >
        <section className="px-6 md:px-10 py-12">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Loyalty Check-In</p>
              <h1 className="mt-3 text-4xl font-semibold">Daily Member Check-In</h1>
              <p className="mt-3 text-white/70">Check in once per day to keep your streak active and unlock better bonus drops.</p>

              <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-5">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">Current streak</div>
                  <div className="text-3xl font-bold text-emerald-300">{checkInStreak} days</div>
                </div>
                <button
                  onClick={handleDailyCheckIn}
                  disabled={!canCheckInToday}
                  className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {canCheckInToday ? "Check In Now" : "Checked In Today"}
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-amber-500/20 bg-black/30 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80">VIP Status</p>
              <h2 className="mt-3 text-2xl font-semibold">{tier.name}</h2>
              <p className="mt-2 text-sm text-white/60">{tier.note}</p>
              <p className="mt-4 text-sm text-white/80">
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
