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
      <section className="relative px-6 md:px-10 pt-14 md:pt-20 pb-16 md:pb-20">
        <HeroBackdrop src="/assets/images/index-hero.jpg" alt="Grand Golden Vault" />
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-[rgba(221,191,122,0.45)] bg-black/35 px-4 py-2 text-[11px] tracking-[0.34em] uppercase text-gold-solid">
            Private Access • Members Only
          </div>

          <h1 className="vv-display mt-6 max-w-4xl text-4xl md:text-6xl leading-[1.08] text-white">
            <span className="text-gold">The Grand Golden Vault</span>
            <span className="block text-white/76 font-normal mt-3">Premium VIP Gaming Lounge</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg md:text-xl text-white/75 leading-relaxed">
            Fortune never raises its voice. It sharpens the room, narrows the field, and rewards the prepared.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <LuxeButton href="/register" label="Request Entry" variant="gold" />
            <LuxeButton href="/login" label="Member Login" />
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-4 md:gap-5">
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
