"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Shield, Heart } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("You're subscribed! We'll send you curated template drops.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <footer className="border-t border-zinc-200/80 bg-white pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Brand info & Newsletter */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-blue text-white shadow-md shadow-brand-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900">
                FrameMarket
              </span>
            </Link>

            <p className="text-sm text-zinc-600 max-w-sm leading-relaxed">
              Great websites start with great templates. Discover, preview, and purchase
              world-class Framer website templates crafted by independent designers.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-2">
                Get Weekly Curated Template Drops
              </p>
              <form onSubmit={handleSubscribe} className="flex max-w-md gap-2">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  <span>{status === "loading" ? "Subscribing..." : "Subscribe"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
              {status === "success" && (
                <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {message}
                </p>
              )}
              {status === "error" && (
                <p className="mt-2 text-xs text-rose-600">{message}</p>
              )}
            </div>
          </div>

          {/* Column 1: Marketplace */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-600">
              <li>
                <Link href="/explore" className="hover:text-zinc-900 transition-colors">
                  All Templates
                </Link>
              </li>
              <li>
                <Link href="/explore?cat=saas-startups" className="hover:text-zinc-900 transition-colors">
                  SaaS & Startups
                </Link>
              </li>
              <li>
                <Link href="/explore?cat=portfolios" className="hover:text-zinc-900 transition-colors">
                  Portfolios
                </Link>
              </li>
              <li>
                <Link href="/explore?cat=agency-websites" className="hover:text-zinc-900 transition-colors">
                  Agency Websites
                </Link>
              </li>
              <li>
                <Link href="/explore?cat=ai-technology" className="hover:text-zinc-900 transition-colors">
                  AI & Tech
                </Link>
              </li>
              <li>
                <Link href="/explore?free=true" className="hover:text-zinc-900 transition-colors">
                  Free Framer Templates
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Creators */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              For Creators
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-600">
              <li>
                <Link href="/register?role=creator" className="hover:text-zinc-900 transition-colors">
                  Become a Creator
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-zinc-900 transition-colors">
                  Creator Fees (10% Model)
                </Link>
              </li>
              <li>
                <Link href="/creator/dashboard" className="hover:text-zinc-900 transition-colors">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/creator/products/new" className="hover:text-zinc-900 transition-colors">
                  Submit a Template
                </Link>
              </li>
              <li>
                <Link href="/license" className="hover:text-zinc-900 transition-colors">
                  Licensing Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-600">
              <li>
                <Link href="/about" className="hover:text-zinc-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-zinc-900 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-zinc-900 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-zinc-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-zinc-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/license" className="hover:text-zinc-900 transition-colors">
                  Template License Agreement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="mt-14 border-t border-zinc-200/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-brand-600" />
            <span>
              Disclaimer: FrameMarket is an independent marketplace for Framer-compatible templates and is not officially affiliated with or endorsed by Framer B.V.
            </span>
          </p>
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} FrameMarket. Built with{" "}
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for the creator economy.
          </p>
        </div>
      </div>
    </footer>
  );
}
