import Link from "next/link";
import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";

export default function Page() {
  return (
    <VaultShell>
      <section className="relative pt-14 md:pt-20 pb-16 md:pb-20">
        <HeroBackdrop src="/assets/images/executive-chamber.jpg" alt="Terms" />
        <div className="vv-page-wrap max-w-3xl">
          <div className="flex items-center justify-between gap-4">
            <div className="vv-kicker">Terms</div>
            <Link href="/" className="vv-action-muted">Back to Home</Link>
          </div>
          <h1 className="vv-display mt-4 text-4xl font-semibold">Terms & Conditions</h1>
          <div className="mt-6 space-y-5 rounded-2xl vv-panel p-6 text-white/78 leading-relaxed">
            <p>
              Grand Golden Vault is a private digital entertainment platform. By creating an account or using this site,
              you confirm you are at least 18 years old and legally permitted to access this type of service in your
              jurisdiction.
            </p>
            <p>
              Accounts are personal and non-transferable. You are responsible for safeguarding your login credentials and
              for all activity under your account. We may suspend or close accounts involved in fraud, abuse, identity
              misuse, chargeback abuse, or violations of platform rules.
            </p>
            <p>
              Promotions, bonuses, loyalty rewards, and payout timing may change based on compliance obligations,
              operational maintenance, and risk controls. Where verification is required, access to withdrawals or bonuses
              may be paused until checks are completed.
            </p>
            <p>
              All platform materials, including interface design, branding, media assets, and game-related content, are
              protected by applicable intellectual property laws. Unauthorized copying, scraping, redistribution, or reverse
              engineering is prohibited.
            </p>
            <p>
              Continued use of the platform indicates acceptance of these terms and any future updates posted on this page.
            </p>
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
