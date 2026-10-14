"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle, ShieldCheck, UploadCloud, ShoppingBag } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      if (redirect === "/dashboard") {
        if (data.user?.role === "ADMIN") {
          router.push("/admin");
        } else if (data.user?.role === "CREATOR") {
          router.push("/creator/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push(redirect);
      }
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Sign in to FrameMarket</h1>
          <p className="text-xs text-zinc-500">Access your templates, purchases, and creator analytics</p>
        </div>

        <div className="rounded-2xl bg-zinc-50 border border-zinc-200/70 p-3 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            One-Click Demo Credentials:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount("buyer@framemarket.dev", "BuyerPassword123!")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white py-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 hover:border-brand-300 transition-colors shadow-2xs"
            >
              <ShoppingBag className="h-3 w-3 text-emerald-600" />
              <span>Buyer</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("elena@framemarket.dev", "CreatorPassword123!")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white py-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 hover:border-brand-300 transition-colors shadow-2xs"
            >
              <UploadCloud className="h-3 w-3 text-indigo-600" />
              <span>Creator</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("admin@framemarket.dev", "AdminPassword123!")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white py-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 hover:border-brand-300 transition-colors shadow-2xs"
            >
              <ShieldCheck className="h-3 w-3 text-amber-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200/80 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 pl-10 pr-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-zinc-700">Password</label>
              <Link href="/forgot-password" className="text-[11px] font-medium text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 pl-10 pr-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 disabled:opacity-50 transition-all"
          >
            <span>{loading ? "Authenticating..." : "Sign In"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500 border-t border-zinc-100 pt-4">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-400">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
