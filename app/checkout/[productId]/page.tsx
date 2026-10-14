"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  AlertCircle,
  ShoppingBag
} from "lucide-react";
import { formatPrice } from "@/lib/currency";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"DEMO" | "STRIPE">("DEMO");
  const [licenseType, setLicenseType] = useState<"Standard" | "Extended">("Standard");
  const [agreed, setAgreed] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (res.ok && data.product) {
          setProduct(data.product);
        } else {
          setError("Template not found or unavailable");
        }
      } catch {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleCheckout = async () => {
    if (!agreed) {
      setError("Please agree to the license terms before proceeding.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          paymentMethod,
          licenseType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?redirect=/checkout/${productId}`);
          return;
        }
        setError(data.error || "Payment processing failed");
        setSubmitting(false);
        return;
      }

      router.push(data.redirectUrl);
    } catch {
      setError("An unexpected network error occurred.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-xs text-zinc-500">
        Loading checkout session...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-zinc-900">Checkout Error</h2>
        <p className="text-xs text-zinc-500">{error || "Product could not be retrieved"}</p>
        <Link href="/explore" className="text-xs font-semibold text-brand-600 hover:underline">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const basePrice = product.isFree ? 0 : (product.discountPrice || product.price);
  const finalPrice = licenseType === "Extended" ? basePrice * 2 : basePrice;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href={`/templates/${product.slug}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to template details</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Form: Payment & License selection (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">Secure Checkout</h1>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* License Option Picker */}
            {!product.isFree && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-zinc-900">Select License Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLicenseType("Standard")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      licenseType === "Standard"
                        ? "border-brand-500 bg-brand-50/40 text-brand-900 ring-2 ring-brand-500/10"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <p className="text-xs font-bold">Standard License</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">1 single production website</p>
                    <p className="text-xs font-extrabold text-zinc-900 mt-2">
                      {formatPrice(basePrice, product.currency)}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLicenseType("Extended")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      licenseType === "Extended"
                        ? "border-brand-500 bg-brand-50/40 text-brand-900 ring-2 ring-brand-500/10"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <p className="text-xs font-bold">Extended License</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Unlimited client projects</p>
                    <p className="text-xs font-extrabold text-zinc-900 mt-2">
                      {formatPrice(basePrice * 2, product.currency)}
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-900">Payment Method</label>

              <div className="space-y-2">
                <label
                  onClick={() => setPaymentMethod("DEMO")}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "DEMO"
                      ? "border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/10"
                      : "border-zinc-200 bg-white hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white text-xs font-bold">
                      ⚡
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Instant Demo Checkout Mode</p>
                      <p className="text-[11px] text-zinc-500">
                        Zero-friction simulated transaction with real database order fulfillment
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "DEMO"}
                    onChange={() => setPaymentMethod("DEMO")}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                </label>

                <label
                  onClick={() => setPaymentMethod("STRIPE")}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "STRIPE"
                      ? "border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/10"
                      : "border-zinc-200 bg-white hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Credit / Debit Card / UPI</p>
                      <p className="text-[11px] text-zinc-500">
                        Test Mode Payment Gateway
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "STRIPE"}
                    onChange={() => setPaymentMethod("STRIPE")}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                </label>
              </div>
            </div>

            {/* License Agreement */}
            <div className="flex items-start gap-2.5 pt-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-zinc-300 text-brand-600 focus:ring-brand-500 h-4 w-4"
              />
              <label htmlFor="agree" className="text-xs text-zinc-600 cursor-pointer">
                I agree to the{" "}
                <Link href="/license" target="_blank" className="font-semibold text-brand-600 hover:underline">
                  Template License Agreement
                </Link>{" "}
                and acknowledge immediate digital fulfillment.
              </label>
            </div>

            <button
              onClick={handleCheckout}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 px-6 text-sm font-bold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 disabled:opacity-50 transition-all"
            >
              <Lock className="h-4 w-4" />
              <span>
                {submitting
                  ? "Processing Order..."
                  : product.isFree
                  ? "Confirm Free Download"
                  : `Complete Order (${formatPrice(finalPrice, product.currency)})`}
              </span>
            </button>
          </div>
        </div>

        {/* Right Summary: Product Summary & Total (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3">
              Order Summary
            </h2>

            <div className="flex items-start gap-3">
              <img
                src={product.coverImage}
                alt={product.title}
                className="h-14 w-20 rounded-xl object-cover border border-zinc-200"
              />
              <div>
                <h3 className="text-xs font-bold text-zinc-900">{product.title}</h3>
                <p className="text-[11px] text-zinc-500">{product.category.name}</p>
                <span className="text-[10px] text-brand-600 font-semibold">{licenseType} License</span>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-zinc-100 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>{formatPrice(finalPrice, product.currency)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Estimated Tax</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-zinc-900 pt-2 border-t border-zinc-100">
                <span>Total Due</span>
                <span>{formatPrice(finalPrice, product.currency)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-50 border border-zinc-200/60 p-4 space-y-2 text-xs text-zinc-500">
            <div className="flex items-center gap-2 text-zinc-800 font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Safe & Verified Marketplace</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Upon completed order, your unique license key is generated and linked to your account with instant access to the Framer remix link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
