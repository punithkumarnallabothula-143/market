export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Terms of Service
        </h1>
        <p className="text-xs text-zinc-500">Last updated: October 2026</p>
      </div>

      <div className="prose prose-zinc text-xs text-zinc-600 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using FrameMarket (the "Service"), you agree to be bound by these Terms of Service.
            If you disagree with any part of the terms, you may not access the Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900">2. Independent Marketplace Notice</h2>
          <p>
            FrameMarket is an independent digital marketplace facilitating transactions between independent creators
            and buyers. FrameMarket is not affiliated with, endorsed by, or sponsored by Framer B.V.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900">3. Digital Products & Delivery</h2>
          <p>
            All products sold on FrameMarket are digital goods. Upon successful payment verification, you are granted
            an authenticated license and immediate access to digital remix links and archive files.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900">4. Creator Obligations</h2>
          <p>
            Creators warrant that they own or have licensed all necessary intellectual property rights for the templates
            they submit. Uploading malicious code, trademark infringements, or unauthorized copies is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-900">5. Refunds & Chargebacks</h2>
          <p>
            Because digital templates are delivered immediately upon purchase, refund requests are evaluated on a case-by-case
            basis in instances of technical defects or misrepresentation as outlined in our Refund Policy.
          </p>
        </section>
      </div>
    </div>
  );
}
