import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";
import Link from "next/link";
import fs from "fs";
import path from "path";

type SlotCfg = { id: string; name: string; baseJackpot: number; minBet: number; maxBet: number };

export default function SlotsGallery() {
  const dir = path.join(process.cwd(), "slots");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const machines: SlotCfg[] = files.map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")));
  machines.sort((a, b) => a.id.localeCompare(b.id));

  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/jackpot-core.jpg" alt="Slots" />
        <div className="max-w-6xl mx-auto">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">Slots</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold">Elite Machine Gallery</h1>
          <p className="mt-4 text-white/70 max-w-3xl">
            25 original machines. Premium cadence. VIP progressive contribution on deposits (server-side).
          </p>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {machines.map((m) => (
              <Link key={m.id} href={`/slots/${m.id}`} className="rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md p-6 hover:bg-black/45 transition shadow-vv-soft">
                <div className="text-xs tracking-[0.30em] uppercase text-white/55">Machine {m.id}</div>
                <div className="mt-3 text-xl text-white/85">{m.name}</div>
                <div className="mt-3 text-sm text-white/65">Base Jackpot: {m.baseJackpot.toLocaleString("en-AU")} AUD</div>
                <div className="mt-1 text-sm text-white/65">Bet Range: {m.minBet} – {m.maxBet} AUD</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
