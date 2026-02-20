import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  href?: string;
  label: string;
  variant?: "gold" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function LuxeButton({ href, label, variant = "ghost", onClick, type = "button", disabled = false }: Props) {
  const base =
    "relative inline-flex items-center justify-center rounded-2xl px-5 py-3 text-xs md:text-sm tracking-[0.2em] uppercase transition duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(255,236,178,0.35)] active:scale-[0.985]";
  const styles =
    variant === "gold"
      ? "border border-[rgba(231,197,123,0.7)] bg-[linear-gradient(165deg,#f4dc9f_0%,#cda45f_45%,#a37e3e_100%)] text-[#1e1608] shadow-[0_10px_26px_rgba(185,146,78,0.4)] hover:brightness-105"
      : "border border-white/18 bg-[linear-gradient(160deg,rgba(255,255,255,0.11),rgba(255,255,255,0.04))] text-white/90 hover:bg-[linear-gradient(160deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06))]";

  if (href)
    return (
      <Link href={href} className={cn(base, styles)}>
        <span className="relative z-10">{label}</span>
      </Link>
    );

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn(base, styles, disabled && "opacity-50 cursor-not-allowed")}>
      <span className="relative z-10">{label}</span>
    </button>
  );
}
