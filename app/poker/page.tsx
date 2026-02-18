import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";
import PremiumPoker from "@/components/PremiumPoker";

export default function PokerPage() {
  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/treasure-floor.jpg" alt="Poker" />
        <div className="max-w-7xl mx-auto">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">Table Games</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-gold animate-shimmer">Texas Hold'em Poker</h1>
          <p className="mt-4 text-white/70 max-w-3xl">
            Play premium Texas Hold'em Poker against AI opponents. Experience authentic casino poker with 
            professional betting rounds, community cards, and strategic gameplay. No limit betting with realistic AI behavior.
          </p>

          <div className="mt-10">
            <PremiumPoker />
          </div>

          {/* Game Info */}
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-cyan-500/20 bg-cyan-950/10 p-6">
              <h2 className="text-xl font-semibold text-cyan-300 mb-4">How to Play</h2>
              <div className="space-y-3 text-sm text-cyan-200/70">
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <p>Click "Start New Hand" to begin</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <p>Each player receives 2 hole cards</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <p>Betting rounds: Pre-flop, Flop (3 cards), Turn (1 card), River (1 card)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">4.</span>
                  <p>Choose to Fold, Check, Call, or Raise</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">5.</span>
                  <p>Best 5-card hand using hole cards and community cards wins!</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-purple-500/20 bg-purple-950/10 p-6">
              <h2 className="text-xl font-semibold text-purple-300 mb-4">Hand Rankings</h2>
              <div className="space-y-2 text-sm text-purple-200/70">
                <div className="flex justify-between">
                  <span>Royal Flush</span>
                  <span className="text-purple-300 font-semibold">Highest</span>
                </div>
                <div className="flex justify-between">
                  <span>Straight Flush</span>
                  <span className="text-purple-300 font-semibold">2nd</span>
                </div>
                <div className="flex justify-between">
                  <span>Four of a Kind</span>
                  <span className="text-purple-300 font-semibold">3rd</span>
                </div>
                <div className="flex justify-between">
                  <span>Full House</span>
                  <span className="text-purple-300 font-semibold">4th</span>
                </div>
                <div className="flex justify-between">
                  <span>Flush</span>
                  <span className="text-purple-300 font-semibold">5th</span>
                </div>
                <div className="flex justify-between">
                  <span>Straight</span>
                  <span className="text-purple-300 font-semibold">6th</span>
                </div>
                <div className="flex justify-between">
                  <span>Three of a Kind</span>
                  <span className="text-purple-300 font-semibold">7th</span>
                </div>
                <div className="flex justify-between">
                  <span>Two Pair</span>
                  <span className="text-purple-300 font-semibold">8th</span>
                </div>
                <div className="flex justify-between">
                  <span>One Pair</span>
                  <span className="text-purple-300 font-semibold">9th</span>
                </div>
                <div className="flex justify-between">
                  <span>High Card</span>
                  <span className="text-purple-300 font-semibold">Lowest</span>
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
