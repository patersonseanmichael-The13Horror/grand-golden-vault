import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";
import Link from "next/link";
import LuxeButton from "@/components/LuxeButton";
import fs from "fs";
import path from "path";

type SlotCfg = { 
  id: string; 
  name: string; 
  theme?: string;
  baseJackpot: number; 
  minBet: number; 
  maxBet: number;
  volatility?: string;
  rtp?: number;
};

export default function SlotsGallery() {
  const dir = path.join(process.cwd(), "slots");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const machines: SlotCfg[] = files.map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")));
  machines.sort((a, b) => a.id.localeCompare(b.id));

  // Separate themed machines
  const themedMachines = machines.filter(m => m.theme);
  const classicMachines = machines.filter(m => !m.theme);
  const highestJackpot = Math.max(...machines.map((m) => m.baseJackpot));

  const getThemeColor = (theme?: string) => {
    switch(theme) {
      case 'ancient-egypt':
        return 'from-amber-900/20 to-yellow-800/20 border-amber-500/30 hover:border-amber-500/60';
      case 'fantasy-dragon':
        return 'from-red-900/20 to-orange-800/20 border-red-500/30 hover:border-red-500/60';
      case 'underwater-adventure':
        return 'from-blue-900/20 to-cyan-800/20 border-cyan-500/30 hover:border-cyan-500/60';
      default:
        return 'from-amber-900/10 to-purple-900/10 border-amber-500/20 hover:border-amber-500/40';
    }
  };

  const getThemeBadge = (theme?: string) => {
    switch(theme) {
      case 'ancient-egypt':
        return { emoji: '🏺', label: 'Ancient Egypt', color: 'bg-amber-500/20 text-amber-300' };
      case 'fantasy-dragon':
        return { emoji: '🐉', label: 'Fantasy', color: 'bg-red-500/20 text-red-300' };
      case 'underwater-adventure':
        return { emoji: '🌊', label: 'Ocean', color: 'bg-cyan-500/20 text-cyan-300' };
      default:
        return null;
    }
  };

  return (
    <VaultShell
      rightAction={<LuxeButton href="/members" label="Back to Members" />}
    >
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/jackpot-core.jpg" alt="Slots" />
        <div className="max-w-6xl mx-auto">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">The Grand Golden Vault · Slots</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-gold animate-shimmer">Grand Golden Slots Lounge</h1>
          <p className="mt-4 text-white/80 max-w-3xl text-lg">
            Experience premium Vegas-style slot machines featuring vertical scrolling reels, Hold & Win mechanics, 
            authentic casino features, multiple paylines, certified RTP rates, and progressive jackpots.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-amber-500/20 bg-black/25 p-4">
              <div className="text-xs uppercase tracking-wider text-white/50">Machines</div>
              <div className="mt-1 text-2xl font-semibold text-gold">{machines.length}</div>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-black/25 p-4">
              <div className="text-xs uppercase tracking-wider text-white/50">Featured Themes</div>
              <div className="mt-1 text-2xl font-semibold text-gold">{themedMachines.length}</div>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-black/25 p-4">
              <div className="text-xs uppercase tracking-wider text-white/50">Top Progressive Jackpot</div>
              <div className="mt-1 text-2xl font-semibold text-gold">{highestJackpot.toLocaleString("en-AU")} AUD</div>
            </div>
          </div>

          {/* Featured Themed Machines */}
          {themedMachines.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-semibold text-amber-400">✨ Featured Themed Machines</h2>
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-300 uppercase tracking-wider">New</span>
            </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themedMachines.map((m) => {
                  const badge = getThemeBadge(m.theme);
                  return (
                    <Link 
                      key={m.id} 
                      href={`/slots/${m.id}`} 
                      className={`group rounded-3xl border bg-gradient-to-br backdrop-blur-md p-6 hover:shadow-vv-glow transition-all duration-300 shadow-vv-soft ${getThemeColor(m.theme)}`}
                    >
                      {badge && (
                        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${badge.color}`}>
                          <span>{badge.emoji}</span>
                          <span>{badge.label}</span>
                        </div>
                      )}
                      <div className="mt-3 text-2xl font-bold text-white/90 group-hover:text-gold transition">{m.name}</div>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-white/50 text-xs">Jackpot</div>
                          <div className="text-amber-400 font-semibold">{m.baseJackpot.toLocaleString()} AUD</div>
                        </div>
                        <div>
                          <div className="text-white/50 text-xs">RTP</div>
                          <div className="text-emerald-400 font-semibold">{m.rtp || 96}%</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                        <span>Bet: {m.minBet} – {m.maxBet} AUD</span>
                        <span className="uppercase">{m.volatility || 'Medium'}</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-300">Hold & Win</span>
                        <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">Free Spins</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Classic Machines */}
          {classicMachines.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-amber-400 mb-6">🎰 Classic Machines</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classicMachines.map((m) => (
                  <Link 
                    key={m.id} 
                    href={`/slots/${m.id}`} 
                    className={`group rounded-3xl border bg-gradient-to-br backdrop-blur-md p-6 hover:shadow-vv-glow transition-all duration-300 shadow-vv-soft ${getThemeColor()}`}
                  >
                    <div className="text-xs tracking-[0.30em] uppercase text-white/55">Machine {m.id}</div>
                    <div className="mt-3 text-xl text-white/85 group-hover:text-gold transition">{m.name}</div>
                    <div className="mt-3 text-sm text-white/65">Base Jackpot: {m.baseJackpot.toLocaleString("en-AU")} AUD</div>
                    <div className="mt-1 text-sm text-white/65">Bet Range: {m.minBet} – {m.maxBet} AUD</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Info Banner */}
          <div className="mt-12 rounded-3xl border border-cyan-500/20 bg-cyan-950/10 p-6">
            <h3 className="text-xl font-semibold text-cyan-300 mb-3">🎯 New Features</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-cyan-200/70">
              <div>
                <div className="font-semibold text-cyan-300 mb-1">Vertical Scrolling Reels</div>
                <p>Authentic casino-style symbols that scroll from top to bottom</p>
              </div>
              <div>
                <div className="font-semibold text-cyan-300 mb-1">Hold & Win Mechanics</div>
                <p>Lock specific reels in place for strategic gameplay</p>
              </div>
              <div>
                <div className="font-semibold text-cyan-300 mb-1">Themed Experiences</div>
                <p>Immersive themes with matching symbols and color schemes</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
