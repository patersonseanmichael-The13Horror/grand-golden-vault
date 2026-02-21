import Link from "next/link";
import FooterLegal from "./FooterLegal";

export default function VaultShell({
  children,
  rightAction,
}: {
  children: React.ReactNode;
  rightAction?: React.ReactNode;
}) {
  return (
    <div className="vv-shell min-h-dvh flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(900px_480px_at_50%_-80px,rgba(201,164,92,0.14),transparent_68%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(620px_240px_at_50%_0,rgba(244,229,161,0.16),transparent_72%)]" />
      <header className="sticky top-0 z-30 border-b border-[rgba(201,164,92,0.18)] bg-[rgba(7,7,10,0.74)] backdrop-blur-xl">
        <div className="vv-page-wrap py-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-2xl border border-[rgba(201,164,92,0.4)] bg-[radial-gradient(circle_at_30%_25%,rgba(255,239,195,0.27),rgba(70,45,18,0.86))] shadow-vv-soft transition-transform duration-300 group-hover:scale-105">
              <div className="absolute inset-[6px] rounded-xl border border-[rgba(255,232,177,0.5)]" />
            </div>
            <div>
              <div className="vv-display text-sm tracking-[0.22em] uppercase text-gold-solid group-hover:text-[#f1d293] transition-colors">
                Grand Golden Vault
              </div>
              <div className="text-[10px] tracking-[0.34em] uppercase text-white/48">Institutional Royal Access</div>
            </div>
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3">{rightAction}</div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <FooterLegal />
    </div>
  );
}
