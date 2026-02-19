import VaultShell from "@/components/VaultShell";
import HeroBackdrop from "@/components/HeroBackdrop";

export default function ContactPage() {
  return (
    <VaultShell>
      <section className="relative px-6 md:px-10 pt-12 pb-16">
        <HeroBackdrop src="/assets/images/vault-entry.jpg" alt="Contact" />
        <div className="max-w-4xl mx-auto">
          <div className="text-xs tracking-[0.35em] uppercase text-white/55">Contact</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-gold">Get in Touch</h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            Our partnership team is here to assist you with deposits, bonuses, VIP services, and any questions you may have.
          </p>

          {/* Contact Information */}
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            
            {/* Email Contact */}
            <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-900/10 to-purple-900/10 backdrop-blur-md p-8 shadow-vv-soft">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Email Us</h2>
                  <p className="text-sm text-white/60">Partnership & Support</p>
                </div>
              </div>
              
              <a 
                href="mailto:VGTPartnership@outlook.com"
                className="block text-2xl font-bold text-amber-400 hover:text-amber-300 transition mb-4"
              >
                VGTPartnership@outlook.com
              </a>
              
              <p className="text-sm text-white/70 mb-4">
                Our team typically responds within 24 hours during business days.
              </p>

              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <p>Deposit arrangements</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <p>Bonus approvals</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <p>VIP services</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <p>General inquiries</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-pink-900/10 backdrop-blur-md p-8 shadow-vv-soft">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Links</h2>
              
              <div className="space-y-4">
                <a 
                  href="/terms"
                  className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center group-hover:scale-110 transition">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Terms & Conditions</div>
                    <div className="text-xs text-white/60">Read our terms</div>
                  </div>
                </a>

                <a 
                  href="/privacy"
                  className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Privacy Policy</div>
                    <div className="text-xs text-white/60">Your data protection</div>
                  </div>
                </a>

                <a 
                  href="/responsible"
                  className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center group-hover:scale-110 transition">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Responsible Gaming</div>
                    <div className="text-xs text-white/60">Play responsibly</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-10 rounded-3xl border border-cyan-500/20 bg-cyan-950/10 p-8">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How do I make a deposit?</h3>
                <p className="text-white/70 text-sm">
                  Contact us at VGTPartnership@outlook.com to arrange your deposit. Our team will guide you through the secure deposit process and apply your 50% bonus upon approval.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How long does manual approval take?</h3>
                <p className="text-white/70 text-sm">
                  Deposit approvals are typically processed within 24-48 hours during business days. You&apos;ll receive an email confirmation once your deposit and bonus are credited.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What are the VIP tier perks?</h3>
                <p className="text-white/70 text-sm">
                  VIP members receive priority support, enhanced reward rates, exclusive tournament access, personalized bonuses, and faster withdrawal processing.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Can I claim both bonuses?</h3>
                <p className="text-white/70 text-sm">
                  No, you can only choose one welcome offer. We recommend the First Deposit Bonus for better value and VIP perks.
                </p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-10 text-center rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-purple-950/30 p-8">
            <h2 className="text-2xl font-bold text-gold mb-3">Ready to Get Started?</h2>
            <p className="text-white/70 mb-6">
              Contact our partnership team today to arrange your deposit and unlock exclusive VIP benefits.
            </p>
            <a
              href="mailto:VGTPartnership@outlook.com"
              className="inline-block rounded-full bg-gradient-to-r from-amber-600 to-amber-500 px-8 py-4 text-gray-900 font-bold text-lg transition-all hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70 hover:scale-105"
            >
              Email Us Now
            </a>
          </div>
        </div>
      </section>
    </VaultShell>
  );
}
