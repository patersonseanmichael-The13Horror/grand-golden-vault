import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";
import SlotMachineClient from "@/components/SlotMachineClient";
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
        <div className="max-w-5xl mx-auto">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">Machine {cfg.id}</div>
          <h1 className="mt-4 text-4xl font-semibold">{cfg.name}</h1>
          <p className="mt-4 text-white/70">
            Original symbols, premium pacing. Demo uses local RNG for visuals. Production should validate outcomes server-side.
          </p>
          <div className="mt-10">
            <SlotMachineClient cfg={cfg} />
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
