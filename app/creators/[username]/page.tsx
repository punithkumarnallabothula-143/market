import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Globe, Twitter, Layers, Star, ShoppingBag, ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/product-card";
import { ProductWithRelations } from "@/types";

export const revalidate = 0;

interface CreatorProfilePageProps {
  params: {
    username: string;
  };
}

export default async function CreatorProfilePage({ params }: CreatorProfilePageProps) {
  // Find creator by user ID or storeName slug
  const creator = await prisma.user.findFirst({
    where: {
      OR: [
        { id: params.username },
        { email: params.username },
      ],
    },
    include: {
      creatorProfile: true,
      products: {
        where: { status: "PUBLISHED" },
        include: {
          category: true,
          creator: {
            include: {
              creatorProfile: true,
            },
          },
        },
        orderBy: { salesCount: "desc" },
      },
    },
  });

  if (!creator || creator.role !== "CREATOR") {
    // If not found by ID, try finding creator by id or first creator
    const fallbackCreator = await prisma.user.findFirst({
      where: { role: "CREATOR" },
      include: {
        creatorProfile: true,
        products: {
          where: { status: "PUBLISHED" },
          include: {
            category: true,
            creator: {
              include: {
                creatorProfile: true,
              },
            },
          },
        },
      },
    });

    if (!fallbackCreator) notFound();
    return renderCreator(fallbackCreator);
  }

  return renderCreator(creator);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderCreator(creator: any) {
  const profile = creator.creatorProfile;
  const products = creator.products;

  const totalReviews = products.reduce((acc: number, p: any) => acc + p.reviewCount, 0);
  const avgRating =
    products.length > 0
      ? (products.reduce((acc: number, p: any) => acc + p.rating, 0) / products.length).toFixed(1)
      : "5.0";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Explore</span>
      </Link>

      {/* Creator Header Banner */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-10 shadow-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {creator.avatarUrl ? (
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="h-20 w-20 rounded-2xl object-cover border-2 border-brand-100 shadow-md"
              />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-2xl">
                {creator.name.charAt(0)}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  {profile?.storeName || creator.name}
                </h1>
                {profile?.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/60">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Creator
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-zinc-500">Curated by {creator.name}</p>
            </div>
          </div>

          {/* Social and Portfolio links */}
          <div className="flex items-center gap-3">
            {profile?.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <Globe className="h-4 w-4 text-zinc-400" />
                <span>Website</span>
              </a>
            )}
            {profile?.twitter && (
              <a
                href={profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <Twitter className="h-4 w-4 text-zinc-400" />
                <span>Twitter / X</span>
              </a>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile?.bio && (
          <p className="mt-6 text-sm text-zinc-600 max-w-3xl leading-relaxed border-t border-zinc-100 pt-5">
            {profile.bio}
          </p>
        )}

        {/* Creator KPIs */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-100 pt-5">
          <div className="rounded-2xl bg-zinc-50 p-3.5">
            <span className="text-[11px] font-medium text-zinc-400">Total Templates</span>
            <p className="text-lg font-bold text-zinc-900">{products.length}</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-3.5">
            <span className="text-[11px] font-medium text-zinc-400">Total Sales</span>
            <p className="text-lg font-bold text-zinc-900">{profile?.totalSales || 0}+</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-3.5">
            <span className="text-[11px] font-medium text-zinc-400">Average Rating</span>
            <p className="text-lg font-bold text-zinc-900 flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{avgRating}</span>
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-3.5">
            <span className="text-[11px] font-medium text-zinc-400">Verified Reviews</span>
            <p className="text-lg font-bold text-zinc-900">{totalReviews}</p>
          </div>
        </div>
      </div>

      {/* Creator's Published Templates Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          Templates by {profile?.storeName || creator.name}
        </h2>

        {products.length === 0 ? (
          <p className="text-xs text-zinc-500">This creator has not published templates yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
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
