import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { User, Shield, Sparkles } from "lucide-react";

export const revalidate = 0;

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Account Settings</h1>
        <p className="text-xs text-zinc-500 mt-1">Manage your profile, email, and authentication details.</p>
      </div>

      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
        <h2 className="text-sm font-bold text-zinc-900">Profile Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Display Name</label>
            <input
              type="text"
              readOnly
              value={user.name}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
            <input
              type="email"
              readOnly
              value={user.email}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-800"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-900">Current Role</span>
            <p className="text-[11px] text-zinc-500">Determines your platform privileges</p>
          </div>
          <span className="rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-bold text-brand-700">
            {user.role}
          </span>
        </div>
      </div>
    </div>
  );
}
