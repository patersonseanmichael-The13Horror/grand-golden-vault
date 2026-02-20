import Link from "next/link";
import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";

export default function Page() {
  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-14 md:pt-20 pb-16 md:pb-20">
        <HeroBackdrop src="/assets/images/executive-chamber.jpg" alt="Privacy" />
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs tracking-[0.35em] uppercase text-gold-solid">Privacy</div>
            <Link href="/" className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10">Back to Home</Link>
          </div>
          <h1 className="vv-display mt-4 text-4xl font-semibold">Privacy Policy</h1>
          <div className="mt-6 space-y-5 rounded-2xl vv-panel p-6 text-white/78 leading-relaxed">
            <p>
              We collect the minimum personal information needed to operate secure account access, including basic profile
              identifiers, authentication details, and session metadata.
            </p>
            <p>
              Payment- and deposit-related records are processed for verification, fraud prevention, dispute handling, and
              compliance duties. We do not intentionally publish sensitive customer data on public-facing pages.
            </p>
            <p>
              Technical logs and usage events may be retained to maintain platform reliability, investigate security events,
              enforce policies, and support legitimate legal obligations.
            </p>
            <p>
              Data may be shared with trusted service providers only where required to deliver core services such as hosting,
              authentication, payment operations, and regulatory compliance.
            </p>
            <p>
              By using Grand Golden Vault, you consent to this data handling model and acknowledge that policy updates may be
              posted as platform requirements evolve.
            </p>
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
