// Built-in store content: what the site shows until something is saved from /admin, and the base that
// saved content is merged onto. Product and gallery data mirror the original catalogue.
import type { StaticImageData } from "next/image";
import type { Content, GalleryItem, Img, Product, SiteSettings, Slide } from "./content-types";
import { images, photos } from "./images";

// Every built-in photo, by key. Saved content refers to these by key (Img.asset), not by file path.
export const assets: Record<string, StaticImageData> = { ...images, ...photos };

export function img(key: keyof typeof photos | keyof typeof images): Img {
  const s = assets[key];
  return { src: s.src, width: s.width, height: s.height, blurDataURL: s.blurDataURL, asset: key };
}

export const defaultSite: SiteSettings = {
  name: "LP Wears",
  instagram: "https://www.instagram.com/_lp_originals_/",
  instagramHandle: "@_lp_originals_",
  whatsappNumber: "2347061702536",
  whatsappGreeting: "Hi, I'm from the LP Wears website. I want to get ",
  productionDays: "[X]",
  promo: { enabled: true, title: "Detty December Drop", discount: "[XX]% off", dates: "[DATES]" },
};

// Sample prices (NGN) for launch; the store owner corrects them in /admin.
const cork = "Cork-latex footbed";

export const defaultProducts: Product[] = [
  { slug: "two-buckle-sandal-rust", name: "Two-Buckle Sandal", material: "Rust suede", category: "cork", footbed: cork, price: 28000, isNew: true,
    images: [img("buckleRust"), img("buckleGroup")], art: { style: "two", strap: "#A0522D" } },
  { slug: "wide-band-slide-tan", name: "Wide-Band Slide", material: "Tan suede", category: "cork", footbed: cork, price: 22000, isNew: true,
    images: [img("wideBandTan"), img("corkCollection")], art: { style: "one", strap: "#B8865A" } },
  { slug: "cross-strap-slide-black", name: "Cross-Strap Slide", material: "Black suede", category: "cork", footbed: cork, price: 24000, isNew: true,
    images: [img("crossStrapBlack"), img("corkCollection")], art: { style: "two", strap: "#2B2622" } },
  { slug: "two-strap-slide-dark-brown", name: "Two-Strap Slide", material: "Dark brown suede", category: "cork", footbed: cork, price: 25000, isNew: true,
    images: [img("twoStrapBrown"), img("corkCollection")], art: { style: "two", strap: "#4A3024" } },
  { slug: "single-band-slide-brown", name: "Single-Band Slide", material: "Brown suede", category: "cork", footbed: cork, price: 22000, isNew: true,
    images: [img("bandChocolate"), img("corkFootbed")], art: { style: "one", strap: "#6E4B2F" } },
  { slug: "platform-toe-post-brown", name: "Platform Toe-Post Sandal", material: "Brown suede strap", category: "slides", price: 20000, isNew: true,
    images: [img("platformToePost")], art: { style: "one", strap: "#7A4E2D" } },
  { slug: "stitched-cut-out-slide-black", name: "Stitched Cut-Out Slide", material: "Black leather, white stitching", category: "slides", price: 18000, isNew: true,
    images: [img("stitchedBlack"), img("slidesTrio")], art: { style: "one", strap: "#1E1B18" } },
  { slug: "stitched-cut-out-slide-green", name: "Stitched Cut-Out Slide", material: "Black leather, green velvet footbed", category: "slides", price: 19500, isNew: true,
    images: [img("stitchedGreen"), img("slidesTrio")], art: { style: "one", strap: "#1F3B2A" } },
  { slug: "woven-strap-slide-olive", name: "Woven Strap Slide", material: "Olive croc-embossed leather", category: "slides", price: 21000, isNew: true,
    images: [img("wovenOlive"), img("slidesTrio")], art: { style: "one", strap: "#4B4A2E" } },
  { slug: "cut-out-slide-red", name: "Cut-Out Slide", material: "Red croc-embossed leather", category: "slides", price: 18000, isNew: true,
    images: [img("cutoutRed")], art: { style: "one", strap: "#B3261E" } },
  { slug: "perforated-cut-out-slide-brown", name: "Perforated Cut-Out Slide", material: "Brown perforated leather", category: "slides", price: 19000, isNew: true,
    images: [img("perforatedBrown")], art: { style: "one", strap: "#8A6E5C" } },
  { slug: "cross-over-slide-black", name: "Cross-Over Slide", material: "Black suede and textured leather", category: "slides", audience: "Men", price: 20000, isNew: true,
    images: [img("crossSlideBlack")], art: { style: "two", strap: "#1E1B18" } },
  { slug: "toe-post-sandal-cream", name: "Toe-Post Sandal", material: "Cream leather straps", category: "slides", audience: "Women", price: 16500, isNew: true,
    images: [img("toePostCream")], art: { style: "one", strap: "#E8D9A8" } },
  { slug: "closed-toe-clog-mocha", name: "Closed-Toe Clog", material: "Mocha suede", category: "clogs", footbed: cork, price: 32000, isNew: true,
    images: [img("clogMocha")], art: { style: "clog", strap: "#6B6058" } },
];

