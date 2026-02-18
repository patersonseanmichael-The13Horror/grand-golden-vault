"use client";

import { useState } from "react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

    setUploading(true);

    // Simulate upload (in production, this would send to your server)
    setTimeout(() => {
      alert(`Deposit screenshot submitted successfully!\n\nFile: ${selectedFile.name}\n\nOur team will verify your payment and credit your account within 24-48 hours. You'll receive an email confirmation at the registered email address.`);
      setUploading(false);
      setSelectedFile(null);
      onClose();
    }, 1500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative max-w-2xl w-full">
        {/* Animated glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/30 via-cyan-500/30 to-blue-500/30 blur-3xl animate-pulse"></div>
        
        {/* Modal content */}
        <div className="relative rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-black via-gray-900 to-black p-8 shadow-2xl">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-lg shadow-emerald-500/50 mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400">
              Deposit Funds
            </h2>
            <p className="mt-2 text-gray-400 text-sm">
              Make a deposit using PayID
            </p>
          </div>

          {/* Payment Details Card */}
          <div className="mb-6 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-cyan-950/40 p-6 shadow-inner">
            <div className="text-center mb-4">
              <div className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-2">
                Payment Details
              </div>
              <div className="text-xs text-gray-400">
                Use these details to make your deposit
              </div>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-emerald-500/20">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Name</div>
                  <div className="text-lg font-bold text-white">M Rainbow</div>
                </div>
                <button
                  onClick={() => copyToClipboard("M Rainbow", "Name")}
                  className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition"
                >
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {/* PayID */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-cyan-500/20">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">PayID</div>
                  <div className="text-lg font-bold text-cyan-400">0435 750 187</div>
                </div>
                <button
                  onClick={() => copyToClipboard("0435750187", "PayID")}
                  className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition"
                >
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {/* Reference */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-purple-500/20">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reference</div>
                  <div className="text-lg font-bold text-purple-400">10099987</div>
                </div>
                <button
                  onClick={() => copyToClipboard("10099987", "Reference")}
                  className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition"
                >
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {/* Description */}
              <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Description</div>
                <div className="text-sm text-amber-400">Items Purchased Online</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-4">
            <h3 className="text-cyan-300 font-semibold mb-3 text-sm">📋 How to Deposit</h3>
            <ol className="space-y-2 text-xs text-cyan-200/70">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">1.</span>
                <p>Open your banking app and select PayID payment</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">2.</span>
                <p>Enter the PayID number: <strong className="text-cyan-300">0435 750 187</strong></p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">3.</span>
                <p>Add reference: <strong className="text-cyan-300">10099987</strong> and description: <strong className="text-cyan-300">Items Purchased Online</strong></p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">4.</span>
                <p>Complete the payment and take a screenshot</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">5.</span>
                <p>Upload the screenshot below and submit</p>
              </li>
            </ol>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                Upload Payment Screenshot
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="screenshot-upload"
                />
                <label
                  htmlFor="screenshot-upload"
                  className="flex items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/30 transition cursor-pointer"
                >
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div className="text-center">
                    <div className="text-emerald-300 font-semibold">
                      {selectedFile ? selectedFile.name : "Click to upload screenshot"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      PNG, JPG or JPEG (Max 10MB)
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 px-8 py-4 text-white font-bold text-lg transition-all hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {uploading ? "Submitting..." : "Submit Deposit Proof"}
            </button>
          </form>

          {/* Notice */}
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>
              Your deposit will be verified and credited within 24-48 hours.
            </p>
            <p className="mt-1">
              For urgent assistance, contact{" "}
              <a href="mailto:VGTPartnership@outlook.com" className="text-emerald-400 hover:text-emerald-300 underline">
                VGTPartnership@outlook.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
