// Catalogue built from the client's product photos. Names and materials describe what the photos show;
// confirm them (and add prices) with the client. Move to a CMS (e.g. Sanity) once confirmed.
import type { StaticImageData } from "next/image";
import { photos } from "./images";

export type Category = "cork" | "slides" | "clogs";
export type SandalStyle = "two" | "one" | "clog";

export const categories: { id: Category; label: string; blurb: string }[] = [
  { id: "cork", label: "Cork footbed", blurb: "Buckle sandals and suede slides on a contoured cork footbed." },
  { id: "slides", label: "Slides & palms", blurb: "Flat leather slides and palms for native and street wear." },
  { id: "clogs", label: "Clogs", blurb: "Closed-toe clogs on a cork footbed." },
];

export type Product = {
  slug: string;
  name: string;
  material: string;
  category: Category;
  footbed?: string;
  audience?: "Men" | "Women";
  price: number | null; // NGN; null shows "[PRICE]"
  isNew?: boolean;
  images: StaticImageData[]; // first image is the main one
  art: { style: SandalStyle; strap: string }; // drawn placeholder when there are no photos yet
};

export const sizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

const cork = "Cork-latex footbed";

export const products: Product[] = [
  { slug: "two-buckle-sandal-rust", name: "Two-Buckle Sandal", material: "Rust suede", category: "cork", footbed: cork, price: null, isNew: true,
    images: [photos.buckleRust, photos.buckleGroup], art: { style: "two", strap: "#A0522D" } },
  { slug: "wide-band-slide-tan", name: "Wide-Band Slide", material: "Tan suede", category: "cork", footbed: cork, price: null, isNew: true,
    images: [photos.wideBandTan, photos.corkCollection], art: { style: "one", strap: "#B8865A" } },
  { slug: "cross-strap-slide-black", name: "Cross-Strap Slide", material: "Black suede", category: "cork", footbed: cork, price: null, isNew: true,
    images: [photos.crossStrapBlack, photos.corkCollection], art: { style: "two", strap: "#2B2622" } },
  { slug: "two-strap-slide-dark-brown", name: "Two-Strap Slide", material: "Dark brown suede", category: "cork", footbed: cork, price: null, isNew: true,
    images: [photos.twoStrapBrown, photos.corkCollection], art: { style: "two", strap: "#4A3024" } },
  { slug: "single-band-slide-brown", name: "Single-Band Slide", material: "Brown suede", category: "cork", footbed: cork, price: null, isNew: true,
    images: [photos.bandChocolate, photos.corkFootbed], art: { style: "one", strap: "#6E4B2F" } },
  { slug: "cut-out-slide-red", name: "Cut-Out Slide", material: "Red croc-embossed leather", category: "slides", price: null, isNew: true,
    images: [photos.cutoutRed], art: { style: "one", strap: "#B3261E" } },
  { slug: "perforated-cut-out-slide-brown", name: "Perforated Cut-Out Slide", material: "Brown perforated leather", category: "slides", price: null, isNew: true,
    images: [photos.perforatedBrown], art: { style: "one", strap: "#8A6E5C" } },
  { slug: "cross-over-slide-black", name: "Cross-Over Slide", material: "Black suede and textured leather", category: "slides", audience: "Men", price: null, isNew: true,
    images: [photos.crossSlideBlack], art: { style: "two", strap: "#1E1B18" } },
  { slug: "toe-post-sandal-cream", name: "Toe-Post Sandal", material: "Cream leather straps", category: "slides", audience: "Women", price: null, isNew: true,
    images: [photos.toePostCream], art: { style: "one", strap: "#E8D9A8" } },
  { slug: "closed-toe-clog-mocha", name: "Closed-Toe Clog", material: "Mocha suede", category: "clogs", footbed: cork, price: null, isNew: true,
    images: [photos.clogMocha], art: { style: "clog", strap: "#6B6058" } },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const categoryLabel = (c: Category) => categories.find((x) => x.id === c)!.label;
export const countIn = (c: Category) => products.filter((p) => p.category === c).length;
