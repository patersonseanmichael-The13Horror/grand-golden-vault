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
            The Velvet Vault
            <span className="block text-white/70 font-light mt-2">Digital E-Lounge</span>
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
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-vv-soft">
              <div className="text-xs tracking-[0.25em] uppercase text-white/60">Heritage Standard</div>
              <div className="mt-3 text-white/70 leading-relaxed">Designed for restraint, precision, and quiet prestige—never spectacle.</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-vv-soft">
              <div className="text-xs tracking-[0.25em] uppercase text-white/60">Discreet Progression</div>
              <div className="mt-3 text-white/70 leading-relaxed">Tiered recognition and refined privileges—earned, not advertised.</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-vv-soft">
              <div className="text-xs tracking-[0.25em] uppercase text-white/60">Controlled Access</div>
              <div className="mt-3 text-white/70 leading-relaxed">Membership environments with defined conduct, protections, and boundaries.</div>
            </div>
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
