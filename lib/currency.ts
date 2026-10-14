export const DEFAULT_CURRENCY = "INR";

export function formatPrice(amount: number, currency: string = DEFAULT_CURRENCY): string {
  if (amount === 0) return "Free";

  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function calculateFinancials(
  subtotal: number,
  discount: number = 0,
  commissionRatePercent: number = 10
) {
  const taxableAmount = Math.max(0, subtotal - discount);
  // Integer arithmetic (rounded to nearest integer)
  const platformCommission = Math.round((taxableAmount * commissionRatePercent) / 100);
  const creatorGrossShare = taxableAmount - platformCommission;
  
  // Tax (0% for demo/digital export or 18% GST if applicable)
  const tax = 0;
  const total = taxableAmount + tax;

  return {
    subtotal,
    discount,
    taxableAmount,
    platformCommission,
    creatorGrossShare,
    tax,
    total,
  };
}
