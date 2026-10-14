import Link from "next/link";
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Zap, DollarSign, HelpCircle } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200 px-3.5 py-1 text-xs font-semibold text-brand-700">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Simple, Creator-First Economics</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
          Keep 90% of everything you earn.
        </h1>
        <p className="text-base text-zinc-600 leading-relaxed">
          No monthly subscription fees. No hidden listing charges. We only succeed when your templates sell.
        </p>
      </div>

      {/* Main Commission Model Card */}
      <div className="max-w-4xl mx-auto rounded-3xl border-2 border-brand-500/20 bg-gradient-to-b from-white to-brand-50/20 p-8 sm:p-12 shadow-xl shadow-brand-500/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Standard Plan</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-zinc-900">10%</span>
              <span className="text-sm font-semibold text-zinc-500">Platform Commission</span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Every time a buyer purchases your Framer template, you receive 90% directly credited to your creator balance.
            </p>

            <ul className="space-y-2.5 text-xs text-zinc-700 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Zero upfront listing fees</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Unlimited template uploads and updates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Instant automated license key delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Fast UPI and Bank wire payouts in India</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>In-depth sales analytics and customer insights</span>
              </li>
            </ul>

            <div className="pt-4">
              <Link
                href="/register?role=creator"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-xs font-bold text-white hover:bg-brand-700 shadow-md transition-all"
              >
                <span>Apply as a Creator</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Breakdown Calculator */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900">Example Payout Breakdown</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-zinc-100">
                <span className="text-zinc-600">Template Selling Price:</span>
                <span className="font-bold text-zinc-900">₹2,000</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-100 text-rose-600">
                <span>Platform Commission (10%):</span>
                <span>- ₹200</span>
              </div>
              <div className="flex justify-between py-3 bg-emerald-50 px-3 rounded-xl text-emerald-800 font-bold text-sm">
                <span>Your Net Payout (90%):</span>
                <span>₹1,800</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 italic">
              * Payment processor charges (such as standard gateway fees) are covered within platform margins where feasible.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Mini Section */}
      <div className="max-w-3xl mx-auto space-y-6 pt-6">
        <h2 className="text-xl font-bold text-zinc-900 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-1.5">
            <h4 className="text-xs font-bold text-zinc-900">When and how do I receive payouts?</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Creators can request payouts as soon as their available balance exceeds ₹1,000. Payouts are transferred via UPI or Direct Bank Transfer within 3 to 5 business days.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-1.5">
            <h4 className="text-xs font-bold text-zinc-900">Can I sell the same template elsewhere?</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Yes! FrameMarket is non-exclusive. You own 100% of your intellectual property and design rights. You are free to distribute your templates on your own personal website or other channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
