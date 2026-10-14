import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  Star, 
  CheckCircle2, 
  Eye, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Share2, 
  FileCode, 
  Layers, 
  Sparkles, 
  ExternalLink, 
  Calendar, 
  AlertTriangle,
  FolderArchive,
  ArrowRight
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/currency";
import { formatDate, formatBytes } from "@/lib/utils";
import ProductCard from "@/components/product-card";
import { ProductWithRelations } from "@/types";

export const revalidate = 0;

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      creator: {
        include: {
          creatorProfile: true,
        },
      },
      images: {
        orderBy: { displayOrder: "asc" },
      },
      files: true,
      reviews: {
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product || product.status !== "PUBLISHED") {
    notFound();
  }

  // Parse JSON fields
  let includedPages: string[] = [];
  try {
    if (product.includedPages) {
      includedPages = JSON.parse(product.includedPages);
    }
  } catch (e) {
    includedPages = [];
  }

  let featuresList: string[] = [];
  try {
    if (product.features) {
      featuresList = JSON.parse(product.features);
    }
  } catch (e) {
    featuresList = [];
  }

  // Fetch related products in the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: "PUBLISHED",
    },
    include: {
      category: true,
      creator: {
        include: {
          creatorProfile: true,
        },
      },
    },
    take: 3,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-zinc-500">
        <Link href="/" className="hover:text-zinc-800">
          Home
        </Link>
        <span>/</span>
        <Link href="/explore" className="hover:text-zinc-800">
          Templates
        </Link>
        <span>/</span>
        <Link href={`/explore?cat=${product.category.slug}`} className="hover:text-zinc-800">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-zinc-900 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Header and Media Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery & Previews (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Cover Screenshot */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-zinc-200/90 bg-zinc-100 shadow-lg">
            <img
              src={product.coverImage}
              alt={product.title}
              className="h-full w-full object-cover object-top"
            />
            {product.previewUrl && (
              <a
                href={product.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl bg-zinc-950/80 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md hover:bg-zinc-900 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Live Interactive Preview</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Additional Screenshots */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm"
                >
                  <img
                    src={img.url}
                    alt={img.caption || product.title}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Product Description */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
            <h2 className="text-xl font-bold text-zinc-900">About this template</h2>
            <div className="prose prose-zinc text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>

            {/* Features Highlight */}
            {featuresList.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-zinc-100">
                <h3 className="text-sm font-bold text-zinc-900">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {featuresList.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included Pages */}
            {includedPages.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-zinc-100">
                <h3 className="text-sm font-bold text-zinc-900">Included Pages</h3>
                <div className="flex flex-wrap gap-2">
                  {includedPages.map((page, idx) => (
                    <span
                      key={idx}
                      className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700"
                    >
                      {page}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Setup & Instructions */}
            {product.setupInstructions && (
              <div className="space-y-3 pt-4 border-t border-zinc-100">
                <h3 className="text-sm font-bold text-zinc-900">Setup Instructions</h3>
                <div className="rounded-2xl bg-zinc-50 p-4 text-xs text-zinc-600 leading-relaxed whitespace-pre-line border border-zinc-200/60 font-mono">
                  {product.setupInstructions}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Purchasing Card & Creator Profile (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Action Box */}
          <div className="sticky top-24 rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                  {product.category.name}
                </span>
                <div className="flex items-center gap-1 text-xs font-semibold text-zinc-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-zinc-400">({product.reviewCount} verified)</span>
                </div>
              </div>

              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
                {product.title}
              </h1>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">{product.shortDesc}</p>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
              {product.isFree ? (
                <span className="text-3xl font-extrabold text-emerald-600">Free</span>
              ) : (
                <>
                  <span className="text-3xl font-extrabold text-zinc-900">
                    {formatPrice(product.discountPrice || product.price, product.currency)}
                  </span>
                  {product.discountPrice && (
                    <span className="text-base text-zinc-400 line-through">
                      {formatPrice(product.price, product.currency)}
                    </span>
                  )}
                  <span className="ml-auto text-[11px] font-medium text-zinc-500">
                    One-time payment
                  </span>
                </>
              )}
            </div>

            {/* Primary CTA Buttons */}
            <div className="space-y-3">
              <Link
                href={`/checkout/${product.id}`}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 px-6 text-sm font-bold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 hover:shadow-lg transition-all"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{product.isFree ? "Download Template for Free" : "Buy Template Now"}</span>
              </Link>

              {product.previewUrl && (
                <a
                  href={product.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white py-3 px-6 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors"
                >
                  <Eye className="h-4 w-4 text-zinc-500" />
                  <span>Preview Website in New Tab</span>
                  <ExternalLink className="h-3 w-3 text-zinc-400" />
                </a>
              )}
            </div>

            {/* Guarantee / Value props */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-100 text-xs text-zinc-600">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Instant Framer Remix link delivery</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-brand-600" />
                <span>Commercial usage license included</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>Lifetime free template updates</span>
              </div>
            </div>

            {/* Included Files info */}
            {product.files && product.files.length > 0 && (
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Included Digital Assets
                </span>
                {product.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between text-xs text-zinc-700">
                    <span className="flex items-center gap-2 truncate">
                      <FolderArchive className="h-4 w-4 text-zinc-400" />
                      {file.fileName}
                    </span>
                    <span className="text-zinc-400 font-mono text-[11px]">
                      {formatBytes(file.fileSizeBytes)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Creator Profile Box */}
            <div className="rounded-2xl border border-zinc-200/80 p-4 space-y-3">
              <div className="flex items-center gap-3">
                {product.creator.avatarUrl ? (
                  <img
                    src={product.creator.avatarUrl}
                    alt={product.creator.name}
                    className="h-11 w-11 rounded-full object-cover border border-zinc-200"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                    {product.creator.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-zinc-900">
                      {product.creator.creatorProfile?.storeName || product.creator.name}
                    </h4>
                    {product.creator.creatorProfile?.verified && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500">{product.creator.name}</p>
                </div>
              </div>

              {product.creator.creatorProfile?.bio && (
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {product.creator.creatorProfile.bio}
                </p>
              )}

              <Link
                href={`/creators/${product.creator.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                <span>Visit creator store</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-2 pt-2 border-t border-zinc-100 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Compatibility:</span>
                <span className="font-medium text-zinc-800">{product.compatibility || "Framer 2024+"}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>License:</span>
                <span className="font-medium text-zinc-800">{product.licenseType} License</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Released / Updated:</span>
                <span className="font-medium text-zinc-800">{formatDate(product.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Reviews Section */}
      <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-10 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Customer Reviews</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Verified purchasers of {product.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              <Star className="h-5 w-5 fill-amber-400" />
            </div>
            <span className="text-lg font-bold text-zinc-900">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-zinc-400">out of 5.0</span>
          </div>
        </div>

        {product.reviews.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4">No reviews yet for this product.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-zinc-100 bg-zinc-50/60 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {review.user.avatarUrl ? (
                      <img
                        src={review.user.avatarUrl}
                        alt={review.user.name}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold">
                        {review.user.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-zinc-900">{review.user.name}</span>
                      {review.isVerifiedPurchase && (
                        <span className="ml-2 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed italic">
                  "{review.comment}"
                </p>
                <p className="text-[10px] text-zinc-400">{formatDate(review.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              More in {product.category.name}
            </h2>
            <Link
              href={`/explore?cat=${product.category.slug}`}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              View category →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p as unknown as ProductWithRelations} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
