import Link from "next/link";
import { Sparkles, ArrowUpRight, Zap, CheckCircle2 } from "lucide-react";

export default function HeroCollage() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Decorative gradient glow behind collage */}
      <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 via-indigo-500/20 to-accent-blue/20 blur-3xl -z-10 rounded-3xl" />

      {/* Main Grid Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left Card: Nova SaaS Preview */}
        <div className="md:col-span-7 rounded-2xl border border-zinc-200/80 bg-white p-2.5 shadow-xl transition-transform hover:-translate-y-1 duration-300">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-900 group">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80"
              alt="Nova SaaS Landing Page"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  <CheckCircle2 className="h-3 w-3" /> Framer CMS Ready
                </span>
                <h3 className="text-white text-base font-bold mt-1">
                  Nova SaaS Landing Page
                </h3>
                <p className="text-zinc-300 text-xs">
                  By Elena Rostova • ★ 4.9 (28 reviews)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Stack: Orbit AI & Minimal Portfolio Previews */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {/* Card 1: Orbit AI */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-2.5 shadow-lg transition-transform hover:-translate-y-1 duration-300">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-zinc-900 group">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
                alt="Orbit AI Startup"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <div>
                  <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-full">
                    AI & Technology
                  </span>
                  <h4 className="text-white text-xs font-bold mt-0.5">Orbit AI Startup</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Minimal Portfolio */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-2.5 shadow-lg transition-transform hover:-translate-y-1 duration-300">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-zinc-900 group">
              <img
                src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80"
                alt="Minimal Portfolio"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <div>
                  <span className="text-[10px] font-semibold text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded-full">
                    Portfolios
                  </span>
                  <h4 className="text-white text-xs font-bold mt-0.5">Minimal Portfolio</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badges */}
      <div className="hidden lg:flex absolute -bottom-5 -left-4 items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-md">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-zinc-900">One-Click Framer Remix</p>
          <p className="text-[11px] text-zinc-500">Duplicate straight to your Framer workspace</p>
        </div>
      </div>

      <div className="hidden lg:flex absolute -top-5 -right-4 items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-md">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
          ₹0
        </div>
        <div>
          <p className="text-xs font-bold text-zinc-900">Free Templates Included</p>
          <p className="text-[11px] text-zinc-500">Kickstart personal projects for free</p>
        </div>
      </div>
    </div>
  );
}
