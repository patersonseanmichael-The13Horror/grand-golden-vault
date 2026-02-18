import Link from "next/link";

const games = [
  { name: "Slots Gallery", href: "/slots", note: "25 elite machines, curated." },
  { name: "Blackjack", href: "/games/blackjack", note: "Classic restraint. Sharp edges." },
  { name: "Roulette", href: "/games/roulette", note: "Ceremony of chance." },
  { name: "Poker", href: "/games/poker", note: "Composure under pressure." },
  { name: "Dice Verera", href: "/games/dice-verera", note: "A new house ritual (forthcoming)." },
];

export default function GameGallery() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-vv-soft">
      <div className="text-xs tracking-[0.30em] uppercase text-white/60">The Floor • Rooms</div>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {games.map((g) => (
          <Link
            key={g.name}
            href={g.href}
            className="group rounded-3xl border border-white/10 bg-black/20 p-6 hover:bg-black/30 transition"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div className="text-xl text-white/85">{g.name}</div>
              <div className="text-xs tracking-[0.22em] uppercase text-white/45">Enter</div>
            </div>
            <div className="mt-3 text-sm text-white/65 leading-relaxed">{g.note}</div>
            <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="mt-4 text-xs tracking-[0.25em] uppercase text-white/50">Discreet • Polished • Controlled</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
