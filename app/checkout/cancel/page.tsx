import Link from "next/link";
import { XCircle, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6 text-center">
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-card space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
          <XCircle className="h-7 w-7" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold text-zinc-900">Checkout Cancelled</h1>
          <p className="text-xs text-zinc-500">
            No payment was charged. You can resume checkout at any time.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
