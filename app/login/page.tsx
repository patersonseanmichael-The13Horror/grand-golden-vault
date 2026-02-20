"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";
import LuxeButton from "@/components/LuxeButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/members"); // Redirect to members area after successful login
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-14 md:pt-20 pb-16 md:pb-20">
        <HeroBackdrop src="/assets/images/vault-entry.jpg" alt="Vault Entry" />
        <div className="max-w-xl mx-auto vv-panel rounded-3xl p-7 md:p-9">
          <div className="text-xs tracking-[0.35em] uppercase text-gold-solid">Member Login</div>
          <h1 className="vv-display mt-4 text-3xl md:text-4xl text-white">Return to the Lounge</h1>
          <p className="mt-3 text-white/70 leading-relaxed">
            Sign in to continue your session, access member rooms, and manage your account controls.
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
                placeholder="••••••••"
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="min-w-[170px] flex-1 rounded-2xl border border-[rgba(231,197,123,0.7)] bg-[linear-gradient(165deg,#f4dc9f_0%,#cda45f_45%,#a37e3e_100%)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1e1608] shadow-[0_10px_26px_rgba(185,146,78,0.4)] transition duration-200 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Enter"}
              </button>
              <LuxeButton href="/register" label="Register" />
            </div>
          </form>
        </div>
      </section>
    </VaultShell>
  );
}
