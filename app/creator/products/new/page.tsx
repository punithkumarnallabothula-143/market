"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  UploadCloud, 
  Sparkles, 
  Eye, 
  ShieldCheck, 
  Layers, 
  DollarSign,
  AlertCircle
} from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDesc: "",
    description: "",
    categorySlug: "saas-startups",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    previewUrl: "",
    framerRemixUrl: "",
    includedPages: "Home, Features, Pricing, About, Contact",
    features: "Framer CMS Ready, Responsive Breakpoints, Custom Animations",
    compatibility: "Framer 2024+, Zero Code",
    setupInstructions: "1. Remix project into Framer\n2. Customize branding and typography\n3. Connect custom domain",
    isFree: false,
    price: 1999,
  });

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    setFormData({
      ...formData,
      title: titleVal,
      slug: generateSlug(titleVal),
    });
  };

  const handleSubmit = async (publishImmediately: boolean = true) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/creator/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: publishImmediately ? "PUBLISHED" : "DRAFT",
          price: formData.isFree ? 0 : Number(formData.price),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create template listing");
        setLoading(false);
        return;
      }

      router.push("/creator/products");
      router.refresh();
    } catch {
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/creator/products"
          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Upload New Template</h1>
          <p className="text-xs text-zinc-500">
            Publish your Framer template to the FrameMarket catalog in 5 quick steps.
          </p>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-5 gap-2 border-b border-zinc-200/80 pb-4 text-xs font-semibold">
        {[
          { num: 1, name: "1. Details" },
          { num: 2, name: "2. Assets & Demo" },
          { num: 3, name: "3. Specs & Pages" },
          { num: 4, name: "4. Pricing" },
          { num: 5, name: "5. Review" },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
              step === s.num
                ? "bg-brand-50 text-brand-700 border border-brand-200"
                : step > s.num
                ? "text-emerald-700 bg-emerald-50/60"
                : "text-zinc-400 bg-zinc-50"
            }`}
          >
            {step > s.num && <Check className="h-3 w-3" />}
            <span className="truncate">{s.name}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200/80 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-zinc-900">Step 1: Basic Information</h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Template Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Apex SaaS Website Template"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">URL Slug</label>
              <div className="flex rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden text-xs">
                <span className="px-3 py-2.5 text-zinc-400 border-r border-zinc-200">
                  framemarket.dev/templates/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-transparent px-3 py-2.5 text-xs text-zinc-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Category *</label>
              <select
                value={formData.categorySlug}
                onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none"
              >
                <option value="saas-startups">SaaS & Startups</option>
                <option value="portfolios">Portfolios</option>
                <option value="agency-websites">Agency Websites</option>
                <option value="ecommerce">E-commerce</option>
                <option value="personal-brands">Personal Brands</option>
                <option value="landing-pages">Landing Pages</option>
                <option value="blogs-publications">Blogs & Publications</option>
                <option value="ai-technology">AI & Technology</option>
                <option value="real-estate">Real Estate</option>
                <option value="mobile-app-websites">Mobile App Websites</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Short Summary *</label>
              <input
                type="text"
                required
                value={formData.shortDesc}
                onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                placeholder="A concise 1-2 sentence description shown on template cards"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Description</label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed overview of what is included, who it's for, and design specifications..."
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Assets & Demos */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-zinc-900">Step 2: Media, Assets & Links</h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Cover Preview Image URL *</label>
              <input
                type="url"
                required
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-zinc-400">Recommended size: 1200x800px (16:10 aspect ratio)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Live Framer Preview URL</label>
              <input
                type="url"
                value={formData.previewUrl}
                onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
                placeholder="https://your-template.framer.website"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-zinc-400">Allows buyers to interact with the design in real-time</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Framer Remix Link *</label>
              <input
                type="url"
                value={formData.framerRemixUrl}
                onChange={(e) => setFormData({ ...formData, framerRemixUrl: e.target.value })}
                placeholder="https://framer.com/projects/new?duplicate=..."
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-zinc-400">Delivered automatically to buyers upon confirmed payment</p>
            </div>
          </div>
        )}

        {/* Step 3: Product Info */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-zinc-900">Step 3: Included Pages & Compatibility</h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Included Pages (comma separated)</label>
              <input
                type="text"
                value={formData.includedPages}
                onChange={(e) => setFormData({ ...formData, includedPages: e.target.value })}
                placeholder="Home, Pricing, About, Blog CMS, Contact"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Key Features (comma separated)</label>
              <input
                type="text"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Framer CMS, Interactive Pricing, Responsive Breakpoints"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Compatibility</label>
              <input
                type="text"
                value={formData.compatibility}
                onChange={(e) => setFormData({ ...formData, compatibility: e.target.value })}
                placeholder="Framer 2024+, Zero Code, Mobile Responsive"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Setup Instructions</label>
              <textarea
                rows={3}
                value={formData.setupInstructions}
                onChange={(e) => setFormData({ ...formData, setupInstructions: e.target.value })}
                placeholder="Step-by-step guidance for customers to set up custom domains or CMS collections"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 4: Pricing */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-sm font-bold text-zinc-900">Step 4: Pricing & Economics</h2>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFree}
                  onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                  className="rounded border-zinc-300 text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
                <span>Offer this template as 100% Free for the community</span>
              </label>
            </div>

            {!formData.isFree && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Price in INR (₹) *</label>
                  <input
                    type="number"
                    min={99}
                    step={100}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none font-bold"
                  />
                </div>

                <div className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Platform Commission (10%):</span>
                    <span className="text-zinc-700">₹{Math.round(formData.price * 0.1)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700 pt-2 border-t border-zinc-200/60">
                    <span>Your Net Payout (90%):</span>
                    <span>₹{Math.round(formData.price * 0.9)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Review & Publish */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-zinc-900">Step 5: Review & Confirm</h2>

            <div className="rounded-2xl border border-zinc-200 p-4 flex items-center gap-4">
              <img
                src={formData.coverImage}
                alt={formData.title}
                className="h-16 w-24 rounded-xl object-cover border border-zinc-200"
              />
              <div>
                <h3 className="text-sm font-bold text-zinc-900">{formData.title || "Untitled Template"}</h3>
                <p className="text-xs text-zinc-500">{formData.shortDesc || "No summary provided"}</p>
                <p className="text-xs font-bold text-emerald-600 mt-1">
                  {formData.isFree ? "Free Template" : `₹${formData.price}`}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-700 disabled:opacity-50 shadow-md shadow-brand-500/20"
              >
                <span>{loading ? "Publishing..." : "Publish to Marketplace"}</span>
                <Sparkles className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Save as Draft
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 5 && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-5 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
            >
              <span>Next Step</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
