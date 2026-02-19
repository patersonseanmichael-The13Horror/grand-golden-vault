import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";

export default function Page() {
  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/celestial-vault.jpg" alt="dice-verera" />
        <div className="max-w-3xl mx-auto">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">Game Room</div>
          <h1 className="mt-4 text-4xl font-semibold">Dice Verera</h1>
          <p className="mt-6 text-white/70 leading-relaxed">
            Placeholder room. Implement rules + UX to match Grand Golden Vault standards.
          </p>
        </div>
      </section>
    </VaultShell>
  );
}
