"use client";

import { useAuth } from "@/lib/AuthContext";
import { useCallback, useEffect, useMemo, useState } from "react";

const STARTING_BALANCE = 10000;
const MAX_BALANCE = 50000000;
const DECIMALS = 2;

function clampBalance(amount: number): number {
  if (!Number.isFinite(amount) || amount < 0) return STARTING_BALANCE;
  return +Math.min(MAX_BALANCE, amount).toFixed(DECIMALS);
}

export function useSharedWallet() {
  const { user } = useAuth();
  const storageKey = useMemo(() => `vv.wallet.${user?.uid ?? "guest"}`, [user?.uid]);
  const [balance, setBalance] = useState<number>(STARTING_BALANCE);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw === null ? STARTING_BALANCE : Number(raw);
    setBalance(clampBalance(parsed));
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, String(clampBalance(balance)));
  }, [balance, storageKey]);

  const credit = useCallback((amount: number) => {
    const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
    setBalance((prev) => clampBalance(prev + safeAmount));
  }, []);

  const debit = useCallback((amount: number) => {
    const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
    let allowed = false;
    setBalance((prev) => {
      if (prev < safeAmount) return prev;
      allowed = true;
      return clampBalance(prev - safeAmount);
    });
    return allowed;
  }, []);

  const setExactBalance = useCallback((amount: number) => {
    setBalance(clampBalance(amount));
  }, []);

  return { balance, credit, debit, setExactBalance, storageKey };
}
