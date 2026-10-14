import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  UploadCloud, 
  CreditCard, 
  BarChart3, 
  DollarSign, 
  Store,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";

export const revalidate = 0;

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?redirect=/creator/dashboard");
  }

  if (user.role !== "CREATOR" && user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Creator Navigation Sidebar (3 cols) */}
        <aside className="md:col-span-3 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-card space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div className="truncate">
              <h3 className="text-xs font-bold text-zinc-900 truncate">
                {user.creatorProfile?.storeName || user.name}
              </h3>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Creator Partner
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            <Link
              href="/creator/dashboard"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-zinc-400" />
              <span>Creator Overview</span>
            </Link>

            <Link
              href="/creator/products"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <Package className="h-4 w-4 text-zinc-400" />
              <span>My Templates</span>
            </Link>

            <Link
              href="/creator/products/new"
              className="flex items-center gap-2.5 rounded-xl bg-brand-50 text-brand-700 font-semibold px-3 py-2.5 hover:bg-brand-100/70 transition-colors"
            >
              <UploadCloud className="h-4 w-4 text-brand-600" />
              <span>Upload New Template</span>
            </Link>

            <Link
              href="/creator/sales"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <BarChart3 className="h-4 w-4 text-zinc-400" />
              <span>Sales & Analytics</span>
            </Link>

            <Link
              href="/creator/payouts"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <DollarSign className="h-4 w-4 text-zinc-400" />
              <span>Payouts & Earnings</span>
            </Link>
          </nav>

          <div className="pt-2 border-t border-zinc-100">
            <Link
              href={`/creators/${user.id}`}
              className="flex items-center justify-between text-xs font-semibold text-zinc-600 hover:text-brand-600 p-2"
            >
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-zinc-400" />
                <span>View Public Storefront</span>
              </div>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </aside>

        {/* Creator Main Content Area (9 cols) */}
        <main className="md:col-span-9">{children}</main>
      </div>
    </div>
  );
}
