// Validation for everything saved from /admin. Content is rendered on the public site, so every field is
// bounded and links/images are restricted to safe values (no javascript: URLs, no images from other hosts).
import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);
const line = (max: number) => text(max).regex(/^[^\r\n]*$/, "One line only");

// Images: built-in files from this site, or files in this project's Vercel Blob store.
const imgSrc = z.string().max(500).refine(
  (s) => /^\/_next\/static\/media\/[\w.\-]+$/.test(s) || /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/[\w.\-/]+$/.test(s),
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
  name: line(60).min(1),
  material: line(80).min(1),
  category: z.enum(["cork", "slides", "clogs"]),
  footbed: line(60).optional(),
  audience: z.enum(["Men", "Women"]).optional(),
  price: z.number().int().min(0).max(100_000_000).nullable(),
  isNew: z.boolean().optional(),
  hidden: z.boolean().optional(),
  images: z.array(imgSchema).max(8),
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
  title: line(80).min(1),
  sub: text(220),
  ctas: z.array(z.object({ label: line(30).min(1), href: hrefSchema, style: z.enum(["gold", "outline"]) })).max(2),
});

export const gallerySchema = z.object({
  src: imgSchema,
  alt: line(140).min(1),
  kind: z.enum(["product", "campaign"]),
  product: slug.optional(),
});

export const siteSchema = z.object({
  name: line(40).min(1),
  instagram: z.string().max(200).regex(/^https:\/\/(www\.)?instagram\.com\/[\w.]+\/?$/, "Instagram profile link"),
  instagramHandle: line(40).regex(/^@[\w.]+$/, "Starts with @"),
  whatsappNumber: z.string().regex(/^\d{8,15}$/, "Digits only, with country code (e.g. 2347061702536)"),
  whatsappGreeting: line(160).min(1),
  productionDays: line(20).min(1),
  promo: z.object({ enabled: z.boolean(), title: line(40).min(1), discount: line(30).min(1), dates: line(60) }),
});

export const contentSchema = z.object({
  version: z.literal(1),
  updatedAt: z.string().max(40),
  site: siteSchema,
  products: z.array(productSchema).max(200).refine((ps) => new Set(ps.map((p) => p.slug)).size === ps.length, "Product links must be unique"),
  slides: z.array(slideSchema).min(1).max(10),
  gallery: z.array(gallerySchema).max(100),
});
