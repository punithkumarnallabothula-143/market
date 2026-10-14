import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  Shield, 
  Settings, 
  UploadCloud, 
  User as UserIcon,
  Sparkles
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";

export const revalidate = 0;

export default async function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Buyer Navigation Sidebar (3 cols) */}
        <aside className="md:col-span-3 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-card space-y-6">
          {/* User mini profile */}
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover border border-zinc-200"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="truncate">
              <h3 className="text-xs font-bold text-zinc-900 truncate">{user.name}</h3>
              <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-zinc-400" />
              <span>Overview</span>
            </Link>

            <Link
              href="/dashboard/purchases"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <ShoppingBag className="h-4 w-4 text-zinc-400" />
              <span>My Purchases & Files</span>
            </Link>

            <Link
              href="/dashboard/favorites"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <Heart className="h-4 w-4 text-zinc-400" />
              <span>Saved Favorites</span>
            </Link>

            <Link
              href="/dashboard/licenses"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <Shield className="h-4 w-4 text-zinc-400" />
              <span>Licenses</span>
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <Settings className="h-4 w-4 text-zinc-400" />
              <span>Account Settings</span>
            </Link>
          </nav>

          {/* Creator shortcut badge */}
          {user.role === "CREATOR" ? (
            <div className="pt-2 border-t border-zinc-100">
              <Link
                href="/creator/dashboard"
                className="flex items-center justify-between rounded-xl bg-indigo-50 border border-indigo-200/60 p-3 text-xs font-semibold text-indigo-700 hover:bg-indigo-100/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <UploadCloud className="h-4 w-4 text-indigo-600" />
                  <span>Creator Portal</span>
                </div>
                <span>→</span>
              </Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-zinc-100">
              <Link
                href="/register?role=creator"
                className="flex flex-col gap-1 rounded-xl bg-zinc-50 border border-zinc-200/60 p-3 text-xs text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <span className="font-bold flex items-center gap-1.5 text-zinc-900">
                  <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                  Become a Creator
                </span>
                <span className="text-[11px] text-zinc-500">Sell your Framer templates and earn 90%</span>
              </Link>
            </div>
          )}
        </aside>

        {/* Main Content Area (9 cols) */}
        <main className="md:col-span-9">{children}</main>
      </div>
    </div>
  );
}
