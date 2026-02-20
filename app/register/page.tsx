"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";
import LuxeButton from "@/components/LuxeButton";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms and Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password);
      router.push("/members"); // Redirect to members area after successful registration
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-14 md:pt-20 pb-16 md:pb-20">
        <HeroBackdrop src="/assets/images/vault-entry.jpg" alt="Vault Entry" />
        <div className="max-w-xl mx-auto vv-panel rounded-3xl p-7 md:p-9">
          <div className="text-xs tracking-[0.35em] uppercase text-gold-solid">Request Entry</div>
          <h1 className="vv-display mt-4 text-3xl md:text-4xl text-white">Create Membership</h1>
          <p className="mt-3 text-white/70 leading-relaxed">
            Open your account to access member rooms, tiered benefits, and personalized lounge services.
          </p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/45 bg-red-950/40 px-4 py-3 text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm tracking-wide text-white/78">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-white placeholder-white/45 focus:outline-none focus:ring-2 focus:ring-amber-500/45"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm tracking-wide text-white/78">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-white placeholder-white/45 focus:outline-none focus:ring-2 focus:ring-amber-500/45"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm tracking-wide text-white/78">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-white placeholder-white/45 focus:outline-none focus:ring-2 focus:ring-amber-500/45"
                placeholder="Re-enter password"
              />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-black/30 text-amber-500 focus:ring-amber-500/50"
              />
              <label htmlFor="terms" className="text-sm text-white/72">
                I agree to the{" "}
                <a href="/terms" className="text-amber-400 hover:text-amber-300">
                  Terms
                </a>
                ,{" "}
                <a href="/privacy" className="text-amber-400 hover:text-amber-300">
                  Privacy Policy
                </a>
                , and{" "}
                <a href="/responsible" className="text-amber-400 hover:text-amber-300">
                  Responsible Gaming
                </a>{" "}
                guidelines.
              </label>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="min-w-[170px] flex-1 rounded-2xl border border-[rgba(231,197,123,0.7)] bg-[linear-gradient(165deg,#f4dc9f_0%,#cda45f_45%,#a37e3e_100%)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1e1608] shadow-[0_10px_26px_rgba(185,146,78,0.4)] transition duration-200 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
              <LuxeButton href="/login" label="Login" />
            </div>
          </form>
        </div>
      </section>
    </VaultShell>
  );
}
