import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/currency";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, RotateCcw, ShoppingBag } from "lucide-react";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
      payments: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Orders & Fulfillment</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Review buyer orders, transactions, payment methods, and handle refund operations.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-card space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="pb-3">Order Number</th>
                <th className="pb-3">Buyer</th>
                <th className="pb-3">Template Purchased</th>
                <th className="pb-3">Total Amount</th>
                <th className="pb-3">Payment Method</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.map((o) => {
                const item = o.items[0];
                return (
                  <tr key={o.id} className="hover:bg-zinc-50/50">
                    <td className="py-3 font-mono font-medium text-zinc-800">{o.orderNumber}</td>
                    <td className="py-3">
                      <p className="font-semibold text-zinc-900">{o.user.name}</p>
                      <p className="text-[10px] text-zinc-400">{o.user.email}</p>
                    </td>
                    <td className="py-3 font-medium text-zinc-700">
                      {item ? item.product.title : "N/A"}
                    </td>
                    <td className="py-3 font-bold text-zinc-900">{formatPrice(o.total, o.currency)}</td>
                    <td className="py-3 text-zinc-600">{o.paymentMethod}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-400">{formatDate(o.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
