import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShopView from "../../ShopView";
import { categories, type Category } from "@/lib/content-types";

// Reached through the /shop?category=<id> rewrite in next.config.mjs; one static page per category.
export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ category: c.id }));

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const c = categories.find((x) => x.id === category);
  return {
    title: c ? `Shop ${c.label.toLowerCase()}` : "Shop all styles",
    description: c?.blurb,
    alternates: { canonical: c ? `/shop?category=${c.id}` : "/shop" },
  };
}

export default async function ShopCategory({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!categories.some((c) => c.id === category)) notFound();
  return <ShopView initial={category as Category} />;
}
