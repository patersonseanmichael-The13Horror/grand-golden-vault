import Link from "next/link";

import HeroBackdrop from "@/components/HeroBackdrop";
import VaultShell from "@/components/VaultShell";

type ReviewItem = {
  title: string;
  path: string;
  notes: string;
};

const REVIEW_ITEMS: ReviewItem[] = [
  {
    title: "Home",
    path: "/",
    notes: "Check animation cadence and overall visual balance.",
  },
  {
    title: "Poker",
    path: "/poker",
    notes: "Start a new hand and confirm gameplay still initializes correctly.",
  },
  {
    title: "Blackjack",
    path: "/blackjack",
    notes: "Verify instructional copy and page rendering.",
  },
  {
    title: "Contact",
    path: "/contact",
    notes: "Review FAQ text and formatting updates.",
  },
];

export default function ReviewPage() {
  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/treasure-floor.jpg" alt="Review" />

        <div className="max-w-5xl mx-auto">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">QA</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-gold animate-shimmer">Review Page</h1>
          <p className="mt-4 max-w-3xl text-white/70">
            Use this page to quickly review the updated routes after the latest stability and accessibility fixes.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {REVIEW_ITEMS.map((item) => (
              <div key={item.path} className="rounded-3xl border border-amber-500/20 bg-black/30 p-6 shadow-vv-soft">
                <div className="text-lg font-semibold text-amber-300">{item.title}</div>
                <div className="mt-2 text-sm text-white/70">{item.notes}</div>
                <Link
                  href={item.path}
                  className="mt-5 inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:border-amber-300/50 hover:bg-amber-500/20"
                >
                  Open {item.path}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
