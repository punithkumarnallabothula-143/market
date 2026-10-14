export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-xs text-zinc-500">Last updated: October 2026</p>
      </div>

      <div className="prose prose-zinc text-xs text-zinc-600 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when registering an account, purchasing a template,
            submitting a product, or contacting customer support (e.g. name, email address, payment confirmation identifiers).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900">2. How We Use Information</h2>
          <p>
            We use the information collected to fulfill orders, issue cryptographic license keys, securely authenticate
            download requests, process creator payouts, prevent fraudulent chargebacks, and communicate platform updates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900">3. Data Security & Storage</h2>
          <p>
            Your account passwords are protected using industry-standard bcrypt hashing. Payment transactions are processed
            through certified PCI-DSS compliant providers. We do not store raw credit card numbers on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900">4. Your Data Rights</h2>
          <p>
            You have the right to request access to your personal data, update your information in your dashboard settings,
            or request permanent account deletion subject to legal tax retention requirements.
          </p>
        </section>
      </div>
    </div>
  );
}
