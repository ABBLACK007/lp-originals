// Brand + business settings. Replace every [PLACEHOLDER] with real client info.
export const site = {
  name: "LP Originals",
  instagram: "https://www.instagram.com/_lp_originals_/",
  instagramHandle: "@_lp_originals_",
  // International format, no "+" or spaces, e.g. 2348012345678
  whatsappNumber: "[WHATSAPP_NUMBER]",
  productionDays: "[X]",
  promo: { title: "Detty December Drop", discount: "[XX]% off", dates: "[DATES]" },
};

export function whatsappLink(message: string) {
  const n = site.whatsappNumber.replace(/\D/g, "");
  const base = n ? `https://wa.me/${n}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function formatNaira(amount: number | null) {
  if (amount === null) return "₦ [PRICE]";
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

// Public URL for canonical links, sitemap and structured data. Set NEXT_PUBLIC_SITE_URL when a custom
// domain is connected; on Vercel it falls back to the project's production domain.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");
