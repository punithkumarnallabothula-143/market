import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Users, 
  Package, 
  ShoppingBag, 
  FileText, 
  Settings, 
  LayoutDashboard,
  Sparkles,
  Layers
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/login?redirect=/admin");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Admin Navigation Sidebar (3 cols) */}
        <aside className="md:col-span-3 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-card space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="truncate">
              <h3 className="text-xs font-bold text-zinc-900 truncate">Admin Portal</h3>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                Superuser
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-zinc-400" />
              <span>Platform Overview</span>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <Users className="h-4 w-4 text-zinc-400" />
              <span>User Management</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <Package className="h-4 w-4 text-zinc-400" />
              <span>Product Moderation</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <ShoppingBag className="h-4 w-4 text-zinc-400" />
              <span>Orders & Refunds</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <Settings className="h-4 w-4 text-zinc-400" />
              <span>Marketplace Settings</span>
            </Link>
          </nav>

          <div className="pt-2 border-t border-zinc-100">
            <Link
              href="/dashboard"
              className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 p-2"
            >
              <span>← Back to Buyer View</span>
            </Link>
          </div>
        </aside>

        {/* Admin Content Area (9 cols) */}
        <main className="md:col-span-9">{children}</main>
      </div>
    </div>
  );
}
