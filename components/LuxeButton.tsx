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
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm tracking-[0.18em] uppercase transition focus:outline-none focus:ring-2 focus:ring-white/20";
  const styles =
    variant === "gold"
      ? "bg-[color:var(--vv-gold)] text-black hover:brightness-110"
      : "border border-white/12 bg-white/5 text-white/85 hover:bg-white/8";

  if (href) return <Link href={href} className={cn(base, styles)}>{label}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cn(base, styles, disabled && "opacity-50 cursor-not-allowed")}>{label}</button>;
}
