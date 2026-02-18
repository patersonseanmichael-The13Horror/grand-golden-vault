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
    <div className="min-h-dvh flex flex-col">
      <header className="px-6 py-5 md:px-10 flex items-center justify-between">
        <Link href="/" className="group inline-flex items-baseline gap-3">
          <div className="h-9 w-9 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-vv-soft" />
          <div>
            <div className="text-sm tracking-[0.22em] uppercase text-white/70">The Velvet Vault</div>
            <div className="text-xs tracking-[0.30em] uppercase text-white/45">Digital E-Lounge</div>
          </div>
        </Link>
        <div className="flex items-center gap-3">{rightAction}</div>
      </header>
      <main className="flex-1">{children}</main>
      <FooterLegal />
    </div>
  );
}
