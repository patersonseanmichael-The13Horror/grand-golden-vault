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
  const { login, firebaseReady, firebaseError } = useAuth();
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
      <section className="relative pt-14 md:pt-20 pb-16 md:pb-20">
        <HeroBackdrop src="/assets/images/vault-entry.jpg" alt="Vault Entry" />
        <div className="vv-page-wrap">
          <div className="max-w-xl mx-auto vv-panel vv-auth-card rounded-3xl p-7 md:p-9 vv-reveal">
            <div className="vv-kicker">Member Login</div>
            <h1 className="vv-display vv-heading mt-4 text-3xl md:text-4xl text-white">Return to the Lounge</h1>
            <p className="mt-3 vv-subtle leading-relaxed">
              Sign in to continue your session, access member rooms, and manage your account controls.
            </p>

            {(firebaseError || error) && (
              <div className="mt-5 rounded-2xl border border-red-400/45 bg-red-950/40 px-4 py-3 text-red-200">
                {firebaseError || error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 vv-reveal vv-reveal-delay-2">
              <div>
                <label htmlFor="email" className="vv-form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={!firebaseReady}
                  className="vv-input"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="vv-form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!firebaseReady}
                  className="vv-input"
                  placeholder="••••••••"
                />
              </div>

              <div className="mt-8 flex flex-wrap gap-3 items-center">
                <button
                  type="submit"
                  disabled={loading || !firebaseReady}
                  className="vv-button min-w-[170px] flex-1 rounded-2xl border border-[rgba(231,197,123,0.72)] bg-[linear-gradient(165deg,#f4dc9f_0%,#cda45f_45%,#a37e3e_100%)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1e1608] shadow-[0_10px_26px_rgba(185,146,78,0.4)] transition duration-200 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {!firebaseReady ? "Auth Offline" : loading ? "Logging in..." : "Enter"}
                </button>
                <LuxeButton href="/register" label="Register" />
              </div>
            </form>
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
