"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
import QtyStepper from "./QtyStepper";
import { useCart } from "./CartProvider";
import { sizes, type Product } from "@/lib/content-types";
import { formatNaira } from "@/lib/site";
import { useWhatsapp } from "./StoreProvider";

export type Colour = { slug: string; material: string; strap: string; current: boolean };

// Colour, quantity and size, then Buy now (to the cart) or Add to cart; WhatsApp as the direct route.
export default function BuyBox({ product, colours }: { product: Product; colours: Colour[] }) {
  const { add } = useCart();
  const router = useRouter();
  const whatsappLink = useWhatsapp();
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const sizeGroup = useRef<HTMLFieldSetElement>(null);
  const [showBar, setShowBar] = useState(false);

  // Phones: once the buy buttons scroll out of view, keep a compact bar above the tab bar.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ready = () => {
    if (size) return true;
    setError(true);
    sizeGroup.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  };
  const onAdd = () => { if (!ready()) return; add(product.slug, size!, qty); setAdded(true); setError(false); navigator.vibrate?.(10); };
  const onBuy = () => { if (!ready()) return; add(product.slug, size!, qty); router.push("/cart"); };
  const total = product.price === null ? null : product.price * qty;
  const want = `${qty > 1 ? `${qty} pairs of ` : ""}the ${product.name} (${product.material})${size ? `, EU size ${size}.` : ", EU size "}`;

  return (
    <div ref={box} className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2.5">
          <span className="truncate text-sm font-semibold">Colour <span className="font-normal text-muted">· {product.material}</span></span>
          <div className="flex gap-2.5" role="group" aria-label="Colours">
            {colours.map((c) => {
              const dot = <span className="block h-7 w-7 rounded-full border border-black/10" style={{ background: c.strap }} />;
              return c.current
                ? <span key={c.slug} aria-current="true" title={c.material} className="rounded-full p-[3px] ring-2 ring-ink">{dot}<span className="sr-only">{c.material} (selected)</span></span>
                : <Link key={c.slug} href={`/shop/${c.slug}`} aria-label={`${product.name} in ${c.material}`} title={c.material}
                    className="rounded-full p-[3px] ring-1 ring-line transition-[box-shadow,transform] duration-150 ease-out hover:ring-ink active:scale-[0.92]">{dot}</Link>;
            })}
          </div>
        </div>
        <div className="shrink-0"><QtyStepper value={qty} onChange={(n) => { setQty(Math.min(20, Math.max(1, n))); setAdded(false); }} /></div>
      </div>

      <fieldset ref={sizeGroup} className="flex flex-col gap-3">
        <legend className="mb-3 flex w-full items-center justify-between text-sm font-semibold">
          <span>EU size {size && <span className="font-normal text-muted">· {size} selected</span>}</span>
          <Link href="/shop#size-guide" className="link text-[13px] font-normal text-muted">Size guide</Link>
        </legend>
        {/* 6 per row on phones, all 11 in one row on wide screens */}
        <div className="grid grid-cols-6 gap-2 xl:grid-cols-11">
          {sizes.map((s) => (
            <button key={s} type="button" onClick={() => { setSize(s); setError(false); setAdded(false); }} aria-pressed={size === s} className="chip px-0">{s}</button>
          ))}
        </div>
        {error && <p role="alert" className="text-sm text-bad">Choose a size to add this pair to your cart.</p>}
      </fieldset>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <button type="button" onClick={onBuy} className="btn btn-primary"><span>Buy now{total !== null && <> for <span className="tabular font-semibold">{formatNaira(total)}</span></>}</span></button>
          <button type="button" onClick={onAdd} className="btn btn-secondary">Add to cart</button>
        </div>
        {added && <p role="status" className="flex flex-wrap items-center gap-x-2 text-sm"><Icon name="check" size={16} />Added to cart. <Link href="/cart" className="link">View cart</Link> · <Link href="/receipt" className="link">Get your receipt</Link></p>}
        <a href={whatsappLink(want)} target="_blank" rel="noreferrer" className="btn btn-sm gap-2 self-start px-0 text-ink underline-offset-4 hover:underline">
          <Icon name="chat" size={18} />Order on WhatsApp
        </a>
      </div>

      {showBar && (
        <div className="fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] z-30 flex animate-fade-in items-center gap-3 border-t border-line bg-white px-4 py-3 md:hidden">
          <div className="flex min-w-0 flex-grow flex-col">
            <span className="truncate text-sm font-semibold">{product.name}</span>
            <span className="tabular text-xs text-muted">{formatNaira(product.price)}{size ? ` · EU ${size}` : " · choose a size"}</span>
          </div>
          {added
            ? <Link href="/cart" className="btn btn-primary btn-sm shrink-0">View cart</Link>
            : <button type="button" onClick={onAdd} className="btn btn-primary btn-sm shrink-0">{size ? "Add to cart" : "Choose size"}</button>}
        </div>
      )}
    </div>
  );
}
