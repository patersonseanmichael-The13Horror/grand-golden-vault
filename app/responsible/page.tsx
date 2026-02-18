import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";

export default function Page() {
  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/executive-chamber.jpg" alt="Responsible Conduct" />
        <div className="max-w-3xl mx-auto">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">Responsible Conduct</div>
          <h1 className="mt-4 text-4xl font-semibold">Responsible Conduct</h1>
          <div className="mt-6 text-white/70 leading-relaxed space-y-4">
            <p>Measured participation is the standard. Implement eligibility checks, limits, cool-downs, and self-exclusion controls before launch.</p>
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
