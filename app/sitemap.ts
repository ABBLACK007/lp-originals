import type { MetadataRoute } from "next";
import { getContent, visibleProducts } from "@/lib/content";
import { categories } from "@/lib/content-types";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = visibleProducts(await getContent());
  const pages = ["", "/shop", "/gallery", "/help"].map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "weekly" as const, priority: path ? 0.8 : 1 }));
  const items = products.map((p) => ({
    url: `${siteUrl}/shop/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    images: p.images.map((i) => new URL(i.src, siteUrl).toString()),
  }));
  const shelves = categories.map((c) => ({ url: `${siteUrl}/shop/category/${c.id}`, changeFrequency: "weekly" as const, priority: 0.8 }));
  return [...pages, ...shelves, ...items];
}
