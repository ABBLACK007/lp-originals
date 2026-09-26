"use client";
import { useState } from "react";
import ProductCard from "./ProductCard";
import { categories, type Category, type Product } from "@/lib/products";

type Filter = "all" | Category;

export default function ShopGrid({ items, initial = "all" }: { items: Product[]; initial?: Filter }) {
  const [f, setF] = useState<Filter>(initial);
  const list = f === "all" ? items : items.filter((p) => p.category === f);
  const filters: { id: Filter; label: string; n: number }[] = [
    { id: "all", label: "All", n: items.length },
    ...categories.map((c) => ({ id: c.id, label: c.label, n: items.filter((p) => p.category === c.id).length })),
  ];

  const choose = (id: Filter) => {
    setF(id);
    // Keep the URL shareable (e.g. /shop?category=slides) without a navigation.
    const url = new URL(window.location.href);
    if (id === "all") url.searchParams.delete("category"); else url.searchParams.set("category", id);
    window.history.replaceState(null, "", url);
  };

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="Filter by style" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
        {filters.map((x) => (
          <button key={x.id} type="button" onClick={() => choose(x.id)} aria-pressed={f === x.id}
            className={`shrink-0 rounded-full px-5 py-3 text-sm transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97] ${f === x.id ? "bg-ink text-white" : "bg-sand text-text hover:bg-line"}`}>
            {x.label} <span className={f === x.id ? "text-white/60" : "text-muted"}>{x.n}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
        {list.map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
    </div>
  );
}
