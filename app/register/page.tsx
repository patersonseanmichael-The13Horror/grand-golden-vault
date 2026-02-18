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
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/vault-entry.jpg" alt="Vault Entry" />
        <div className="max-w-xl mx-auto rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md p-8 shadow-vv-soft">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">Request Entry</div>
          <h1 className="mt-4 text-3xl font-semibold">Registration</h1>
          
          {error && (
            <div className="mt-4 bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-white/70 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-white/70 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-white/70 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
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
              <label htmlFor="terms" className="text-sm text-white/70">
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

            <div className="mt-8 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-900 font-semibold transition-all duration-200 shadow-vv-glow disabled:opacity-50 disabled:cursor-not-allowed"
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
