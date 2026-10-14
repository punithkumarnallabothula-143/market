import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/currency";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, Clock, Eye, AlertCircle, Sparkles } from "lucide-react";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      creator: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Product Moderation</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Review, approve, or hide Framer website templates submitted across all categories.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-card space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="pb-3">Template</th>
                <th className="pb-3">Creator</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Sales</th>
                <th className="pb-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/50">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="h-10 w-14 rounded-lg object-cover border border-zinc-200"
                      />
                      <div>
                        <p className="font-bold text-zinc-900">{p.title}</p>
                        <p className="text-[10px] text-zinc-400">Slug: {p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-zinc-700 font-medium">{p.creator.name}</td>
                  <td className="py-3 text-zinc-500">{p.category.name}</td>
                  <td className="py-3 font-semibold text-zinc-900">
                    {p.isFree ? "Free" : formatPrice(p.price, p.currency)}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" />
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-700 font-semibold">{p.salesCount}</td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/templates/${p.slug}`}
                      className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 inline-block"
                      title="Inspect listing"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
