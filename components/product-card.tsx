"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Heart, CheckCircle, ExternalLink, Eye } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { ProductWithRelations } from "@/types";

interface ProductCardProps {
  product: ProductWithRelations;
  initialFavorited?: boolean;
  onPreviewClick?: (product: ProductWithRelations) => void;
}

export default function ProductCard({
  product,
  initialFavorited = false,
  onPreviewClick,
}: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isHovered, setIsHovered] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsFavorited(!isFavorited);

    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
    } catch {
      // Revert state if request failed
      setIsFavorited(isFavorited);
    }
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-zinc-200/90 bg-white p-3 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100">
        <img
          src={product.coverImage}
          alt={product.title}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <span className="rounded-lg bg-black/75 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
            {product.category.name}
          </span>
          {product.isFree && (
            <span className="rounded-lg bg-emerald-500/90 px-2 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-md">
              FREE
            </span>
          )}
          {product.discountPrice && !product.isFree && (
            <span className="rounded-lg bg-indigo-600/90 px-2 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-md">
              SALE
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          aria-label="Save to favorites"
          className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-md backdrop-blur-md hover:bg-white hover:text-rose-500 transition-colors z-10"
        >
          <Heart
            className={`h-4 w-4 transition-transform duration-200 ${
              isFavorited ? "fill-rose-500 text-rose-500 scale-110" : ""
            }`}
          />
        </button>

        {/* Hover Quick Actions Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-2 transition-opacity duration-200 ${
            isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {product.previewUrl && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onPreviewClick) {
                  onPreviewClick(product);
                } else {
                  window.open(product.previewUrl || "#", "_blank", "noopener,noreferrer");
                }
              }}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-zinc-900 shadow-lg hover:bg-zinc-50 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>
          )}

          <Link
            href={`/templates/${product.slug}`}
            className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg hover:bg-brand-700 transition-colors"
          >
            <span>Details</span>
          </Link>
        </div>
      </div>

      {/* Product Content */}
      <div className="flex flex-1 flex-col pt-3.5 pb-1">
        {/* Creator Info */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <Link
            href={`/creators/${product.creator.id}`}
            className="flex items-center gap-2 group/creator"
          >
            {product.creator.avatarUrl ? (
              <img
                src={product.creator.avatarUrl}
                alt={product.creator.name}
                className="h-5 w-5 rounded-full object-cover"
              />
            ) : (
              <div className="h-5 w-5 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold">
                {product.creator.name.charAt(0)}
              </div>
            )}
            <span className="text-xs text-zinc-500 group-hover/creator:text-zinc-800 transition-colors truncate max-w-[140px]">
              {product.creator.creatorProfile?.storeName || product.creator.name}
            </span>
            {product.creator.creatorProfile?.verified && (
              <CheckCircle className="h-3 w-3 text-brand-600 flex-shrink-0" />
            )}
          </Link>

          {/* Reviews Rating */}
          <div className="flex items-center gap-1 text-xs font-medium text-zinc-700">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-zinc-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/templates/${product.slug}`} className="group-hover:text-brand-600 transition-colors">
          <h3 className="text-sm font-semibold text-zinc-900 line-clamp-1">
            {product.title}
          </h3>
        </Link>

        {/* Short description */}
        <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
          {product.shortDesc}
        </p>

        {/* Bottom Price and CTA */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            {product.isFree ? (
              <span className="text-sm font-bold text-emerald-600">Free</span>
            ) : (
              <>
                <span className="text-sm font-bold text-zinc-900">
                  {formatPrice(product.discountPrice || product.price, product.currency)}
                </span>
                {product.discountPrice && (
                  <span className="text-xs text-zinc-400 line-through">
                    {formatPrice(product.price, product.currency)}
                  </span>
                )}
              </>
            )}
          </div>

          <Link
            href={`/templates/${product.slug}`}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100/70 px-3 py-1.5 rounded-lg transition-colors"
          >
            {product.isFree ? "Get Free" : "Get Template"}
          </Link>
        </div>
      </div>
    </div>
  );
}
