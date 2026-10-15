// Shapes of the editable store content (products, hero, gallery, settings). Safe to import on the client.
// Content is stored as JSON in Vercel Blob and edited from /admin; lib/content-defaults.ts is the fallback.

// An image the site can render with next/image. Built-in photos keep an `asset` key so their (hashed)
// file path is re-resolved on every build; uploaded photos have a Blob URL in `src`.
export type Img = { src: string; width: number; height: number; blurDataURL?: string; asset?: string };

export type Category = "cork" | "slides" | "clogs";
export type SandalStyle = "two" | "one" | "clog";

export type Product = {
  slug: string;
  name: string;
  material: string;
  category: Category;
  footbed?: string;
  audience?: "Men" | "Women";
  price: number | null; // NGN; null shows "[PRICE]"
  isNew?: boolean;
  hidden?: boolean; // kept in the admin, not shown in the shop
  images: Img[]; // first image is the main one
  art: { style: SandalStyle; strap: string }; // drawn placeholder when there are no photos yet
};

export type SlideCta = { label: string; href: string; style: "gold" | "outline" }; // href "whatsapp" = chat link
export type Slide = {
  id: string;
  hidden?: boolean;
  image: Img; // wide screens
  mobileImage?: Img; // phones (falls back to image)
  focus?: string; // CSS object-position, e.g. "60% 50%"
  shade?: "left" | "none"; // extra dark fade behind the text for bright photos
  eyebrow: string;
  title: string;
  sub: string;
  ctas: SlideCta[];
};

export type GalleryItem = { src: Img; alt: string; kind: "product" | "campaign"; product?: string };

export type SiteSettings = {
  name: string;
  instagram: string;
  instagramHandle: string;
  whatsappNumber: string; // international format, digits only
  whatsappGreeting: string;
  productionDays: string;
  promo: { enabled: boolean; title: string; discount: string; dates: string };
};

export type Content = {
  version: 1;
  updatedAt: string;
  site: SiteSettings;
  products: Product[];
  slides: Slide[];
  gallery: GalleryItem[];
};

export const categories: { id: Category; label: string; blurb: string }[] = [
  { id: "cork", label: "Cork footbed", blurb: "Buckle sandals and suede slides on a contoured cork footbed." },
  { id: "slides", label: "Slides & palms", blurb: "Flat leather slides and palms for native and street wear." },
  { id: "clogs", label: "Clogs", blurb: "Closed-toe clogs on a cork footbed." },
];
export const categoryLabel = (c: Category) => categories.find((x) => x.id === c)?.label ?? c;
export const sizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];
