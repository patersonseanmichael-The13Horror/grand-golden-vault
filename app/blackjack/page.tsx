import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";
import PremiumBlackjack from "@/components/PremiumBlackjack";

export default function BlackjackPage() {
  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/treasure-floor.jpg" alt="Blackjack" />
        <div className="max-w-6xl mx-auto">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">Table Games</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-gold animate-shimmer">Premium Blackjack • Valentino AI Table</h1>
          <p className="mt-4 text-white/70 max-w-3xl">
            Enter a premium Las Vegas felt with animated dealer flow. Valentino (AI) plays hard with high-roller concentration while you manage precision hit/stand/double decisions.
          </p>

          <div className="mt-10">
            <PremiumBlackjack />
          </div>

          {/* Game Info */}
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-cyan-500/20 bg-cyan-950/10 p-6">
              <h2 className="text-xl font-semibold text-cyan-300 mb-4">How to Play</h2>
              <div className="space-y-3 text-sm text-cyan-200/70">
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <p>Set your bet amount and click "Deal Cards"</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <p>Choose to Hit (take another card) or Stand (keep current hand)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <p>Double Down to double your bet and receive one more card</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">4.</span>
                  <p>Use Double to press advantage on a strong two-card hand</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">5.</span>
                  <p>Get closer to 21 than the dealer without going over to win!</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-purple-500/20 bg-purple-950/10 p-6">
              <h2 className="text-xl font-semibold text-purple-300 mb-4">Rules & Payouts</h2>
              <div className="space-y-2 text-sm text-purple-200/70">
                <div className="flex justify-between">
                  <span>Blackjack (Natural 21)</span>
                  <span className="text-purple-300 font-semibold">3:2</span>
                </div>
                <div className="flex justify-between">
                  <span>Regular Win</span>
                  <span className="text-purple-300 font-semibold">1:1</span>
                </div>
                <div className="flex justify-between">
                  <span>Push (Tie)</span>
                  <span className="text-purple-300 font-semibold">Return Bet</span>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <p className="text-xs">• Dealer stands on all 17s</p>
                  <p className="text-xs">• 6-deck shoe</p>
                  <p className="text-xs">• Split up to 3 times</p>
                  <p className="text-xs">• Double on any two cards</p>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>
    </VaultShell>
  );
}
