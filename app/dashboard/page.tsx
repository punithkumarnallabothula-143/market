import Link from "next/link";
import { ShoppingBag, Heart, Shield, Download, ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { formatPrice } from "@/lib/currency";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function BuyerDashboardOverview() {
  const user = await getSessionUser();
  if (!user) return null;

  // Fetch buyer statistics
  const [purchasesCount, licensesCount, favoritesCount, recentOrders] = await Promise.all([
    prisma.order.count({
      where: { userId: user.id, status: "COMPLETED" },
    }),
    prisma.license.count({
      where: { userId: user.id, status: "ACTIVE" },
    }),
    prisma.favorite.count({
      where: { userId: user.id },
    }),
    prisma.order.findMany({
      where: { userId: user.id, status: "COMPLETED" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        licenses: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Welcome back, {user.name} 👋
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Manage your purchased Framer templates, active licenses, and downloads.
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Purchased Templates</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-zinc-900">{purchasesCount}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Active Licenses</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Shield className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-zinc-900">{licensesCount}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Saved Favorites</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <Heart className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-zinc-900">{favoritesCount}</p>
        </div>
      </div>

      {/* Recent Purchases Section */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-card space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Recent Purchases</h2>
            <p className="text-xs text-zinc-500">Your latest template orders and access links</p>
          </div>
          <Link
            href="/dashboard/purchases"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center space-y-3">
            <ShoppingBag className="h-8 w-8 text-zinc-300 mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-800">No purchases yet</p>
              <p className="text-xs text-zinc-500">
                Explore the Framer marketplace to discover templates for your next project.
              </p>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
            >
              <span>Browse Marketplace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {recentOrders.map((order) => {
              const item = order.items[0];
              const license = order.licenses[0];
              if (!item) return null;

              return (
                <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.coverImage}
                      alt={item.product.title}
                      className="h-14 w-20 rounded-xl object-cover border border-zinc-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">{item.product.title}</h4>
                      <p className="text-[11px] text-zinc-500">
                        Purchased on {formatDate(order.createdAt)} • {formatPrice(order.total, order.currency)}
                      </p>
                      {license && (
                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                          License: {license.licenseKey}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.product.framerRemixUrl && (
                      <a
                        href={item.product.framerRemixUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                        <span>Framer Remix</span>
                        <ExternalLink className="h-3 w-3 text-zinc-400" />
                      </a>
                    )}

                    <form action={`/api/downloads/${item.productId}`} method="POST">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 shadow-sm"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download ZIP</span>
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
