// Validation for everything saved from /admin. Content is rendered on the public site, so every field is
// bounded and links/images are restricted to safe values (no javascript: URLs, no images from other hosts).
import { z } from "zod";

// Harmless input is tidied instead of refused (one refused field blocks the whole save): line breaks in
// one-line fields become spaces. Messages are shown to the store owner in /admin.
const EMPTY = "Can't be empty";
const text = (max: number) => z.string().trim().max(max, `Too long (max ${max} characters)`);
const line = (max: number) => z.string().overwrite((s) => s.replace(/\s*[\r\n]+\s*/g, " ")).trim().max(max, `Too long (max ${max} characters)`);

// Images: built-in files from this site, or files in this project's Vercel Blob store. Built-in files are
// /_next/static/media/… locally but /_next/static/immutable/media/… on Vercel, so any folder before media/ is fine.
const imgSrc = z.string().max(500).refine(
  (s) => /^\/_next\/static\/(?:[\w-]+\/)*media\/[\w.\-]+$/.test(s) || /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/[\w.\-/]+$/.test(s),
  "Image must be uploaded through the admin",
);
export const imgSchema = z.object({
  src: imgSrc,
  width: z.number().int().min(1).max(10000),
  height: z.number().int().min(1).max(10000),
  blurDataURL: z.string().max(4000).regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/).optional(),
  asset: z.string().max(60).regex(/^\w+$/).optional(),
});

// Links: site paths, on-page anchors, the WhatsApp shortcut, or https URLs.
export const hrefSchema = z.string().trim().max(300).refine(
  (h) => h === "whatsapp" || /^\/(?!\/)[\w\-./?=&%#]*$/.test(h) || /^#[\w-]+$/.test(h) || /^https:\/\/[\w.-]+(\/[\w\-./?=&%#+~:@]*)?$/.test(h),
  "Use a site path like /shop, an anchor like #ordering, “whatsapp”, or an https:// link",
);

const slug = z.string().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes");

export const productSchema = z.object({
  slug,
  name: line(60).min(1, EMPTY),
  material: line(80).min(1, EMPTY),
  category: z.enum(["cork", "slides", "clogs"]),
  footbed: line(60).optional(),
  audience: z.enum(["Men", "Women"]).optional(),
  price: z.number().int().min(0).max(100_000_000, "Price is too high").nullable(),
  isNew: z.boolean().optional(),
  hidden: z.boolean().optional(),
  images: z.array(imgSchema).max(8, "8 photos at most"),
  art: z.object({ style: z.enum(["two", "one", "clog"]), strap: z.string().regex(/^#[0-9a-fA-F]{6}$/) }),
});

export const slideSchema = z.object({
  id: z.string().min(1).max(40).regex(/^[a-z0-9-]+$/),
  hidden: z.boolean().optional(),
  image: imgSchema,
  mobileImage: imgSchema.optional(),
  focus: z.string().regex(/^\d{1,3}% \d{1,3}%$/).optional(),
  shade: z.enum(["left", "none"]).optional(),
  eyebrow: line(40),
  title: line(80).min(1, EMPTY),
  sub: text(220),
  ctas: z.array(z.object({ label: line(30).min(1, EMPTY), href: hrefSchema, style: z.enum(["gold", "outline"]) })).max(2),
});

export const gallerySchema = z.object({
  src: imgSchema,
  alt: line(140).min(1, "Describe the photo"),
  kind: z.enum(["product", "campaign"]),
  product: slug.optional(),
});

export const siteSchema = z.object({
  name: line(40).min(1, EMPTY),
  // Links copied from the Instagram app end in "?igsh=…": that part is dropped.
  instagram: z.string().trim().overwrite((s) => s.replace(/[?#].*$/, "")).max(200)
    .regex(/^https:\/\/(www\.)?instagram\.com\/[\w.]+\/?$/, "Use the profile link, like https://www.instagram.com/_lp_originals_"),
  instagramHandle: line(40).overwrite((s) => (s && !s.startsWith("@") ? `@${s}` : s)).regex(/^@[\w.]+$/, "Like @_lp_originals_ (letters, numbers, _ and . only)"),
  whatsappNumber: z.string().regex(/^\d{8,15}$/, "Digits only, with country code (e.g. 2347061702536)"),
  whatsappGreeting: line(160).min(1, EMPTY),
  productionDays: line(20).min(1, EMPTY),
  promo: z.object({ enabled: z.boolean(), title: line(40).min(1, EMPTY), discount: line(30).min(1, EMPTY), dates: line(60) }),
});

export const contentSchema = z.object({
  version: z.literal(1),
  updatedAt: z.string().max(40),
  site: siteSchema,
  products: z.array(productSchema).max(200).refine((ps) => new Set(ps.map((p) => p.slug)).size === ps.length, "Product links must be unique"),
  slides: z.array(slideSchema).min(1).max(10),
  gallery: z.array(gallerySchema).max(100),
});
