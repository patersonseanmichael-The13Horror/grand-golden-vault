import Link from "next/link";
import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";

export default function Page() {
  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/executive-chamber.jpg" alt="Terms" />
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs tracking-[0.35em] uppercase text-white/55">Terms</div>
            <Link href="/" className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10">Back to Home</Link>
          </div>
          <h1 className="mt-4 text-4xl font-semibold">Terms & Conditions</h1>
          <div className="mt-6 text-white/70 leading-relaxed space-y-4 rounded-2xl border border-white/10 bg-black/25 p-6">
            <p>Grand Golden Vault provides digital entertainment content only. Users must be 18+ and comply with local laws in their jurisdiction.</p>
            <p>Accounts are personal, non-transferable, and may be suspended for fraud, abuse, or policy breaches. Deposits and bonuses are subject to verification and anti-fraud controls.</p>
            <p>All game visuals, names, and branded materials are original or appropriately licensed. Unauthorized copying, redistribution, or reverse engineering is prohibited.</p>
            <p>Service availability, promotions, and payout timing may change for compliance, maintenance, or risk management reasons.</p>
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
