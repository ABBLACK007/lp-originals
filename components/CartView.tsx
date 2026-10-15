"use client";
import Link from "next/link";
import Image from "next/image";
import Icon from "./Icon";
import QtyStepper from "./QtyStepper";
import { useCart } from "./CartProvider";
import SandalArt from "./SandalArt";
import { formatNaira } from "@/lib/site";
import { useProducts, useWhatsapp } from "./StoreProvider";

export default function CartView() {
  const { items, ready, setQty, remove } = useCart();
  const { getProduct } = useProducts();
  const whatsappLink = useWhatsapp();
  const lines = items.map((i) => ({ ...i, p: getProduct(i.slug)! })).filter((l) => l.p);

  if (!ready) return <p className="text-muted">Loading your cart…</p>;
  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-panel bg-mist px-6 py-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white"><Icon name="bag" size={24} /></span>
        <p className="text-base font-semibold">Your cart is empty</p>
        <p className="max-w-sm text-sm text-muted">Pick a style and size to get started, or check the styles you saved.</p>
        <div className="flex flex-wrap justify-center gap-3"><Link href="/shop" className="btn btn-primary">Shop all styles</Link><Link href="/saved" className="btn btn-secondary">Saved styles</Link></div>
      </div>
    );
  }

  const priced = lines.every((l) => l.p.price !== null);
  const total = priced ? lines.reduce((n, l) => n + (l.p.price ?? 0) * l.qty, 0) : null;
  const pairs = lines.reduce((n, l) => n + l.qty, 0);
  const message = "these pairs:\n" + lines.map((l) => `- ${l.qty} x ${l.p.name} (${l.p.material}), EU ${l.size}`).join("\n");

  return (
    <div className="grid grid-cols-1 gap-8">
      <ul className="flex flex-col gap-3">
        {lines.map((l) => (
          <li key={l.slug + l.size} className="flex gap-3 rounded-card bg-tile p-3">
            <Link href={`/shop/${l.slug}`} className="relative flex aspect-square w-20 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-white">
              {l.p.cutout
                ? <Image src={l.p.cutout} alt={`${l.p.name}, ${l.p.material}`} fill sizes="112px" className="object-contain p-1.5" />
                : l.p.images[0]
                ? <Image src={l.p.images[0]} alt={`${l.p.name}, ${l.p.material}`} fill sizes="112px" className="object-cover" />
                : <SandalArt style={l.p.art.style} strap={l.p.art.strap} className="w-20" />}
            </Link>
            <div className="flex min-w-0 flex-grow flex-col gap-0.5">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/shop/${l.slug}`} className="font-medium leading-snug no-underline">{l.p.name}</Link>
                <button type="button" onClick={() => remove(l.slug, l.size)} aria-label={`Remove ${l.p.name}, EU ${l.size}`}
                  className="-mr-1 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-white hover:text-ink">
                  <Icon name="trash" size={18} />
                </button>
              </div>
              <span className="truncate text-[13px] text-muted">{l.p.material}, EU {l.size}</span>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-2">
                <span className="tabular text-[15px] font-semibold">{formatNaira(l.p.price === null ? null : l.p.price * l.qty)}</span>
                <QtyStepper value={l.qty} onChange={(n) => setQty(l.slug, l.size, n)} label={`Quantity of ${l.p.name}`} />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="flex h-fit flex-col gap-4 rounded-panel bg-white p-6 shadow-tile">
        <div className="flex justify-between text-sm text-muted"><span>{pairs} {pairs === 1 ? "pair" : "pairs"}</span><span>Delivery confirmed on WhatsApp</span></div>
        <div className="flex items-baseline justify-between border-t border-line pt-4 text-lg"><span className="font-medium">Total</span><span className="tabular font-semibold">{formatNaira(total)}</span></div>
        {/* Ordering happens on WhatsApp for now, so that's the main action. */}
        <a href={whatsappLink(message)} target="_blank" rel="noreferrer" className="btn btn-primary gap-2"><Icon name="chat" size={18} />Order on WhatsApp</a>
        <Link href="/receipt" className="btn btn-secondary">Get your receipt</Link>
        {/* TODO(Claude Code): wire Paystack inline checkout here (and update the copy below and in OrderingSteps). */}
        <p className="text-center text-xs leading-relaxed text-muted">Card payment at checkout is coming soon. For now, send your order on WhatsApp and we&apos;ll confirm payment with you.</p>
      </aside>
    </div>
  );
}
