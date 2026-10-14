import Link from "next/link";
import { Sparkles, Shield, Heart, Zap, Users, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200 px-3.5 py-1 text-xs font-semibold text-brand-700">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
          Empowering designers and founders to build extraordinary websites.
        </h1>
        <p className="text-base text-zinc-600 leading-relaxed">
          FrameMarket was founded on a simple conviction: design quality should not be bottlenecked by repetitive code or prohibitive agency fees.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-card space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">Craftsmanship First</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Every template submitted to FrameMarket is vetted by senior designers for responsive fidelity, CMS flexibility, and silky smooth animations.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-card space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">Creator Fair Share</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            We operate on a transparent 90/10 model, letting creators retain the vast majority of their earnings rather than losing 40-50% to traditional legacy stores.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-card space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">Instant Verification</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Every purchase automatically produces a cryptographic license key, instant Framer remix duplication, and verified customer download entitlement.
          </p>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-xs text-zinc-500 leading-relaxed space-y-2">
        <p className="font-bold text-zinc-800">Independent Marketplace Notice</p>
        <p>
          FrameMarket is an independent marketplace for digital products created for use with Framer.
          We are not affiliated with, endorsed by, or sponsored by Framer B.V. Framer is a registered
          trademark of Framer B.V.
        </p>
      </div>
    </div>
  );
}
