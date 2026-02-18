import VaultShell from "@/components/VaultShell";
import LuxeButton from "@/components/LuxeButton";
import HeroBackdrop from "@/components/HeroBackdrop";

export default function LandingPage() {
  return (
    <VaultShell
      rightAction={
        <>
          <LuxeButton href="/login" label="Login" />
          <LuxeButton href="/register" label="Register" variant="gold" />
        </>
      }
    >
      <section className="relative px-6 md:px-10 pt-12 md:pt-16 pb-16">
        <HeroBackdrop src="/assets/images/index-hero.jpg" alt="Velvet Vault" />
        <div className="max-w-5xl mx-auto">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">Private Access • Members Only</div>
          <h1 className="mt-4 text-4xl md:text-6xl leading-tight font-semibold">
            <span className="text-gold animate-shimmer">The Velvet Vault</span>
            <span className="block text-white/70 font-light mt-2">Premium VIP Gaming Lounge</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg md:text-xl text-white/70 leading-relaxed">
            “Fortune never raises its voice—only its standard.
            <span className="block mt-2">Enter quietly, and be measured accordingly.”</span>
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <LuxeButton href="/register" label="Request Entry" variant="gold" />
            <LuxeButton href="/login" label="Member Login" />
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-900/10 to-purple-900/10 p-6 shadow-vv-glow backdrop-blur-md hover:shadow-vv-glow transition-all duration-300">
              <div className="text-xs tracking-[0.25em] uppercase text-amber-500/80">🎰 Premium Slots</div>
              <div className="mt-3 text-white/80 leading-relaxed">25 exclusive machines with Vegas-style mechanics, RTP controls, and progressive jackpots.</div>
            </div>
            <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-900/10 to-purple-900/10 p-6 shadow-vv-glow backdrop-blur-md hover:shadow-vv-glow transition-all duration-300">
              <div className="text-xs tracking-[0.25em] uppercase text-amber-500/80">💎 VIP Tiers</div>
              <div className="mt-3 text-white/80 leading-relaxed">Exclusive membership levels with enhanced rewards, bonuses, and personalized service.</div>
            </div>
            <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-900/10 to-purple-900/10 p-6 shadow-vv-glow backdrop-blur-md hover:shadow-vv-glow transition-all duration-300">
              <div className="text-xs tracking-[0.25em] uppercase text-amber-500/80">🔒 Secure Gaming</div>
              <div className="mt-3 text-white/80 leading-relaxed">Bank-grade security, responsible gaming tools, and certified fair play systems.</div>
            </div>
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
