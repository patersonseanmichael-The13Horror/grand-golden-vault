import { vipTiers } from "@/lib/loyalty";

export default function VipTiers() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-vv-soft">
      <div className="text-xs tracking-[0.30em] uppercase text-white/60">VIP Rankings • Progression Tiers</div>
      <div className="mt-5 grid gap-4">
        {vipTiers.map((t) => (
          <div key={t.name} className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-baseline justify-between gap-4">
              <div className="text-lg text-white/85">{t.name}</div>
              <div className="text-xs tracking-[0.22em] uppercase text-white/45">{t.note}</div>
            </div>
            <ul className="mt-3 text-sm text-white/65 list-disc pl-5 space-y-1">
              {t.perks.map((p) => <li key={p}>{p}</li>)}
            <li className="list-none pt-2 text-amber-300/80">
              Deposit band: ${t.minDeposit.toLocaleString()}
              {Number.isFinite(t.maxDeposit) ? ` - $${t.maxDeposit.toLocaleString()}` : "+"}
            </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
