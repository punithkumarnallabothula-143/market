import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { formatPrice } from "@/lib/currency";
import { formatDate } from "@/lib/utils";
import { Download, ShoppingBag } from "lucide-react";

export const revalidate = 0;

export default async function CreatorSalesPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const products = await prisma.product.findMany({
    where: { creatorId: user.id },
    include: {
      orderItems: {
        include: {
          order: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  const salesRows: Array<{
    id: string;
    orderNumber: string;
    buyerName: string;
    productTitle: string;
    price: number;
    creatorShare: number;
    currency: string;
    date: Date;
    status: string;
  }> = [];

  for (const product of products) {
    for (const item of product.orderItems) {
      if (item.order.status === "COMPLETED") {
        salesRows.push({
          id: item.id,
          orderNumber: item.order.orderNumber,
          buyerName: item.order.user.name,
          productTitle: product.title,
          price: item.price,
          creatorShare: Math.round(item.price * 0.9),
          currency: item.order.currency,
          date: item.order.createdAt,
          status: item.order.status,
        });
      }
    }
  }

  salesRows.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Sales Transactions</h1>
          <p className="text-xs text-zinc-500 mt-1">Full audit log of purchases and creator earnings.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-card space-y-4">
        {salesRows.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-8">No completed sales recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Buyer</th>
                  <th className="pb-3">Template</th>
                  <th className="pb-3">Gross</th>
                  <th className="pb-3">Net Share (90%)</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {salesRows.map((sale) => (
                  <tr key={sale.id} className="hover:bg-zinc-50/50">
                    <td className="py-3 font-mono font-medium text-zinc-800">{sale.orderNumber}</td>
                    <td className="py-3 text-zinc-600">{sale.buyerName}</td>
                    <td className="py-3 font-semibold text-zinc-900">{sale.productTitle}</td>
                    <td className="py-3 text-zinc-500">{formatPrice(sale.price, sale.currency)}</td>
                    <td className="py-3 font-bold text-emerald-600">
                      +{formatPrice(sale.creatorShare, sale.currency)}
                    </td>
                    <td className="py-3 text-zinc-400">{formatDate(sale.date)}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Paid
                      </span>
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
