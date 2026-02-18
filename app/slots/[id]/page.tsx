import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";
import AdvancedSlotMachine from "@/components/AdvancedSlotMachine";
import fs from "fs";
import path from "path";

export default function SlotMachinePage({ params }: { params: { id: string } }) {
  const file = path.join(process.cwd(), "slots", `slot_${params.id}.json`);
  if (!fs.existsSync(file)) {
    return (
      <VaultShell>
        <section className="px-6 md:px-10 pt-12 pb-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-semibold">Machine not found</h1>
          </div>
        </section>
      </VaultShell>
    );
  }

  const cfg = JSON.parse(fs.readFileSync(file, "utf-8"));
  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/treasure-floor.jpg" alt="Treasure Floor" />
        <div className="max-w-6xl mx-auto">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">Machine {cfg.id}</div>
          <h1 className="mt-4 text-4xl font-semibold text-gold animate-shimmer">{cfg.name}</h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            Premium Vegas-style slot machine with {cfg.paylines} paylines, {cfg.rtp}% RTP, and {cfg.volatility} volatility. 
            Features wild symbols, scatter bonuses, and progressive jackpots.
          </p>
          
          {/* Machine Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-amber-500/20 bg-black/30 p-4">
              <div className="text-xs uppercase tracking-wider text-amber-500/60">Paylines</div>
              <div className="mt-1 text-2xl font-bold text-amber-400">{cfg.paylines}</div>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-black/30 p-4">
              <div className="text-xs uppercase tracking-wider text-amber-500/60">RTP</div>
              <div className="mt-1 text-2xl font-bold text-amber-400">{cfg.rtp}%</div>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-black/30 p-4">
              <div className="text-xs uppercase tracking-wider text-amber-500/60">Volatility</div>
              <div className="mt-1 text-2xl font-bold text-amber-400 uppercase">{cfg.volatility}</div>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-black/30 p-4">
              <div className="text-xs uppercase tracking-wider text-amber-500/60">Max Jackpot</div>
              <div className="mt-1 text-xl font-bold text-amber-400">{cfg.baseJackpot.toLocaleString()} AUD</div>
            </div>
          </div>

          <div className="mt-10">
            <AdvancedSlotMachine cfg={cfg} />
          </div>

          {/* Paytable */}
          <div className="mt-10 rounded-3xl border border-amber-500/20 bg-black/30 p-6">
            <h2 className="text-2xl font-semibold text-gold mb-4">Paytable</h2>
            <div className="grid gap-3">
              {Object.entries(cfg.payTable).map(([symbol, payouts]: [string, any]) => (
                <div key={symbol} className="flex items-center justify-between rounded-2xl border border-amber-500/10 bg-black/20 p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-semibold text-amber-400">{symbol}</div>
                    {symbol === cfg.wildSymbol && (
                      <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-300">WILD</span>
                    )}
                    {symbol === cfg.scatterSymbol && (
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">SCATTER</span>
                    )}
                  </div>
                  <div className="flex gap-4 text-sm text-amber-300">
                    {Object.entries(payouts).map(([count, payout]: [string, any]) => (
                      <div key={count}>
                        <span className="text-amber-500/60">x{count}:</span> {payout}x
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bonus Features */}
          {cfg.bonusFeatures && (
            <div className="mt-6 rounded-3xl border border-purple-500/20 bg-purple-950/20 p-6">
              <h2 className="text-2xl font-semibold text-purple-300 mb-4">Bonus Features</h2>
              {cfg.bonusFeatures.freeSpins && (
                <div className="rounded-2xl border border-purple-500/10 bg-black/20 p-4">
                  <div className="text-lg font-semibold text-purple-300">Free Spins</div>
                  <p className="mt-2 text-sm text-purple-200/70">
                    Land {cfg.bonusFeatures.freeSpins.minScatters}+ {cfg.bonusFeatures.freeSpins.triggerSymbol} symbols anywhere to trigger free spins!
                  </p>
                  <div className="mt-3 flex gap-4 text-sm text-purple-300">
                    {Object.entries(cfg.bonusFeatures.freeSpins.awards).map(([count, spins]: [string, any]) => (
                      <div key={count}>
                        <span className="text-purple-400/60">{count} scatters:</span> {spins} free spins
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-950/10 p-4 text-xs text-red-300/70">
            <strong>Demo Mode:</strong> This is a demonstration using client-side RNG for visual purposes only. 
            For real-money wagering, all outcomes must be validated server-side with certified RNG, proper licensing, 
            age verification, and responsible gambling controls.
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
