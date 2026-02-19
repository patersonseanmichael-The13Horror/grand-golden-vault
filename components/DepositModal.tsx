"use client";

import { useState } from "react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MIN_DEPOSIT = 5;
const MAX_DEPOSIT = 500;

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [amount, setAmount] = useState<number>(MIN_DEPOSIT);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
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
      alert(
        `Deposit submitted successfully!\n\nAmount: $${amount.toFixed(2)}\nFile: ${selectedFile.name}\n\nOur team will verify your payment and credit your account within 24-48 hours.`
      );
      setUploading(false);
      setSelectedFile(null);
      setAmount(MIN_DEPOSIT);
      onClose();
    }, 1200);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-black via-gray-900 to-black shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close deposit modal"
          className="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-black/40 p-2 text-gray-300 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-5 md:p-6">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400">
              Deposit Funds
            </h2>
            <p className="mt-1 text-xs text-gray-400">Deposit range: $5.00 - $500.00</p>
          </div>

          <div className="space-y-3 rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-4">
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-black/40 p-3">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-gray-400">Name</div>
                <div className="font-semibold text-white">M Rainbow</div>
              </div>
              <button type="button" onClick={() => copyToClipboard("M Rainbow", "Name")} className="text-emerald-300 text-sm">Copy</button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-cyan-500/20 bg-black/40 p-3">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-gray-400">PayID</div>
                <div className="font-semibold text-cyan-300">0435 750 187</div>
              </div>
              <button type="button" onClick={() => copyToClipboard("0435750187", "PayID")} className="text-cyan-300 text-sm">Copy</button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Deposit Amount (AUD)</label>
              <input
                type="number"
                step="0.01"
                min={MIN_DEPOSIT}
                max={MAX_DEPOSIT}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || MIN_DEPOSIT)}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Upload Payment Screenshot</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
              />
              {selectedFile && <p className="mt-2 text-xs text-emerald-300">Selected: {selectedFile.name}</p>}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button type="button" onClick={onClose} className="rounded-full border border-white/25 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              {uploading ? "Submitting..." : "Submit Deposit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
