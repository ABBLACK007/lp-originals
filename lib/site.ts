// Brand + business settings. Replace every [PLACEHOLDER] with real client info.
export const site = {
  name: "LP Wears",
  instagram: "https://www.instagram.com/_lp_originals_/",
  instagramHandle: "@_lp_originals_",
  // International format, no "+" or spaces (+234 706 170 2536)
  whatsappNumber: "2347061702536",
  productionDays: "[X]",
  promo: { title: "Detty December Drop", discount: "[XX]% off", dates: "[DATES]" },
};

// Every WhatsApp button opens a chat with LP Wears with this message already typed.
export const whatsappGreeting = "Hi, I'm from the LP Wears website. I want to get ";

// `want` fills in the blank (e.g. the product and size); leave it out and the message ends at
// "I want to get " so the customer types the rest.
export function whatsappLink(want = "") {
  const n = site.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(whatsappGreeting + want)}`;
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
