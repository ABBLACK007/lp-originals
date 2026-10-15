"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { sizes, type Product } from "@/lib/content-types";
import { formatNaira } from "@/lib/site";
import { useWhatsapp } from "./StoreProvider";

export default function BuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const whatsappLink = useWhatsapp();
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const sizeGroup = useRef<HTMLFieldSetElement>(null);
  const [showBar, setShowBar] = useState(false);

  // Phones: once the buy buttons scroll out of view, keep a compact "Add to cart" bar at the bottom.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onAdd = () => {
    if (!size) {
      setError(true);
      sizeGroup.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    add(product.slug, size); setAdded(true); setError(false);
  };

  return (
    <div ref={box} className="flex flex-col gap-5">
      <fieldset ref={sizeGroup} className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-semibold">EU size {size && <span className="font-normal text-muted">· {size} selected</span>}</legend>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button key={s} type="button" onClick={() => { setSize(s); setError(false); setAdded(false); }} aria-pressed={size === s}
              className={`h-12 w-12 rounded-xl border text-sm transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.94] ${size === s ? "border-ink bg-ink text-white" : "border-[#CFC6B9] bg-[#F6F3EE] hover:border-ink"}`}>{s}</button>
          ))}
        </div>
        {error && <p role="alert" className="text-sm text-[#8A2E2E]">Choose a size to add this pair to your cart.</p>}
      </fieldset>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onAdd} className="btn btn-gold">Add to cart</button>
        <a href={whatsappLink(`the ${product.name} (${product.material})${size ? `, EU size ${size}.` : ", EU size "}`)} target="_blank" rel="noreferrer"
          className="btn btn-outline">Order on WhatsApp</a>
      </div>
      {added && <p role="status" className="text-sm">Added to cart. <Link href="/cart" className="link">View cart</Link> · <Link href="/receipt" className="link">Get your receipt</Link></p>}

      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex animate-fade-in items-center gap-3 glass-strong px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
          <div className="flex min-w-0 flex-grow flex-col">
            <span className="truncate text-sm font-medium">{product.name}</span>
            <span className="text-xs text-muted">{formatNaira(product.price)}{size ? ` · EU ${size}` : " · choose a size"}</span>
          </div>
          {added
            ? <Link href="/cart" className="btn btn-ink btn-sm shrink-0">View cart</Link>
            : <button type="button" onClick={onAdd} className="btn btn-gold btn-sm shrink-0">{size ? "Add to cart" : "Choose size"}</button>}
        </div>
      )}
    </div>
  );
}
