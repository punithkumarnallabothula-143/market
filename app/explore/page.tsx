import { Suspense } from "react";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/product-card";
import SearchFilterBar from "@/components/search-filter-bar";
import { ProductWithRelations, CategoryWithCount } from "@/types";
import { Sparkles, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

interface ExplorePageProps {
  searchParams: {
    q?: string;
    cat?: string;
    price?: string; // "all", "free", "paid"
    sort?: string;  // "popular", "newest", "rating", "price_asc", "price_desc"
    min?: string;
    max?: string;
  };
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { q, cat, price, sort, min, max } = searchParams;

  // 1. Fetch all categories for filter dropdown
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: { products: { where: { status: "PUBLISHED" } } },
      },
    },
  });

  // 2. Build Prisma where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    status: "PUBLISHED",
  };

  // Keyword search (title, shortDesc, description)
  if (q && q.trim()) {
    where.OR = [
      { title: { contains: q.trim() } },
      { shortDesc: { contains: q.trim() } },
      { description: { contains: q.trim() } },
      { creator: { name: { contains: q.trim() } } },
    ];
  }

  // Category filter
  if (cat && cat.trim()) {
    where.category = {
      slug: cat.trim(),
    };
  }

  // Free vs Paid filter
  if (price === "free") {
    where.isFree = true;
  } else if (price === "paid") {
    where.isFree = false;
  }

  // Min / Max Price
  const minNum = min ? parseInt(min, 10) : undefined;
  const maxNum = max ? parseInt(max, 10) : undefined;
  if (minNum !== undefined || maxNum !== undefined) {
    where.price = {};
    if (!isNaN(minNum as number)) where.price.gte = minNum;
    if (!isNaN(maxNum as number)) where.price.lte = maxNum;
  }

  // 3. Build Prisma orderBy
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = [{ salesCount: "desc" }, { viewsCount: "desc" }];
  if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  } else if (sort === "rating") {
    orderBy = [{ rating: "desc" }, { reviewCount: "desc" }];
  } else if (sort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { price: "desc" };
  }

  // 4. Fetch filtered products
  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      creator: {
        include: {
          creatorProfile: true,
        },
      },
    },
  });

  const activeCategoryObj = cat ? categories.find((c) => c.slug === cat) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
          <Sparkles className="h-4 w-4" />
          <span>Framer Templates Catalog</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          {activeCategoryObj ? activeCategoryObj.name : "Explore Marketplace"}
        </h1>
        <p className="text-sm text-zinc-600 max-w-2xl">
          {activeCategoryObj?.description ||
            "Browse, preview, and remix the highest quality Framer website templates created by vetted designers worldwide."}
        </p>
      </div>

      {/* Filter and Search Bar Component */}
      <Suspense fallback={<div className="h-12 w-full animate-pulse rounded-2xl bg-zinc-200" />}>
        <SearchFilterBar categories={categories as unknown as CategoryWithCount[]} />
      </Suspense>

      {/* Results Count & Product Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-200/80 pb-3">
          <span>
            Showing <strong className="text-zinc-900 font-semibold">{products.length}</strong> {products.length === 1 ? "template" : "templates"}
          </span>
          {activeCategoryObj && (
            <Link href="/explore" className="text-brand-600 hover:underline">
              Show all categories
            </Link>
          )}
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-16 text-center shadow-sm space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900">No templates found</h3>
              <p className="text-xs text-zinc-500 max-w-sm">
                We couldn't find any templates matching your search criteria. Try adjusting your keywords, price filters, or category.
              </p>
            </div>
            <Link
              href="/explore"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
            >
              Reset All Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product as unknown as ProductWithRelations}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
