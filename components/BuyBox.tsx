"use client";
import { createContext, useContext, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
import QtyStepper from "./QtyStepper";
import { useCart } from "./CartProvider";
import { sizes, type Product } from "@/lib/content-types";
import { formatNaira } from "@/lib/site";
import { useWhatsapp } from "./StoreProvider";

export type Colour = { slug: string; material: string; strap: string; current: boolean };

// The chosen size and quantity, for the WhatsApp link further down the page (inside the Delivery fold-out).
const Choice = createContext<{ size: string | null; qty: number }>({ size: null, qty: 1 });

export function OrderOnWhatsApp({ product }: { product: Product }) {
  const { size, qty } = useContext(Choice);
  const whatsappLink = useWhatsapp();
  const want = `${qty > 1 ? `${qty} pairs of ` : ""}the ${product.name} (${product.material})${size ? `, EU size ${size}.` : ", EU size "}`;
  return <a href={whatsappLink(want)} target="_blank" rel="noreferrer" className="link font-medium text-ink">Order on WhatsApp</a>;
}

// The mockup's buy area: Colours (dots) with the quantity pill, a row of size chips, and "Buy now for …" +
// "Add to cart" fixed above the tab bar.
export default function BuyBox({ product, colours, children }: { product: Product; colours: Colour[]; children?: React.ReactNode }) {
  const { add } = useCart();
  const router = useRouter();
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);
  const sizeRow = useRef<HTMLDivElement>(null);

  const ready = () => {
    if (size) return true;
    setError(true);
    sizeRow.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  };
  const onAdd = () => { if (!ready()) return; add(product.slug, size!, qty); setAdded(true); setError(false); navigator.vibrate?.(10); };
  const onBuy = () => { if (!ready()) return; add(product.slug, size!, qty); router.push("/cart"); };
  const total = product.price === null ? null : product.price * qty;

  return (
    <Choice.Provider value={{ size, qty }}>
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="text-[16px] font-medium">Colours</span>
          <div className="flex items-center gap-2.5" role="group" aria-label="Colours">
            {colours.map((c) => {
              const dot = <span className="block h-[22px] w-[22px] rounded-full border border-black/10" style={{ background: c.strap }} />;
              return c.current
                ? <span key={c.slug} aria-current="true" title={c.material} className="rounded-full p-[2px] ring-[1.5px] ring-ink">{dot}<span className="sr-only">{c.material} (selected)</span></span>
                : <Link key={c.slug} href={`/shop/${c.slug}`} aria-label={`${product.name} in ${c.material}`} title={c.material}
                    className="relative rounded-full p-[2px] transition-transform duration-150 ease-out active:scale-[0.9]"><span aria-hidden="true" className="absolute -inset-2" />{dot}</Link>;
            })}
          </div>
        </div>
        <QtyStepper value={qty} onChange={(n) => { setQty(Math.min(20, Math.max(1, n))); setAdded(false); }} />
      </div>

      <div ref={sizeRow} className="flex flex-col gap-2">
        <div role="group" aria-labelledby="size-label" className="flex items-center gap-3.5">
          <span id="size-label" className="shrink-0 text-[16px] font-medium">Size <span className="sr-only">(EU)</span></span>
          <div className="no-scrollbar -mr-6 flex gap-2 overflow-x-auto py-1 pr-6">
            {sizes.map((s) => (
              <button key={s} type="button" onClick={() => { setSize(s); setError(false); setAdded(false); }} aria-pressed={size === s}
                className={`h-[34px] min-w-[46px] shrink-0 rounded-[4px] border px-2 font-read text-[14px] transition-[background-color,color,border-color,transform] duration-150 ease-out active:scale-[0.94]
                  ${size === s ? "border-ink bg-ink text-white" : "border-[#C8C8C8] bg-[#F2F2F2] text-ink hover:border-ink"}`}>{s}</button>
            ))}
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-bad">Choose a size to add this pair to your cart.</p>}
      </div>

      {/* Buttons above the tab bar */}
      <div className="fixed bottom-[calc(68px+env(safe-area-inset-bottom))] left-1/2 z-30 w-full max-w-app -translate-x-1/2 bg-white px-6 pb-7 pt-3 print:hidden">
        {added && <p role="status" className="mb-2 flex items-center gap-1.5 text-[13px]"><Icon name="check" size={15} />Added to cart, EU {size}. <Link href="/cart" className="link">View cart</Link></p>}
        <div className="flex gap-3">
          <button type="button" onClick={onBuy} className="flex h-[46px] flex-[1.7] items-center justify-center rounded-[5px] bg-ink px-3 text-[15px] font-medium text-white transition-[transform,background-color] duration-150 ease-out hover:bg-char active:scale-[0.97]">
            <span>Buy now{total !== null && <> for <span className="tabular">{formatNaira(total)}</span></>}</span>
          </button>
          <button type="button" onClick={onAdd} className="flex h-[46px] flex-1 items-center justify-center rounded-[5px] border border-[#C8C8C8] bg-[#F2F2F2] px-3 text-[15px] font-medium text-ink transition-[transform,border-color] duration-150 ease-out hover:border-ink active:scale-[0.97]">Add to cart</button>
        </div>
      </div>
      {children}
    </div>
    </Choice.Provider>
  );
}
