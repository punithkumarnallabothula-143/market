import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, Ban, ShieldAlert, UserCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      creatorProfile: true,
      _count: {
        select: {
          products: true,
          orders: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">User Management</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Review registered accounts, role privileges, and account status.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-card space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Orders</th>
                <th className="pb-3">Templates</th>
                <th className="pb-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50/50">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="h-8 w-8 rounded-full object-cover border border-zinc-200"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center font-bold text-xs">
                          {u.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-zinc-900">{u.name}</p>
                        <p className="text-[10px] text-zinc-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        u.role === "ADMIN"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : u.role === "CREATOR"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">
                    {u.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700">
                        <Ban className="h-3 w-3" />
                        Suspended
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-zinc-700 font-semibold">{u._count.orders}</td>
                  <td className="py-3 text-zinc-700 font-semibold">{u._count.products}</td>
                  <td className="py-3 text-zinc-400">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
