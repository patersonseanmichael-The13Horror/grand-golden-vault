import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";
import PremiumRoulette from "@/components/PremiumRoulette";

export default function RoulettePage() {
  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/treasure-floor.jpg" alt="Roulette" />
        <div className="max-w-7xl mx-auto">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">Table Games</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-gold animate-shimmer">European Roulette</h1>
          <p className="mt-4 text-white/70 max-w-3xl">
            Experience the elegance of European Roulette with a single zero wheel, authentic Las Vegas betting options, 
            and premium graphics. Place your bets on numbers, colors, odds/evens, or dozens for a chance at big wins.
          </p>

          <div className="mt-10">
            <PremiumRoulette />
          </div>

          {/* Game Info */}
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-cyan-500/20 bg-cyan-950/10 p-6">
              <h2 className="text-xl font-semibold text-cyan-300 mb-4">How to Play</h2>
              <div className="space-y-3 text-sm text-cyan-200/70">
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <p>Select your chip value using the chip selector</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <p>Click on numbers or betting areas to place your bets</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <p>Click SPIN to start the wheel</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">4.</span>
                  <p>Watch the wheel spin and see if your bets win!</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-purple-500/20 bg-purple-950/10 p-6">
              <h2 className="text-xl font-semibold text-purple-300 mb-4">Bet Types & Payouts</h2>
              <div className="space-y-2 text-sm text-purple-200/70">
                <div className="flex justify-between">
                  <span>Straight Up (Single Number)</span>
                  <span className="text-purple-300 font-semibold">35:1</span>
                </div>
                <div className="flex justify-between">
                  <span>Dozens (1-12, 13-24, 25-36)</span>
                  <span className="text-purple-300 font-semibold">2:1</span>
                </div>
                <div className="flex justify-between">
                  <span>Red / Black</span>
                  <span className="text-purple-300 font-semibold">1:1</span>
                </div>
                <div className="flex justify-between">
                  <span>Even / Odd</span>
                  <span className="text-purple-300 font-semibold">1:1</span>
                </div>
                <div className="flex justify-between">
                  <span>1-18 / 19-36</span>
                  <span className="text-purple-300 font-semibold">1:1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-950/10 p-4 text-xs text-red-300/70 text-center">
            <strong>Demo Mode:</strong> This is a demonstration using client-side RNG for visual purposes only. 
            For real-money wagering, all outcomes must be validated server-side with certified RNG, proper licensing, 
            age verification, and responsible gaming controls.
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
