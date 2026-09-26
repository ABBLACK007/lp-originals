import type { GalleryItem } from "@/components/GalleryGrid";
import { images, photos } from "./images";

// Gallery order: product photos (real LP pairs) mixed with campaign shots (AI-generated, labelled "Campaign").
export const gallery: GalleryItem[] = [
  { src: photos.buckleGroup, alt: "Two-buckle cork sandals in rust, orange and tan suede", kind: "product", product: "two-buckle-sandal-rust" },
  { src: images.heroMobile, alt: "Agbada and cork sandals on a city street", kind: "campaign" },
  { src: photos.cutoutRed, alt: "Red croc-embossed cut-out slides in a gift box", kind: "product", product: "cut-out-slide-red" },
  { src: photos.corkCollection, alt: "Suede cork slides in tan, black and dark brown", kind: "product", product: "wide-band-slide-tan" },
  { src: images.promo, alt: "Ankara dress with tan slides", kind: "campaign" },
  { src: photos.toePostCream, alt: "Women's toe-post sandals with cream straps", kind: "product", product: "toe-post-sandal-cream" },
  { src: images.buckle, alt: "Metal buckle on a leather strap", kind: "campaign" },
  { src: photos.bandChocolate, alt: "Brown suede single-band slide on a cork sole", kind: "product", product: "single-band-slide-brown" },
  { src: images.ordering, alt: "Four pairs of two-strap sandals", kind: "campaign" },
  { src: photos.crossSlideBlack, alt: "Men's black cross-over slides in their boxes", kind: "product", product: "cross-over-slide-black" },
  { src: images.sole, alt: "Rubber sole and cork midsole close-up", kind: "campaign" },
  { src: images.heroDesktop, alt: "Two friends at a street café in cork sandals", kind: "campaign" },
];
