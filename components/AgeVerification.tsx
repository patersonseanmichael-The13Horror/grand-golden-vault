"use client";

import { useState, useEffect } from "react";

export default function AgeVerification() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if user has already verified their age
    const verified = localStorage.getItem("ageVerified");
    if (verified === "true") {
      setIsVerified(true);
    } else {
      setIsVerified(false);
      setShowModal(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem("ageVerified", "true");
    setIsVerified(true);
    setShowModal(false);
  };

  const handleDecline = () => {
    // Redirect to a safe page or show message
    window.location.href = "https://www.google.com";
  };

  // Don't render anything while checking verification status
  if (isVerified === null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-500 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  // If verified, don't show modal
  if (isVerified) {
    return null;
  }

  // Show age verification modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      <div className="relative max-w-md w-full mx-4">
        {/* Decorative glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 blur-2xl"></div>
        
        {/* Modal content */}
        <div className="relative rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-black via-gray-900 to-black p-8 shadow-2xl">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-900/30 to-purple-900/30 flex items-center justify-center shadow-vv-glow">
              <span className="text-4xl">🔞</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gold mb-2">
            The Velvet Vault
          </h1>
          <p className="text-center text-gray-400 text-sm tracking-wider uppercase mb-6">
            Digital E-Lounge
          </p>

          {/* Age verification message */}
          <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-6">
            <h2 className="text-xl font-semibold text-amber-400 mb-3 text-center">
              Age Verification Required
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed text-center">
              This platform contains gaming and entertainment content intended for adults only. 
              You must be <strong className="text-amber-400">18 years or older</strong> to access this site.
            </p>
          </div>

          {/* Confirmation question */}
          <div className="mb-6 text-center">
            <p className="text-white text-lg font-medium">
              Are you 18 years of age or older?
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleDecline}
              className="rounded-full border-2 border-red-500/30 bg-red-950/30 px-6 py-3 text-red-300 font-semibold transition-all hover:border-red-500/50 hover:bg-red-950/50 hover:shadow-lg hover:shadow-red-500/20"
            >
              No, I&apos;m Under 18
            </button>
            <button
              onClick={handleConfirm}
              className="rounded-full bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-3 text-gray-900 font-bold transition-all hover:from-amber-500 hover:to-amber-400 shadow-vv-glow hover:shadow-amber-500/50"
            >
              Yes, I&apos;m 18+
            </button>
          </div>

          {/* Legal disclaimer */}
          <div className="mt-6 rounded-lg border border-gray-700/50 bg-gray-900/50 p-3 text-xs text-gray-500 text-center">
            By entering, you confirm that you are of legal age in your jurisdiction and agree to our{" "}
            <a href="/terms" className="text-amber-400 hover:text-amber-300 underline">
              Terms of Service
            </a>
            {" "}and{" "}
            <a href="/responsible" className="text-amber-400 hover:text-amber-300 underline">
              Responsible Gaming
            </a>
            {" "}policies.
          </div>
        </div>
      </div>
    </div>
  );
}
