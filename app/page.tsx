import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  CheckCircle, 
  TrendingUp, 
  Flame, 
  ShieldCheck, 
  UploadCloud, 
  Laptop, 
  Eye, 
  Download,
  Users
} from "lucide-react";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/product-card";
import CategoryCard from "@/components/category-card";
import HeroCollage from "@/components/hero-collage";
import { ProductWithRelations, CategoryWithCount } from "@/types";

export const revalidate = 0; // Fresh database data

export default async function HomePage() {
  // 1. Fetch categories with product counts
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: { products: { where: { status: "PUBLISHED" } } },
      },
    },
  });

  // 2. Fetch Featured Products
  const featuredProducts = await prisma.product.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    include: {
      category: true,
      creator: {
        include: {
          creatorProfile: true,
        },
      },
    },
    take: 6,
    orderBy: { salesCount: "desc" },
  });

  // 3. Fetch Trending Products (based on sales and views count)
  const trendingProducts = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: {
      category: true,
      creator: {
        include: {
          creatorProfile: true,
        },
      },
    },
    take: 6,
    orderBy: [{ salesCount: "desc" }, { viewsCount: "desc" }],
  });

  // 4. Fetch Featured Creators with their published products count
  const featuredCreators = await prisma.user.findMany({
    where: {
      role: "CREATOR",
      creatorProfile: {
        isNot: null,
      },
    },
    include: {
      creatorProfile: true,
      products: {
        where: { status: "PUBLISHED" },
        select: { id: true },
      },
    },
    take: 4,
  });

  return (
    <div className="flex flex-col gap-20 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-zinc-200/80 bg-gradient-to-b from-white via-zinc-50/50 to-[#FAFAFC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill announcement badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-brand-600" />
              <span>The Independent Framer Templates Marketplace</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl leading-[1.15]">
              Find the perfect template.{" "}
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-blue bg-clip-text text-transparent">
                Build something extraordinary.
              </span>
            </h1>

            {/* Supporting text */}
            <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
              Discover premium Framer templates and website designs made by independent creators.
              Remix into your Framer workspace in seconds.
            </p>

            {/* Prominent Search Bar */}
            <div className="max-w-xl mx-auto pt-2">
              <form
                action="/explore"
                method="GET"
                className="relative flex items-center rounded-2xl border-2 border-zinc-200 bg-white p-1.5 shadow-lg shadow-zinc-200/50 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all"
              >
                <Search className="ml-3 h-5 w-5 text-zinc-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search templates (e.g. SaaS, AI, Dark Mode, Minimal)..."
                  className="w-full bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 hover:shadow-lg transition-all"
              >
                <span>Explore Templates</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/register?role=creator"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 shadow-sm transition-all"
              >
                <UploadCloud className="h-4 w-4 text-brand-600" />
                <span>Start Selling</span>
              </Link>
            </div>
          </div>

          {/* Visual Collage Component */}
          <div className="mt-14 sm:mt-16">
            <HeroCollage />
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Browse by Category
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Templates tailored for every industry, from high-growth tech to boutique studios.
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View all categories</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category as unknown as CategoryWithCount} />
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-600" />
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                Featured Templates
              </h2>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Hand-picked by our editorial team for exceptional craftsmanship and visual design.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 bg-white border border-zinc-200 hover:bg-zinc-50 px-4 py-2 rounded-xl shadow-sm transition-colors"
          >
            <span>View All Templates</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product as unknown as ProductWithRelations}
            />
          ))}
        </div>
      </section>

      {/* 4. TRENDING TEMPLATES SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-zinc-900 text-white p-6 sm:p-10 lg:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-zinc-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-rose-500" />
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Trending on FrameMarket
                </h2>
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                Ranked by real user demand, downloads, and designer ratings this week.
              </p>
            </div>

            <Link
              href="/explore?sort=popular"
              className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1"
            >
              <span>Explore leaderboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product as unknown as ProductWithRelations}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED CREATORS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-600" />
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                Featured Creators
              </h2>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Meet top-tier designers shaping the Framer ecosystem worldwide.
            </p>
          </div>

          <Link
            href="/register?role=creator"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Apply to become a creator</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredCreators.map((creator) => (
            <div
              key={creator.id}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-3">
                  {creator.avatarUrl ? (
                    <img
                      src={creator.avatarUrl}
                      alt={creator.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-brand-100"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                      {creator.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-zinc-900 group-hover:text-brand-600 transition-colors">
                        {creator.creatorProfile?.storeName || creator.name}
                      </h4>
                      {creator.creatorProfile?.verified && (
                        <CheckCircle className="h-3.5 w-3.5 text-brand-600" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">{creator.name}</p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                  {creator.creatorProfile?.bio || creator.bio || "Professional Framer designer."}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">
                  {creator.products.length} {creator.products.length === 1 ? "template" : "templates"}
                </span>

                <Link
                  href={`/creators/${creator.id}`}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100/70 px-3 py-1.5 rounded-lg transition-colors"
                >
                  View Store
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            How FrameMarket Works
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            A seamless marketplace built specifically for the Framer creator economy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Buyers */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-card space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-zinc-900">For Buyers</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                  1
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">Explore & Filter Templates</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Search across SaaS, Portfolio, and Agency categories with live responsive filters.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                  2
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">Preview Design in Real-time</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Test the live template in Desktop, Tablet, and Mobile viewport modes before purchasing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                  3
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">Secure Checkout</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Pay securely in Indian Rupees (INR) or international cards with server-verified sessions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                  4
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">Instant Access & Framer Remix</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Receive your authenticated license key, ZIP assets, and direct Framer Remix link.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* For Creators */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-card space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-zinc-900">For Creators</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                  1
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">Create Creator Profile</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Set up your custom storefront with your branding, bio, and social portfolio links.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                  2
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">Upload Your Template</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Multi-step upload wizard for screenshots, demo URLs, Framer remix links, and assets.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                  3
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">Publish & Reach Global Buyers</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Fast moderation queue ensures platform quality and exposes your template to thousands.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                  4
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">Earn 90% Net Revenue & Fast Payouts</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Industry-leading 90% creator share with automated ledger tracking and UPI/Bank payouts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-blue px-6 py-14 sm:px-12 sm:py-20 text-center text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Your next great website starts here.
            </h2>
            <p className="text-base text-indigo-100 leading-relaxed">
              Join hundreds of companies, startups, and agencies launching modern Framer websites in record time.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/explore"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 shadow-lg transition-colors"
              >
                Explore Marketplace
              </Link>
              <Link
                href="/register?role=creator"
                className="rounded-xl bg-indigo-950/60 border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-950/80 transition-colors"
              >
                Become a Creator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
