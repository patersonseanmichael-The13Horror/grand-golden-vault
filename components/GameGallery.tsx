import Link from "next/link";

const games = [
  { name: "Slots Gallery", href: "/slots", note: "Premium machines with vertical reels and Hold & Win features." },
  { name: "Blackjack", href: "/blackjack", note: "Classic Vegas rules with split, double down, and insurance." },
  { name: "Roulette", href: "/roulette", note: "European wheel with authentic betting board and payouts." },
  { name: "Poker", href: "/poker", note: "Texas Hold'em with AI opponents and strategic gameplay." },
  { name: "Bonus Vault", href: "/bonus", note: "Claim rotating promotions and member-only event rewards." },
  { name: "Loyalty Check-In", href: "/check-in", note: "Track daily streaks and monitor VIP progress from deposits." },
];

export default function GameGallery() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-vv-soft">
      <div className="text-xs tracking-[0.30em] uppercase text-white/60">The Floor • Premium Tables</div>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {games.map((g) => (
          <Link
            key={g.name}
            href={g.href}
            className="group rounded-3xl border border-white/10 bg-black/20 p-6 hover:bg-black/30 hover:border-amber-500/30 transition"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div className="text-xl text-white/85 group-hover:text-amber-400 transition">{g.name}</div>
              <div className="text-xs tracking-[0.22em] uppercase text-white/45 group-hover:text-amber-400 transition">Enter</div>
            </div>
            <div className="mt-3 text-sm text-white/65 leading-relaxed">{g.note}</div>
            <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="mt-4 text-xs tracking-[0.25em] uppercase text-white/50">Luxury • Authentic • Premium</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
