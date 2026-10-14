import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Sparkles, Download, ExternalLink, ShieldCheck, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { formatPrice } from "@/lib/currency";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

interface SuccessPageProps {
  searchParams: {
    orderId?: string;
  };
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = searchParams;
  if (!orderId) {
    notFound();
  }

  const user = await getSessionUser();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      licenses: true,
    },
  });

  if (!order) {
    notFound();
  }

  const item = order.items[0];
  const license = order.licenses[0];

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-10 shadow-card text-center space-y-6">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
            Order Confirmed!
          </h1>
          <p className="text-xs text-zinc-500">
            Order #{order.orderNumber} • Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Product & License Summary Box */}
        {item && (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 text-left space-y-4">
            <div className="flex items-start gap-4">
              <img
                src={item.product.coverImage}
                alt={item.product.title}
                className="h-16 w-24 rounded-xl object-cover border border-zinc-200 shadow-sm"
              />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-900">{item.product.title}</h3>
                <p className="text-xs text-zinc-500">
                  {formatPrice(order.total, order.currency)} • {item.licenseType} Commercial License
                </p>
              </div>
            </div>

            {license && (
              <div className="rounded-xl bg-white border border-zinc-200 p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Your Authenticated License Key
                </span>
                <p className="font-mono text-xs font-bold text-brand-700 selection:bg-brand-500 selection:text-white">
                  {license.licenseKey}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Instant Access Action Buttons */}
        <div className="space-y-3 pt-2">
          {item?.product.framerRemixUrl && (
            <a
              href={item.product.framerRemixUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 px-6 text-sm font-bold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Remix into your Framer Workspace</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {item && (
            <form action={`/api/downloads/${item.productId}`} method="POST">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white py-3 px-6 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors"
              >
                <Download className="h-4 w-4 text-zinc-500" />
                <span>Download Template Archive (.ZIP)</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-center gap-4 text-xs">
          <Link href="/dashboard/purchases" className="font-semibold text-brand-600 hover:underline">
            Go to My Purchases
          </Link>
          <span className="text-zinc-300">•</span>
          <Link href="/explore" className="text-zinc-500 hover:text-zinc-800">
            Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