export const defaultSlides: Slide[] = [
  { id: "handmade", image: img("heroDesktop"), mobileImage: img("heroMobile"),
    eyebrow: "HANDMADE IN NIGERIA", title: "Handmade comfort for every step",
    sub: "Cork-footbed sandals, slides, palms and clogs, made by hand and built to go from native wear to street wear.",
    ctas: [{ label: "Shop now", href: "/shop", style: "gold" }, { label: "WhatsApp order", href: "whatsapp", style: "outline" }] },
  { id: "buckle", image: img("buckleGroup"), focus: "60% 50%", shade: "left",
    eyebrow: "NEW DROP", title: "The two-buckle sandal",
    sub: "Rust suede on a contoured cork-latex footbed, with adjustable metal buckles.",
    ctas: [{ label: "Shop the sandal", href: "/shop/two-buckle-sandal-rust", style: "gold" }, { label: "All cork footbed", href: "/shop?category=cork", style: "outline" }] },
  { id: "promo", image: img("promo"), focus: "70% 50%",
    eyebrow: "{promo.title}", title: "{promo.discount}, sitewide",
    sub: "Our festive drop, {promo.dates}. Order early: every pair is made to order.",
    ctas: [{ label: "Shop the sale", href: "/shop", style: "gold" }] },
  { id: "slides", image: img("stitchedBlack"), focus: "50% 65%", shade: "left",
    eyebrow: "SLIDES & PALMS", title: "Flat out easy",
    sub: "Leather slides and palms for native and street wear, for men and women.",
    ctas: [{ label: "Shop slides & palms", href: "/shop?category=slides", style: "gold" }] },
  { id: "order", image: img("slidesTrio"), focus: "55% 60%", shade: "left",
    eyebrow: "MADE TO ORDER", title: "Your size, your pair",
    sub: "Choose your style and EU size, pay online or on WhatsApp, and we deliver nationwide.",
    ctas: [{ label: "How to order", href: "#ordering", style: "gold" }, { label: "Chat on WhatsApp", href: "whatsapp", style: "outline" }] },
];

export const defaultGallery: GalleryItem[] = [
  { src: img("slidesTrio"), alt: "LP Wears slides in olive, black and green, with LP labels", kind: "product", product: "stitched-cut-out-slide-black" },
  { src: img("platformToePost"), alt: "Brown platform toe-post sandals beside the LP Wears card", kind: "product", product: "platform-toe-post-brown" },
  { src: img("stitchedBlack"), alt: "Black stitched cut-out slides beside the LP Wears card", kind: "product", product: "stitched-cut-out-slide-black" },
  { src: img("buckleGroup"), alt: "Two-buckle cork sandals in rust, orange and tan suede", kind: "product", product: "two-buckle-sandal-rust" },
  { src: img("heroMobile"), alt: "Agbada and cork sandals on a city street", kind: "campaign" },
  { src: img("cutoutRed"), alt: "Red croc-embossed cut-out slides in a gift box", kind: "product", product: "cut-out-slide-red" },
  { src: img("perforatedBrown"), alt: "Brown perforated cut-out slides held up on a street", kind: "product", product: "perforated-cut-out-slide-brown" },
  { src: img("corkCollection"), alt: "Suede cork slides in tan, black and dark brown", kind: "product", product: "wide-band-slide-tan" },
  { src: img("promo"), alt: "Ankara dress with tan slides", kind: "campaign" },
  { src: img("toePostCream"), alt: "Women's toe-post sandals with cream straps", kind: "product", product: "toe-post-sandal-cream" },
  { src: img("clogMocha"), alt: "Mocha suede closed-toe clog with a cork footbed", kind: "product", product: "closed-toe-clog-mocha" },
  { src: img("buckle"), alt: "Metal buckle on a leather strap", kind: "campaign" },
  { src: img("bandChocolate"), alt: "Brown suede single-band slide on a cork sole", kind: "product", product: "single-band-slide-brown" },
  { src: img("ordering"), alt: "Four pairs of two-strap sandals", kind: "campaign" },
  { src: img("crossSlideBlack"), alt: "Men's black cross-over slides in their boxes", kind: "product", product: "cross-over-slide-black" },
  { src: img("sole"), alt: "Rubber sole and cork midsole close-up", kind: "campaign" },
  { src: img("heroDesktop"), alt: "Two friends at a street café in cork sandals", kind: "campaign" },
];

export const defaultContent: Content = {
  version: 1,
  updatedAt: "1970-01-01T00:00:00.000Z",
  site: defaultSite,
  products: defaultProducts,
  slides: defaultSlides,
  gallery: defaultGallery,
};
