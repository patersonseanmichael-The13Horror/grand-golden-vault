import Link from "next/link";
import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";

export default function Page() {
  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/executive-chamber.jpg" alt="Responsible Conduct" />
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs tracking-[0.35em] uppercase text-white/55">Responsible Conduct</div>
            <Link href="/" className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10">Back to Home</Link>
          </div>
          <h1 className="mt-4 text-4xl font-semibold">Responsible Gaming</h1>
          <div className="mt-6 text-white/70 leading-relaxed space-y-4 rounded-2xl border border-white/10 bg-black/25 p-6">
            <p>Set session limits, take scheduled breaks, and never play with funds required for living expenses.</p>
            <p>If gameplay stops being entertainment, use self-exclusion controls and seek professional support.</p>
            <p>We reserve the right to enforce account cooling-off periods and limit-risk controls to protect users and platform integrity.</p>
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
