import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

export default function LicensePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          License Terms & Guidelines
        </h1>
        <p className="text-sm text-zinc-600 max-w-lg mx-auto">
          Every template on FrameMarket comes with clear, rights-protecting digital usage licenses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Standard License */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900">Standard License</h2>
            <span className="rounded-full bg-brand-50 text-brand-700 px-3 py-1 text-xs font-semibold">
              Default with purchase
            </span>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            Grants you a non-exclusive, non-transferable right to use the template to create a single end product.
          </p>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-zinc-900">Allowed:</h4>
            <div className="flex items-center gap-2 text-zinc-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>1 personal or commercial website for you or a single client</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Modify, restyle, and add custom Framer components</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Connect custom domain and Framer hosting</span>
            </div>

            <h4 className="font-bold text-zinc-900 pt-3">Not Allowed:</h4>
            <div className="flex items-center gap-2 text-zinc-700">
              <XCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
              <span>Reselling, sublicensing, or sharing the remix link</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700">
              <XCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
              <span>Using across multiple independent commercial clients</span>
            </div>
          </div>
        </div>

        {/* Extended License */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900">Extended License</h2>
            <span className="rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-semibold">
              Agencies & Enterprise
            </span>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            Grants agencies and studios extended rights to deploy across multiple client projects and applications.
          </p>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-zinc-900">Allowed:</h4>
            <div className="flex items-center gap-2 text-zinc-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Unlimited client websites deployed by the licensee</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Use within internal agency design systems</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Commercial web applications & SaaS products</span>
            </div>

            <h4 className="font-bold text-zinc-900 pt-3">Not Allowed:</h4>
            <div className="flex items-center gap-2 text-zinc-700">
              <XCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
              <span>Publishing the raw template as a standalone competitor template</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
