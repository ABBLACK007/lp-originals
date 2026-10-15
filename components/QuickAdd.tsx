"use client";
import Image from "next/image";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useCart } from "./CartProvider";
import { useWhatsapp } from "./StoreProvider";
import { sizes, type Product } from "@/lib/content-types";
import { formatNaira } from "@/lib/site";

// The cart button on a product tile opens this sheet: pick a size, add to cart, without leaving the grid.
// A native <dialog> gives focus trapping, Esc to close and an inert page for free. Bottom sheet on phones,
// centred card on wider screens.
const QuickAddContext = createContext<(p: Product) => void>(() => {});
export const useQuickAdd = () => useContext(QuickAddContext);

export function QuickAddProvider({ children }: { children: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const open = useCallback((p: Product) => { setProduct(p); dialog.current?.showModal(); }, []);
  return (
    <QuickAddContext.Provider value={open}>
      {children}
      <dialog ref={dialog} aria-label="Choose a size" onClose={() => setProduct(null)}
        onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}
        className="sheet fixed inset-x-0 bottom-0 top-auto m-0 max-h-[88dvh] w-full max-w-none overflow-y-auto rounded-t-[24px] bg-white p-0 text-ink shadow-float open:animate-sheet-up
          md:inset-0 md:m-auto md:max-w-[440px] md:rounded-panel md:open:animate-pop-in">
        {product && <Sheet key={product.slug} p={product} close={() => dialog.current?.close()} />}
      </dialog>
    </QuickAddContext.Provider>
  );
}

function Sheet({ p, close }: { p: Product; close: () => void }) {
  const { add } = useCart();
  const whatsappLink = useWhatsapp();
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const firstSize = useRef<HTMLButtonElement>(null);
  useEffect(() => { firstSize.current?.focus({ preventScroll: true }); }, []);

  const onAdd = () => {
    if (!size) { setError(true); return; }
    add(p.slug, size);
    setAdded(true);
    navigator.vibrate?.(10);
  };

  return (
    <div className="flex flex-col gap-5 px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-3 md:p-6">
      <span aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-line md:hidden" />
      <div className="flex items-start gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-chip bg-tile">
          {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="80px" className="object-cover" />}
        </div>
        <div className="flex min-w-0 flex-grow flex-col">
          <span className="text-base font-semibold leading-snug">{p.name}</span>
          <span className="text-[13px] text-muted">{p.material}</span>
          <span className="tabular mt-1 text-[15px] font-semibold">{formatNaira(p.price)}</span>
        </div>
        <button type="button" onClick={close} aria-label="Close" className="icon-btn -mr-1 -mt-1"><Icon name="close" size={18} /></button>
      </div>

      {added ? (
        <div className="flex flex-col gap-4" role="status">
          <p className="flex items-center gap-2 text-[15px] font-medium"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white"><Icon name="check" size={16} strokeWidth={2.2} /></span>Added to cart, EU {size}</p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={close} className="btn btn-secondary">Keep shopping</button>
            <Link href="/cart" onClick={close} className="btn btn-primary">View cart</Link>
          </div>
        </div>
      ) : (
        <>
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-sm font-semibold">EU size {size && <span className="font-normal text-muted">· {size}</span>}</legend>
            <div className="grid grid-cols-6 gap-2">
              {sizes.map((s, n) => (
                <button key={s} ref={n === 0 ? firstSize : undefined} type="button" aria-pressed={size === s}
                  onClick={() => { setSize(s); setError(false); }} className="chip px-0">{s}</button>
              ))}
            </div>
            {error && <p role="alert" className="text-sm text-bad">Choose a size first.</p>}
          </fieldset>
          <div className="flex flex-col gap-3">
            <button type="button" onClick={onAdd} className="btn btn-primary w-full">Add to cart</button>
            <div className="flex items-center justify-between gap-3 text-sm">
              <Link href={`/shop/${p.slug}`} onClick={close} className="link">See full details</Link>
              <a href={whatsappLink(`the ${p.name} (${p.material})${size ? `, EU size ${size}.` : ", EU size "}`)} target="_blank" rel="noreferrer" className="link">Order on WhatsApp</a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
