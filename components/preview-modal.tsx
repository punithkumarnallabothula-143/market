"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ExternalLink, Monitor, Tablet, Smartphone, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { ProductWithRelations } from "@/types";

interface PreviewModalProps {
  product: ProductWithRelations | null;
  onClose: () => void;
}

export default function PreviewModal({ product, onClose }: PreviewModalProps) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  if (!product) return null;

  const deviceWidths = {
    desktop: "w-full h-full",
    tablet: "w-[768px] h-[90%] rounded-2xl border-4 border-zinc-800 shadow-2xl",
    mobile: "w-[390px] h-[85%] rounded-3xl border-4 border-zinc-800 shadow-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 text-white">
        {/* Left: Product title and creator */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h3 className="text-xs font-semibold text-zinc-100">{product.title}</h3>
            <span className="text-[11px] text-zinc-400">
              by {product.creator.creatorProfile?.storeName || product.creator.name}
            </span>
          </div>
        </div>

        {/* Center: Device Viewport Switches */}
        <div className="hidden sm:flex items-center rounded-xl bg-zinc-800/80 p-1 border border-zinc-700/60 text-zinc-400">
          <button
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              device === "desktop" ? "bg-zinc-700 text-white shadow" : "hover:text-zinc-200"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setDevice("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              device === "tablet" ? "bg-zinc-700 text-white shadow" : "hover:text-zinc-200"
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              device === "mobile" ? "bg-zinc-700 text-white shadow" : "hover:text-zinc-200"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {product.previewUrl && (
            <a
              href={product.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <span>Open in new tab</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          <Link
            href={`/checkout/${product.id}`}
            className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-500 shadow-md transition-all"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>
              {product.isFree
                ? "Get Free"
                : `Buy ${formatPrice(product.discountPrice || product.price, product.currency)}`}
            </span>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex flex-1 items-center justify-center overflow-hidden p-2 sm:p-6 bg-zinc-950">
        <div className={`transition-all duration-300 flex overflow-hidden bg-white ${deviceWidths[device]}`}>
          {product.previewUrl ? (
            <iframe
              src={product.previewUrl}
              title={product.title}
              className="h-full w-full border-none"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-zinc-900 text-zinc-400">
              <p className="text-sm">Live iframe preview is unavailable for this template.</p>
              <img
                src={product.coverImage}
                alt={product.title}
                className="mt-4 max-h-[70%] max-w-[90%] rounded-xl object-contain shadow-2xl"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
