"use client";
import Link from "next/link";
import Icon from "./Icon";
import ProductCard from "./ProductCard";
import { useSaved } from "./SavedProvider";
import { useProducts } from "./StoreProvider";

export default function SavedView() {
  const { slugs, ready } = useSaved();
  const { getProduct } = useProducts();
  const items = slugs.map(getProduct).filter((p) => !!p);
  if (!ready) return <p className="text-muted">Loading your saved styles…</p>;
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-panel bg-mist px-6 py-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white"><Icon name="heart" size={24} /></span>
        <p className="text-base font-semibold">No saved styles yet</p>
        <p className="max-w-sm text-sm text-muted">Tap the heart on any pair to keep it here while you decide.</p>
        <Link href="/shop" className="btn btn-primary">Browse the shop</Link>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted" aria-live="polite">{items.length} saved {items.length === 1 ? "style" : "styles"}</p>
      <div className="grid grid-cols-2 gap-3">
        {items.map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
    </div>
  );
}
