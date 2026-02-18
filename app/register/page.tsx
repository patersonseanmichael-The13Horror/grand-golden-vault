import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";
import LuxeButton from "@/components/LuxeButton";

export default function Register() {
  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/vault-entry.jpg" alt="Vault Entry" />
        <div className="max-w-xl mx-auto rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md p-8 shadow-vv-soft">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">Request Entry</div>
          <h1 className="mt-4 text-3xl font-semibold">Registration</h1>
          <p className="mt-4 text-white/70">Firebase registration UI plugs in here. Capture consent for Terms/Privacy/Responsible Conduct.</p>
          <div className="mt-8 flex gap-3">
            <LuxeButton href="/login" label="Login" />
            <LuxeButton href="/members" label="Proceed (Demo)" variant="gold" />
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
