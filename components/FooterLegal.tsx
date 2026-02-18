import Link from "next/link";

export default function FooterLegal() {
  return (
    <footer className="px-6 md:px-10 py-8 border-t border-white/8 text-xs text-white/55">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="tracking-[0.14em] uppercase">Discretion • Dignity • Control</div>
        <div className="flex gap-5">
          <Link className="hover:text-white/80" href="/terms">Terms</Link>
          <Link className="hover:text-white/80" href="/privacy">Privacy</Link>
          <Link className="hover:text-white/80" href="/responsible">Responsible</Link>
        </div>
      </div>
      <div className="mt-4 text-white/40 leading-relaxed">
        This platform is a private digital lounge. Where applicable, access may be restricted by jurisdiction and eligibility.
      </div>
    </footer>
  );
}
