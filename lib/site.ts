// Formatting and link helpers shared by server and client. Business settings (WhatsApp number, promo,
// production time) are editable in /admin and come from the store content (see lib/content.ts).
import type { SiteSettings } from "./content-types";

// Every WhatsApp button opens a chat with LP Wears with the greeting already typed. `want` fills in the
// blank (e.g. the product and size); leave it out and the customer types the rest.
export function whatsappHref(s: Pick<SiteSettings, "whatsappNumber" | "whatsappGreeting">, want = "") {
  const n = s.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(s.whatsappGreeting + want)}`;
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
