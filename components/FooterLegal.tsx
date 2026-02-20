import Link from "next/link";

export default function FooterLegal() {
  return (
    <footer className="border-t border-white/8 text-xs text-white/55">
      <div className="vv-page-wrap py-8">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="tracking-[0.14em] uppercase">Discretion • Dignity • Control</div>
          <div className="flex flex-wrap gap-5">
            <Link className="hover:text-white/80 transition" href="/terms">Terms</Link>
            <Link className="hover:text-white/80 transition" href="/privacy">Privacy</Link>
            <Link className="hover:text-white/80 transition" href="/responsible">Responsible</Link>
            <Link className="hover:text-amber-400 transition font-semibold" href="/contact">Contact Us</Link>
          </div>
        </div>
        <div className="mt-4 text-white/40 leading-relaxed">
          This platform is a private digital lounge. Where applicable, access may be restricted by jurisdiction and eligibility.
        </div>
        <div className="mt-3 text-white/30 text-[10px]">
          For support and partnership inquiries:{" "}
          <a href="mailto:VGTPartnership@outlook.com" className="text-amber-400/70 hover:text-amber-400 transition">
            VGTPartnership@outlook.com
          </a>
        </div>
      </div>
    </footer>
  );
}
