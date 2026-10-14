"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Sparkles, 
  Heart, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  ShoppingBag, 
  UploadCloud, 
  ShieldCheck, 
  Menu, 
  X,
  ExternalLink
} from "lucide-react";
import { UserSession } from "@/types";

interface NavbarProps {
  user?: UserSession | null;
  favoriteCount?: number;
}

export default function Navbar({ user, favoriteCount = 0 }: NavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-blue text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-zinc-900 group-hover:text-brand-600 transition-colors">
                FrameMarket
              </span>
              <span className="text-[10px] -mt-1 font-medium text-zinc-500">
                Framer Template Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
            <Link href="/explore" className="hover:text-zinc-900 transition-colors">
              Explore
            </Link>
            <Link href="/explore?cat=saas-startups" className="hover:text-zinc-900 transition-colors">
              Categories
            </Link>
            <Link href="/pricing" className="hover:text-zinc-900 transition-colors">
              Pricing & Fees
            </Link>
            <Link href="/about" className="hover:text-zinc-900 transition-colors">
              About
            </Link>
          </nav>
        </div>

        {/* Global Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search templates, SaaS, portfolio, AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-zinc-200 bg-zinc-50/70 pl-10 pr-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </form>
        </div>

        {/* Right CTA / Auth controls */}
        <div className="flex items-center gap-3">
          {/* Become a creator shortcut */}
          {(!user || user.role === "BUYER") && (
            <Link
              href={user ? "/dashboard/settings" : "/register?role=creator"}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100/80 px-3 py-1.5 rounded-full transition-colors"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Start Selling</span>
            </Link>
          )}

          {/* Favorites Link */}
          <Link
            href="/dashboard/favorites"
            className="relative p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
            title="Your Favorites"
          >
            <Heart className="h-5 w-5" />
            {favoriteCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {favoriteCount}
              </span>
            )}
          </Link>

          {/* User profile / Login state */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-100 transition-colors border border-zinc-200"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-xs">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-medium text-zinc-700 max-w-[100px] truncate">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-zinc-200 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                    <p className="text-xs font-semibold text-zinc-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-zinc-500" />
                    Buyer Dashboard
                  </Link>
                  <Link
                    href="/dashboard/purchases"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors"
                  >
                    <ShoppingBag className="h-4 w-4 text-zinc-500" />
                    My Purchases & Files
                  </Link>

                  {(user.role === "CREATOR" || user.role === "ADMIN") && (
                    <Link
                      href="/creator/dashboard"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50/70 rounded-xl transition-colors"
                    >
                      <UploadCloud className="h-4 w-4 text-indigo-600" />
                      Creator Portal
                    </Link>
                  )}

                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 rounded-xl transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4 text-amber-600" />
                      Admin Control Panel
                    </Link>
                  )}

                  <div className="border-t border-zinc-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 px-3.5 py-2 rounded-full shadow-sm hover:shadow transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 py-2 text-sm text-zinc-900"
            />
          </form>
          <div className="flex flex-col space-y-2 text-sm font-medium text-zinc-700">
            <Link href="/explore" onClick={() => setIsMenuOpen(false)} className="py-1">
              Explore Templates
            </Link>
            <Link href="/explore?cat=saas-startups" onClick={() => setIsMenuOpen(false)} className="py-1">
              Categories
            </Link>
            <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="py-1">
              Seller Fees & Pricing
            </Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="py-1">
              About FrameMarket
            </Link>
            <Link href="/faq" onClick={() => setIsMenuOpen(false)} className="py-1">
              FAQ
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
