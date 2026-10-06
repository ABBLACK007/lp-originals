"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartProvider";
import SandalArt from "./SandalArt";
import { getProduct } from "@/lib/products";
import { formatNaira, whatsappLink } from "@/lib/site";

export default function CartView() {
  const { items, setQty, remove } = useCart();
  const lines = items.map((i) => ({ ...i, p: getProduct(i.slug)! })).filter((l) => l.p);

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-5 rounded-panel bg-dune p-8">
        <p className="text-lg">Your cart is empty. Pick a style and size to get started.</p>
        <Link href="/shop" className="btn btn-gold">Shop all styles</Link>
      </div>
    );
  }

  const priced = lines.every((l) => l.p.price !== null);
  const total = priced ? lines.reduce((n, l) => n + (l.p.price ?? 0) * l.qty, 0) : null;
  const message = "these pairs:\n" +lines.map((l) => `- ${l.qty} x ${l.p.name} (${l.p.material}), EU ${l.size}`).join("\n");

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_380px]">
      <ul className="flex flex-col divide-y divide-line">
        {lines.map((l) => (
          <li key={l.slug + l.size} className="flex gap-4 py-5">
            <Link href={`/shop/${l.slug}`} className="relative flex aspect-[4/5] w-24 shrink-0 items-center justify-center overflow-hidden rounded-card bg-sand">
              {l.p.images[0]
                ? <Image src={l.p.images[0]} alt={`${l.p.name}, ${l.p.material}`} fill sizes="96px" className="object-cover" />
                : <SandalArt style={l.p.art.style} strap={l.p.art.strap} className="w-20" />}
            </Link>
            <div className="flex flex-grow flex-col gap-1">
              <Link href={`/shop/${l.slug}`} className="font-medium no-underline">{l.p.name}</Link>
              <span className="text-sm text-muted">{l.p.material}, EU {l.size}</span>
              <span className="text-sm">{formatNaira(l.p.price)}</span>
              <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty(l.slug, l.size, l.qty - 1)} disabled={l.qty <= 1}
                    className="h-11 w-11 rounded-full bg-sand transition-transform active:scale-[0.94] disabled:opacity-40">−</button>
                  <span className="w-6 text-center" aria-live="polite">{l.qty}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty(l.slug, l.size, l.qty + 1)} disabled={l.qty >= 20}
                    className="h-11 w-11 rounded-full bg-sand transition-transform active:scale-[0.94] disabled:opacity-40">+</button>
                </div>
                <button type="button" onClick={() => remove(l.slug, l.size)} className="link py-2 text-sm">Remove</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="flex h-fit flex-col gap-4 rounded-panel bg-dune p-6 md:sticky md:top-24">
        <div className="flex justify-between text-lg"><span>Total</span><span className="font-medium">{formatNaira(total)}</span></div>
        <p className="text-sm text-muted">Delivery fee is confirmed at checkout.</p>
        <Link href="/receipt" className="btn btn-ink">Get your receipt</Link>
        {/* TODO(Claude Code): wire Paystack inline checkout here. */}
        <button type="button" disabled className="btn btn-gold opacity-50" title="Paystack checkout not connected yet">Pay with card or transfer</button>
        <a href={whatsappLink(message)} target="_blank" rel="noreferrer" className="btn btn-outline">Order on WhatsApp</a>
      </aside>
    </div>
  );
}
