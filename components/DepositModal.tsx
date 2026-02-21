"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useSharedWallet } from "@/lib/useSharedWallet";
import { defaultDepositLedger, getVipTierForDeposits, type DepositLedger } from "@/lib/loyalty";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MIN_DEPOSIT = 5;
const MAX_DEPOSIT = 500;
const MAX_RECEIPT_MB = 5;

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const { user } = useAuth();
  const depositStorageKey = useMemo(() => `vv.deposits.${user?.uid ?? "guest"}`, [user?.uid]);
  const { credit } = useSharedWallet();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [amount, setAmount] = useState<number>(MIN_DEPOSIT);

  const paymentName = process.env.NEXT_PUBLIC_DEPOSIT_NAME || "M Rainbow";
  const paymentId = process.env.NEXT_PUBLIC_DEPOSIT_PAYID || "0435 750 187";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      alert("Invalid file type. Please upload an image receipt only.");
      return;
    }

    if (file.size > MAX_RECEIPT_MB * 1024 * 1024) {
      alert(`Receipt image must be ${MAX_RECEIPT_MB}MB or less.`);
      return;
    }

    setSelectedFile(file);
  };

  const readDepositLedger = (): DepositLedger => {
    const raw = window.localStorage.getItem(depositStorageKey);
    if (!raw) return defaultDepositLedger;

    try {
      const parsed = JSON.parse(raw) as DepositLedger;
      if (!Array.isArray(parsed.deposits) || typeof parsed.totalDeposited !== "number") {
        return defaultDepositLedger;
      }
      return parsed;
    } catch {
      return defaultDepositLedger;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please upload a screenshot of your payment");
      return;
    }

    if (amount < MIN_DEPOSIT || amount > MAX_DEPOSIT) {
      alert(`Deposit amount must be between $${MIN_DEPOSIT.toFixed(2)} and $${MAX_DEPOSIT.toFixed(2)}.`);
      return;
    }

    setUploading(true);

    setTimeout(() => {
      const previous = readDepositLedger();
      const nextLedger: DepositLedger = {
        totalDeposited: +(previous.totalDeposited + amount).toFixed(2),
        deposits: [
          {
            amount,
            createdAt: new Date().toISOString(),
            receiptName: selectedFile.name,
          },
          ...previous.deposits,
        ].slice(0, 25),
      };

      window.localStorage.setItem(depositStorageKey, JSON.stringify(nextLedger));
      credit(amount);

      const tier = getVipTierForDeposits(nextLedger.totalDeposited);
      alert(
        `Deposit submitted successfully!

Amount: $${amount.toFixed(2)}
File: ${selectedFile.name}
Total Deposited: $${nextLedger.totalDeposited.toLocaleString()}
Current VIP Tier: ${tier.name}

Wallet credited in real time.`
      );

      setUploading(false);
      setSelectedFile(null);
      setAmount(MIN_DEPOSIT);
      onClose();
    }, 800);
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="vv-wallet-modal relative w-full max-w-[22rem] rounded-3xl border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close deposit modal"
          className="vv-wallet-close absolute right-3 top-3 z-10"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-4">
          <div className="mb-4 text-center">
            <h2 className="vv-display text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f4e5a1] via-[#ddbf7a] to-[#a37e3e]">
              Royal Vault Wallet
            </h2>
            <p className="mt-1 text-[11px] text-white/65 tracking-[0.08em] uppercase">Deposit Range: $5.00 - $500.00</p>
          </div>

          <div className="space-y-2 rounded-2xl border border-[rgba(231,197,123,0.32)] bg-[rgba(16,11,5,0.62)] p-3">
            <div className="flex items-center justify-between rounded-xl border border-[rgba(231,197,123,0.26)] bg-black/35 p-2.5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-white/55">Name</div>
                <div className="text-sm font-semibold text-white">{paymentName}</div>
              </div>
              <button type="button" onClick={() => copyToClipboard(paymentName, "Name")} className="vv-wallet-action">Copy</button>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[rgba(231,197,123,0.26)] bg-black/35 p-2.5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-white/55">PayID</div>
                <div className="text-sm font-semibold text-[#f4e5a1]">{paymentId}</div>
              </div>
              <button type="button" onClick={() => copyToClipboard(paymentId.replace(/\s+/g, ""), "PayID")} className="vv-wallet-action">Copy</button>
            </div>
          </div>

          <div className="mt-3 grid gap-3">
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-white/72">Deposit Amount (AUD)</label>
              <input
                type="number"
                step="0.01"
                min={MIN_DEPOSIT}
                max={MAX_DEPOSIT}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || MIN_DEPOSIT)}
                className="w-full rounded-xl border border-[rgba(231,197,123,0.3)] bg-black/45 px-3 py-2.5 text-sm text-white outline-none focus:border-[rgba(231,197,123,0.6)]"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-white/72">Upload Payment Screenshot</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/heic"
                onChange={handleFileChange}
                className="w-full rounded-xl border border-[rgba(231,197,123,0.3)] bg-black/45 px-3 py-2 text-xs text-white"
              />
              {selectedFile && <p className="mt-1.5 text-[11px] text-[#f4e5a1]">Selected: {selectedFile.name}</p>}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/10 pt-3">
            <button type="button" onClick={onClose} className="vv-wallet-action">
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="rounded-full border border-[rgba(231,197,123,0.72)] bg-[linear-gradient(165deg,#f4dc9f_0%,#cda45f_45%,#a37e3e_100%)] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#1e1608] disabled:opacity-50"
            >
              {uploading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
