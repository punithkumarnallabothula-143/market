import Link from "next/link";
import { Download, ExternalLink, ShieldCheck, Sparkles, ShoppingBag, FolderArchive } from "lucide-react";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { formatPrice } from "@/lib/currency";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function PurchasesPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: user.id, status: "COMPLETED" },
    include: {
      items: {
        include: {
          product: {
            include: {
              files: true,
              creator: {
                include: {
                  creatorProfile: true,
                },
              },
            },
          },
        },
      },
      licenses: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My Purchased Templates</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Access your digital files, one-click Framer remix links, and commercial licenses.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-12 text-center space-y-4 shadow-card">
          <ShoppingBag className="h-10 w-10 text-zinc-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-900">No purchases found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              You haven't purchased any templates yet. Browse our curated collection to find design inspiration.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 shadow-sm"
          >
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-card space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3 text-xs">
                <div>
                  <span className="font-bold text-zinc-900">Order #{order.orderNumber}</span>
                  <span className="text-zinc-400 ml-2">• {formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Completed
                  </span>
                  <span className="font-bold text-zinc-900">{formatPrice(order.total, order.currency)}</span>
                </div>
              </div>

              {order.items.map((item) => {
                const license = order.licenses.find((l) => l.productId === item.productId);
                return (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={item.product.coverImage}
                        alt={item.product.title}
                        className="h-20 w-32 rounded-2xl object-cover border border-zinc-200 shadow-sm"
                      />
                      <div className="space-y-1">
                        <Link
                          href={`/templates/${item.product.slug}`}
                          className="text-sm font-bold text-zinc-900 hover:text-brand-600 transition-colors"
                        >
                          {item.product.title}
                        </Link>
                        <p className="text-xs text-zinc-500">
                          By {item.product.creator.creatorProfile?.storeName || item.product.creator.name}
                        </p>
                        {license && (
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-50 border border-zinc-200/60 px-2 py-0.5 text-[10px] text-zinc-600 font-mono">
                            <ShieldCheck className="h-3 w-3 text-brand-600" />
                            <span>License Key: {license.licenseKey}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {item.product.framerRemixUrl && (
                        <a
                          href={item.product.framerRemixUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                          <span>Remix in Framer</span>
                          <ExternalLink className="h-3 w-3 text-zinc-400" />
                        </a>
                      )}

                      <form action={`/api/downloads/${item.productId}`} method="POST">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 shadow-md shadow-brand-500/10 transition-all"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download Files (ZIP)</span>
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
