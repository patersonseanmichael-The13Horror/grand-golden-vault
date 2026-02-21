import VaultShell from "@/components/VaultShell";
import LuxeButton from "@/components/LuxeButton";
import HeroBackdrop from "@/components/HeroBackdrop";

const features = [
  {
    title: "Premium Slots",
    icon: "🎰",
    body: "25 exclusive machines with engineered RTP pacing, cinematic reels, and progressive jackpot loops.",
  },
  {
    title: "VIP Tiers",
    icon: "💎",
    body: "Layered membership tiers with upgraded rewards, concierge treatment, and private room privileges.",
  },
  {
    title: "Secure Gaming",
    icon: "🔒",
    body: "Hardened account controls, transparent responsible-gaming tools, and bank-grade session security.",
  },
];

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
      <section className="relative pt-14 md:pt-20 pb-16 md:pb-20">
        <HeroBackdrop src="/assets/images/index-hero.jpg" alt="Grand Golden Vault" />
        <div className="vv-page-wrap">
          <div className="vv-kicker vv-reveal">
            Private Access • Members Only
          </div>

          <h1 className="vv-display vv-heading vv-reveal vv-reveal-delay-1 mt-6 max-w-4xl text-4xl md:text-6xl leading-[1.08] text-white">
            <span className="text-gold">The Grand Golden Vault</span>
            <span className="block text-white/76 font-normal mt-3">Private Institutional Royal Gaming Lounge</span>
          </h1>

          <p className="vv-reveal vv-reveal-delay-2 mt-7 max-w-2xl text-lg md:text-xl text-white/75 leading-relaxed">
            Wealth here moves in silence: strong, precise, and governed by elite vault protocol designed for disciplined members.
          </p>

          <div className="vv-reveal vv-reveal-delay-3 mt-10 flex flex-wrap gap-3">
            <LuxeButton href="/register" label="Request Entry" variant="gold" />
            <LuxeButton href="/login" label="Member Login" />
          </div>

          <div className="vv-reveal vv-reveal-delay-4 mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="vv-panel rounded-2xl px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/55">Members</div>
              <div className="mt-1 text-xl text-gold-solid vv-display">12,000+</div>
            </div>
            <div className="vv-panel rounded-2xl px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/55">Live Rooms</div>
              <div className="mt-1 text-xl text-gold-solid vv-display">25</div>
            </div>
            <div className="vv-panel rounded-2xl px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/55">VIP Support</div>
              <div className="mt-1 text-xl text-gold-solid vv-display">24/7</div>
            </div>
            <div className="vv-panel rounded-2xl px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/55">Trust Mode</div>
              <div className="mt-1 text-xl text-gold-solid vv-display">Bank Grade</div>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-4 md:gap-5">
            {features.map((feature) => (
              <article key={feature.title} className="vv-panel rounded-3xl p-6 md:p-7 transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(221,191,122,0.44)]">
                <div className="text-xs tracking-[0.22em] uppercase text-gold-solid">
                  {feature.icon} {feature.title}
                </div>
                <p className="mt-3 text-white/82 leading-relaxed">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
