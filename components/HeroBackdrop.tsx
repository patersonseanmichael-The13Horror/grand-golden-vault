import Image from "next/image";
import { cn } from "@/lib/cn";

export default function HeroBackdrop({
  src,
  alt,
  overlay = true,
  className,
}: {
  src: string;
  alt: string;
  overlay?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden vv-hero-fallback", className)}>
      <Image src={src} alt={alt} fill priority sizes="100vw" className="scale-[1.02] object-cover" />
      {overlay && (
        <>
          <div className="absolute inset-0 bg-black/52" />
          <div className="absolute inset-0 vv-grain" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/65" />
          <div
            className="absolute inset-0 animate-glow"
            style={{
              background:
                "radial-gradient(900px 500px at 50% 20%, rgba(201,164,92,0.20), transparent 60%)",
            }}
          />
        </>
      )}
    </div>
  );
}
