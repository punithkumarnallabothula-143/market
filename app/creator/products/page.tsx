import Link from "next/link";
import { Plus, Eye, Edit3, CheckCircle2, Clock, AlertCircle, Archive } from "lucide-react";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { formatPrice } from "@/lib/currency";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function CreatorProductsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const products = await prisma.product.findMany({
    where: { creatorId: user.id },
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My Framer Templates</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage your template listings, pricing, and moderation status.
          </p>
        </div>

        <Link
          href="/creator/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Template</span>
        </Link>
      </div>

      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-card space-y-4">
        {products.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-xs text-zinc-500">You haven't uploaded any templates yet.</p>
            <Link
              href="/creator/products/new"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
            >
              Upload your first template
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="pb-3">Template</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Sales</th>
                  <th className="pb-3 text-right">Actions</th>
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
                          <p className="text-[10px] text-zinc-400">Added {formatDate(p.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-zinc-600">{p.category.name}</td>
                    <td className="py-3 font-semibold text-zinc-900">
                      {p.isFree ? "Free" : formatPrice(p.price, p.currency)}
                    </td>
                    <td className="py-3">
                      {p.status === "PUBLISHED" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Published
                        </span>
                      )}
                      {p.status === "PENDING_REVIEW" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          <Clock className="h-3 w-3" />
                          In Review
                        </span>
                      )}
                      {p.status === "DRAFT" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
                          Draft
                        </span>
                      )}
                      {p.status === "ARCHIVED" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500">
                          <Archive className="h-3 w-3" />
                          Archived
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-zinc-700 font-semibold">{p.salesCount}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/templates/${p.slug}`}
                          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                          title="View live template"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
