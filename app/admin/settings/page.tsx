import prisma from "@/lib/prisma";
import { Settings, Save, Percent, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const setting = await prisma.commissionSetting.findFirst({ where: { active: true } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Platform Settings</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Configure marketplace commission, payment gateways, and system parameters.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
        <h2 className="text-sm font-bold text-zinc-900">Marketplace Commission Policy</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Platform Take Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                readOnly
                value={setting?.ratePercentage || 10.0}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 font-bold"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-bold">
                %
              </span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              Creators receive 100% minus this percentage (e.g. 90% net share at 10% fee).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Default Currency</label>
            <input
              type="text"
              readOnly
              value="INR (₹) - Indian Rupee"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 font-bold"
            />
            <p className="mt-1 text-[11px] text-zinc-400">Configured via environment DEFAULT_CURRENCY.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <span>Stripe Gateway Test Mode: Active</span>
          <span className="rounded-full bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5">
            Ready for Production
          </span>
        </div>
      </div>
    </div>
  );
}
