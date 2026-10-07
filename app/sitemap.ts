import type { MetadataRoute } from "next";
import { getContent, visibleProducts } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = visibleProducts(await getContent());
  const pages = ["", "/shop", "/gallery"].map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "weekly" as const, priority: path ? 0.8 : 1 }));
  const items = products.map((p) => ({
    url: `${siteUrl}/shop/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    images: p.images.map((i) => new URL(i.src, siteUrl).toString()),
  }));
  return [...pages, ...items];
}
