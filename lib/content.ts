// Reads the store content (server only). Every save from /admin writes a new file
// (content/store-<time>.json, never overwritten: Blob overwrites are only eventually consistent) and the
// newest one wins. Without saved content (or a Blob token, e.g. a fresh checkout) the built-in defaults are used.
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { list } from "@vercel/blob";
import type { Content, Img, Product, Slide } from "./content-types";
import { assets, defaultContent } from "./content-defaults";
import { contentSchema } from "./content-schema";

export const CONTENT_PREFIX = "content/store-";
export const CONTENT_TAG = "content";
export const contentPath = (time: number) => `${CONTENT_PREFIX}${time}.json`;

// Built-in photos are stored by key, so a rebuild (new hashed file names) never breaks them.
function resolveImg(i: Img): Img {
  const s = i.asset ? assets[i.asset] : undefined;
  return s ? { src: s.src, width: s.width, height: s.height, blurDataURL: s.blurDataURL, asset: i.asset } : i;
}

function resolve(c: Content): Content {
  return {
    ...c,
    products: c.products.map((p) => ({ ...p, images: p.images.map(resolveImg) })),
    slides: c.slides.map((s) => ({ ...s, image: resolveImg(s.image), mobileImage: s.mobileImage && resolveImg(s.mobileImage) })),
    gallery: c.gallery.map((g) => ({ ...g, src: resolveImg(g.src) })),
  };
}

export type StoredVersion = { pathname: string; url: string };

// All saved versions, newest first (uncached; used by the admin save action and the cached reader below).
export async function listVersions(): Promise<StoredVersion[]> {
  const { blobs } = await list({ prefix: CONTENT_PREFIX, limit: 1000 });
  return blobs.map((b) => ({ pathname: b.pathname, url: b.url })).sort((x, y) => y.pathname.localeCompare(x.pathname));
}

export async function readVersion(v: StoredVersion): Promise<Content | null> {
  const res = await fetch(v.url, { cache: "no-store" });
  if (!res.ok) throw new Error(`content fetch ${res.status}`);
  const parsed = contentSchema.safeParse(await res.json());
  if (!parsed.success) {
    console.error("Stored content is invalid", v.pathname, parsed.error.issues.slice(0, 3));
    return null;
  }
  return parsed.data as Content;
}

export async function readLatest(): Promise<Content | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const [latest] = await listVersions();
  return latest ? readVersion(latest) : null;
}

// Cached across requests; the admin save action refreshes it with updateTag(CONTENT_TAG). Errors are not
// cached (the throw skips the cache), so a storage hiccup only affects that one request.
const cachedLatest = unstable_cache(readLatest, ["store-content-v1"], { tags: [CONTENT_TAG], revalidate: 3600 });

async function load(read: () => Promise<Content | null>): Promise<Content> {
  try {
    return resolve((await read()) ?? defaultContent);
  } catch (e) {
    console.error("Could not load stored content, using defaults", e);
    return resolve(defaultContent);
  }
}

// One read per request (shop pages).
export const getContent = cache(() => load(cachedLatest));
// Uncached: the admin editor always starts from the newest saved version.
export const getFreshContent = () => load(readLatest);

// Shop-facing helpers
export const visibleProducts = (c: Content): Product[] => c.products.filter((p) => !p.hidden);
export const visibleSlides = (c: Content): Slide[] =>
  c.slides.filter((s) => !s.hidden && (s.id !== "promo" || c.site.promo.enabled));
export const findProduct = (c: Content, slug: string) => visibleProducts(c).find((p) => p.slug === slug);

// "{promo.title}" style placeholders in slide text are filled from the settings.
export function fillTokens(text: string, c: Content) {
  return text
    .replace(/\{promo\.title\}/g, c.site.promo.title)
    .replace(/\{promo\.discount\}/g, c.site.promo.discount)
    .replace(/\{promo\.dates\}/g, c.site.promo.dates)
    .replace(/\{productionDays\}/g, c.site.productionDays);
}
