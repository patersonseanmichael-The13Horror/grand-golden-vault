import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";
import VerticalSlotMachine from "@/components/VerticalSlotMachine";
import LuxeButton from "@/components/LuxeButton";
import fs from "fs";
import path from "path";

export async function generateStaticParams() {
  const slotsDir = path.join(process.cwd(), "slots");
  const files = fs.readdirSync(slotsDir);
  return files
    .filter(file => file.startsWith('slot_') && file.endsWith('.json'))
    .map(file => ({
      id: file.replace('slot_', '').replace('.json', '')
    }));
}

export default async function SlotMachinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = path.join(process.cwd(), "slots", `slot_${id}.json`);
  if (!fs.existsSync(file)) {
    return (
      <VaultShell
      rightAction={<LuxeButton href="/members" label="Back to Members" />}
    >
        <section className="px-6 md:px-10 pt-12 pb-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-semibold">Machine not found</h1>
          </div>
        </section>
      </VaultShell>
    );
  }

  const cfg = JSON.parse(fs.readFileSync(file, "utf-8"));
  // Add defaults for missing properties
  cfg.paylines = cfg.paylines || 20;
  cfg.rtp = cfg.rtp || 96;
  cfg.volatility = cfg.volatility || 'medium';
  cfg.symbolWeights = cfg.symbolWeights || {};
  cfg.wildSymbol = cfg.wildSymbol || 'CROWN';
  cfg.scatterSymbol = cfg.scatterSymbol || 'GEM';
  cfg.reels = cfg.reels || 5;
  cfg.rows = cfg.rows || 3;
  
  return (
    <VaultShell
      rightAction={<LuxeButton href="/members" label="Back to Members" />}
    >
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/treasure-floor.jpg" alt="Treasure Floor" />
        <div className="max-w-6xl mx-auto">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">Machine {cfg.id}</div>
          <h1 className="mt-4 text-4xl font-semibold text-gold animate-shimmer">{cfg.name}</h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            Premium Vegas-style {cfg.reels}x{cfg.rows} slot machine with {cfg.paylines || 20} paylines, {cfg.rtp || 96}% RTP, and {cfg.volatility || 'medium'} volatility. 
            Each machine includes themed symbols, card symbols down to TEN, 8 free spins on feature trigger, and Hold & Win during free spins. Launch RTP is set very-low to low, then shifts to medium-high after day 10.
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
              <div className="text-xs uppercase tracking-wider text-amber-500/60">Grid</div>
              <div className="mt-1 text-2xl font-bold text-amber-400">{cfg.reels}x{cfg.rows}</div>
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
            <VerticalSlotMachine cfg={cfg} />
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
                <div className="mb-4 rounded-2xl border border-purple-500/10 bg-black/20 p-4">
                  <div className="text-lg font-semibold text-purple-300">🎰 Free Spins</div>
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

              {cfg.bonusFeatures.holdAndWin && (
                <div className="rounded-2xl border border-purple-500/10 bg-black/20 p-4">
                  <div className="text-lg font-semibold text-purple-300">🎯 Hold & Win</div>
                  <p className="mt-2 text-sm text-purple-200/70">
                    Land {cfg.bonusFeatures.holdAndWin.minSymbols}+ {cfg.bonusFeatures.holdAndWin.triggerSymbol} symbols to trigger Hold & Win feature with {cfg.bonusFeatures.holdAndWin.respins} respins!
                  </p>
                  <p className="mt-2 text-xs text-purple-300/60">
                    During Hold & Win, trigger symbols are held in place while other positions respin. Landing new trigger symbols resets the respin counter.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* How to Play */}
          <div className="mt-6 rounded-3xl border border-cyan-500/20 bg-cyan-950/10 p-6">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4">How to Play</h2>
            <div className="space-y-3 text-sm text-cyan-200/70">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">1.</span>
                <p>Set your bet amount (0.10 to 500.00 AUD) using the + and - controls</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">2.</span>
                <p>Click SPIN to start - reels now run in circular spin mode before settling</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">3.</span>
                <p>Use HOLD buttons above reels to lock specific reels for the next spin</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">4.</span>
                <p>Match symbols on paylines to win - check the paytable below for winning combinations</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">5.</span>
                <p>Trigger 8 free spins and activate Hold & Win only during free spins!</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-rose-500/20 bg-rose-950/10 p-6">
            <h2 className="text-2xl font-semibold text-rose-300 mb-4">Security & Fair Play Rules</h2>
            <ul className="space-y-2 text-sm text-rose-100/75">
              <li>• No personal payment data is stored in slot game state. Wallet and spin state are isolated client session values.</li>
              <li>• Bets are constrained to configured machine limits ({cfg.minBet.toFixed(2)} to {cfg.maxBet.toFixed(2)} AUD).</li>
              <li>• RTP and bonus logic are machine-config driven and disclosed on-screen for transparency.</li>
              <li>• Responsible play: this experience is entertainment-only and should not be used for real-money wagering operations.</li>
            </ul>
          </div>


        </div>
      </section>
    </VaultShell>
  );
}
