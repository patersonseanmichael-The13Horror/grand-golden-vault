import Link from "next/link";
import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";

export default function Page() {
  return (
    <VaultShell>
      <section className="relative pt-14 md:pt-20 pb-16 md:pb-20">
        <HeroBackdrop src="/assets/images/executive-chamber.jpg" alt="Responsible Conduct" />
        <div className="vv-page-wrap max-w-3xl">
          <div className="flex items-center justify-between gap-4">
            <div className="vv-kicker">Responsible Conduct</div>
            <Link href="/" className="vv-action-muted">Back to Home</Link>
          </div>
          <h1 className="vv-display mt-4 text-4xl font-semibold">Responsible Gaming</h1>
          <div className="mt-6 space-y-5 rounded-2xl vv-panel p-6 text-white/78 leading-relaxed">
            <p>
              Gaming should remain entertainment. Set personal deposit, time, and loss limits before you play, and avoid
              wagering funds needed for essential living expenses.
            </p>
            <p>
              Take regular breaks during sessions and monitor your behavior for signs of fatigue, frustration, or loss of
              control. If gaming stops being enjoyable, pause immediately.
            </p>
            <p>
              Use available tools such as cooling-off periods, temporary account restrictions, and self-exclusion requests
              whenever needed. Support resources should be used early, not only in crisis.
            </p>
            <p>
              To protect users and platform integrity, we may apply mandatory risk controls, including deposit limits,
              session restrictions, or temporary account interventions where harmful patterns are detected.
            </p>
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
