import Link from "next/link";
import { Shield, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function LicensesPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const licenses = await prisma.license.findMany({
    where: { userId: user.id },
    include: {
      product: true,
      order: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Active Licenses</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Cryptographic license keys issued for your purchased Framer website templates.
        </p>
      </div>

      {licenses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-12 text-center space-y-4 shadow-card">
          <Shield className="h-10 w-10 text-zinc-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-900">No active licenses</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Purchased templates will automatically generate authenticated licenses displayed here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {licenses.map((lic) => (
            <div
              key={lic.id}
              className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-card space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">{lic.product.title}</h3>
                  <p className="text-[11px] text-zinc-500">
                    Issued {formatDate(lic.createdAt)} • {lic.licenseType} Commercial License
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{lic.status}</span>
                </span>
              </div>

              <div className="rounded-2xl bg-zinc-50 border border-zinc-200/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    License Key
                  </span>
                  <p className="font-mono text-xs font-semibold text-zinc-800 selection:bg-brand-500 selection:text-white">
                    {lic.licenseKey}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/templates/${lic.product.slug}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-white border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <span>View Product</span>
                    <ExternalLink className="h-3 w-3 text-zinc-400" />
                  </Link>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Permits single-site commercial or personal production use. Sublicensing or public redistribution is prohibited under the terms of this license.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
