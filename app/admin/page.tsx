import Link from "next/link";
import { 
  Users, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/currency";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminOverviewPage() {
  const [
    totalUsers,
    totalProducts,
    pendingProducts,
    orders,
    auditLogs,
    commissionSetting,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.product.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.order.findMany({ where: { status: "COMPLETED" } }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: true },
    }),
    prisma.commissionSetting.findFirst({ where: { active: true } }),
  ]);

  const totalVolume = orders.reduce((acc, o) => acc + o.total, 0);
  const commissionRate = commissionSetting?.ratePercentage || 10.0;
  const platformRevenue = Math.round((totalVolume * commissionRate) / 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Platform Overview</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Marketplace performance, moderation queues, and operational audit logs.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-zinc-500">Gross Marketplace GMV</span>
          <p className="mt-2 text-2xl font-extrabold text-zinc-900">{formatPrice(totalVolume)}</p>
          <span className="text-[11px] text-zinc-400 mt-1 block">Lifetime volume</span>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-zinc-500">Platform Commission ({commissionRate}%)</span>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600">{formatPrice(platformRevenue)}</p>
          <span className="text-[11px] text-emerald-600 mt-1 block">Net marketplace revenue</span>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-zinc-500">Registered Users</span>
          <p className="mt-2 text-2xl font-extrabold text-zinc-900">{totalUsers}</p>
          <Link href="/admin/users" className="text-[11px] text-brand-600 hover:underline mt-1 block">
            Manage users →
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-zinc-500">Templates Catalog</span>
          <p className="mt-2 text-2xl font-extrabold text-zinc-900">{totalProducts}</p>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            {pendingProducts} pending moderation
          </span>
        </div>
      </div>

      {/* Audit Log Feed */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h2 className="text-sm font-bold text-zinc-900">Recent Platform Audit Log</h2>
          <span className="text-xs text-zinc-400">Security & Operational events</span>
        </div>

        <div className="divide-y divide-zinc-100">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-zinc-900">
                    {log.action} • <span className="text-zinc-500">{log.entity}</span>
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    {log.user ? log.user.name : "System"}
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-zinc-400">{formatDate(log.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
