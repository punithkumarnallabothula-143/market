import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { formatPrice } from "@/lib/currency";
import { formatDate } from "@/lib/utils";
import { DollarSign, Clock, CheckCircle2, AlertCircle, Building2, Send } from "lucide-react";

export const revalidate = 0;

export default async function CreatorPayoutsPage() {
  const user = await getSessionUser();
  if (!user || !user.creatorProfile) return null;

  const profile = await prisma.creatorProfile.findUnique({
    where: { id: user.creatorProfile.id },
    include: {
      payoutRequests: {
        orderBy: { requestedAt: "desc" },
      },
    },
  });

  if (!profile) return null;

  let payoutDetails: Record<string, string> = {};
  try {
    if (profile.payoutDetails) {
      payoutDetails = JSON.parse(profile.payoutDetails);
    }
  } catch (e) {
    payoutDetails = {};
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Creator Payouts</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Manage your payout methods (UPI / Bank Wire) and track withdrawal requests.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-zinc-500">Available for Payout</span>
          <p className="mt-2 text-2xl font-extrabold text-brand-600">
            {formatPrice(profile.netEarnings)}
          </p>
          <span className="text-[11px] text-zinc-400 mt-1 block">Minimum withdrawal: ₹1,000</span>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-zinc-500">Payout Method</span>
          <p className="mt-2 text-lg font-bold text-zinc-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            <span>{profile.payoutMethod || "UPI"}</span>
          </p>
          <span className="text-[11px] text-zinc-500 mt-1 block font-mono truncate">
            {payoutDetails.upiId || payoutDetails.accountNumber || "Direct Deposit"}
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-zinc-500">Lifetime Paid</span>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600">
            {formatPrice(profile.netEarnings)}
          </p>
          <span className="text-[11px] text-emerald-600 mt-1 block">Automated ledger synced</span>
        </div>
      </div>

      {/* Payout Request History */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h2 className="text-sm font-bold text-zinc-900">Payout History</h2>
          <span className="text-xs text-zinc-500">3-5 business days processing</span>
        </div>

        {profile.payoutRequests.length === 0 ? (
          <p className="text-xs text-zinc-500 py-6 text-center">No payout requests submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {profile.payoutRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="py-3 font-mono font-medium text-zinc-800">
                      {req.transactionRef || req.id.slice(0, 8)}
                    </td>
                    <td className="py-3 font-bold text-zinc-900">
                      {formatPrice(req.amount, req.currency)}
                    </td>
                    <td className="py-3 text-zinc-600">{req.paymentMethod}</td>
                    <td className="py-3 text-zinc-400">{formatDate(req.requestedAt)}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                        {req.status}
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
