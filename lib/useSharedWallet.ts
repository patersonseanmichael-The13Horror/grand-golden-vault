"use client";

import { useAuth } from "@/lib/AuthContext";
import { useCallback, useEffect, useMemo, useState } from "react";

const STARTING_BALANCE = 10000;
const DECIMALS = 2;

export function useSharedWallet() {
  const { user } = useAuth();
  const storageKey = useMemo(() => `vv.wallet.${user?.uid ?? "guest"}`, [user?.uid]);
  const [balance, setBalance] = useState<number>(STARTING_BALANCE);

  useEffect(() => {
    const saved = Number(window.localStorage.getItem(storageKey) || STARTING_BALANCE);
    if (Number.isFinite(saved) && saved >= 0) {
      setBalance(+saved.toFixed(DECIMALS));
      return;
    }
    setBalance(STARTING_BALANCE);
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, String(+balance.toFixed(DECIMALS)));
  }, [balance, storageKey]);

  const credit = useCallback((amount: number) => {
    setBalance((prev) => +(prev + Math.max(0, amount)).toFixed(DECIMALS));
  }, []);

  const debit = useCallback((amount: number) => {
    const safeAmount = Math.max(0, amount);
    let allowed = false;
    setBalance((prev) => {
      if (prev < safeAmount) return prev;
      allowed = true;
      return +(prev - safeAmount).toFixed(DECIMALS);
    });
    return allowed;
  }, []);

  const setExactBalance = useCallback((amount: number) => {
    if (!Number.isFinite(amount) || amount < 0) return;
    setBalance(+amount.toFixed(DECIMALS));
  }, []);

  return { balance, credit, debit, setExactBalance, storageKey };
}
