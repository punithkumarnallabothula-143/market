import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import ProductCard from "@/components/product-card";
import { ProductWithRelations } from "@/types";

export const revalidate = 0;

export default async function FavoritesPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      product: {
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
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Saved Favorites</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Templates you’ve bookmarked for your upcoming client or personal projects.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-12 text-center space-y-4 shadow-card">
          <Heart className="h-10 w-10 text-zinc-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-900">No favorites saved yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Click the heart icon on any template card in the explore page to save it for quick reference.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 shadow-sm"
          >
            Explore Templates
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <ProductCard
              key={fav.id}
              product={fav.product as unknown as ProductWithRelations}
              initialFavorited={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
