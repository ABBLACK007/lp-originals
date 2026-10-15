"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import Icon from "./Icon";
import { receiptForCart, receiptText, saveReceipt, type Receipt } from "@/lib/receipt";
import { formatNaira, formatPhone } from "@/lib/site";
import { useProducts, useStore, useWhatsapp } from "./StoreProvider";
import logoDark from "@/public/images/logo-dark.png";

export default function ReceiptView() {
  const { items, ready } = useCart();
  const { site } = useStore();
  const { getProduct } = useProducts();
  const whatsappLink = useWhatsapp();
  const [r, setR] = useState<Receipt | null>(null);

  useEffect(() => { if (ready) setR(items.length ? receiptForCart(items, getProduct) : null); }, [ready, items, getProduct]);

  const setCustomer = (k: "name" | "phone", v: string) => {
    if (!r) return;
    const next = { ...r, customer: { ...r.customer, [k]: v.slice(0, 60) } };
    setR(next); saveReceipt(next);
  };

  if (!ready) return <p className="text-muted">Preparing your receipt…</p>;
  if (!r) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-panel bg-mist px-6 py-14 text-center">
        <p className="text-base font-semibold">No receipt yet</p>
        <p className="max-w-sm text-sm text-muted">Your cart is empty, so there&apos;s no receipt yet. Add a pair to get one.</p>
        <Link href="/shop" className="btn btn-primary">Shop all styles</Link>
      </div>
    );
  }

  const date = new Date(r.createdAt);
  return (
    <div className="grid grid-cols-1 gap-8 print:block">
      {/* The receipt (this is all that prints) */}
      <article aria-label={`Receipt ${r.id}`} className="relative overflow-hidden rounded-panel bg-white p-6 ring-1 ring-line print:rounded-none print:p-0 print:shadow-none print:ring-0">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-dashed border-line pb-6">
          <div className="flex flex-col items-start gap-2">
            <Image src={logoDark} alt="LP Wears" className="h-14 w-auto" />
            <span className="text-xs text-muted">Handmade in Nigeria · WhatsApp {formatPhone(site.whatsappNumber)}</span>
          </div>
          <div className="flex w-full flex-col items-start gap-1 print:w-auto print:items-end print:text-right">
            <span className="text-2xl font-bold uppercase leading-none">Receipt</span>
            <span className="font-mono text-sm">{r.id}</span>
            <span className="text-sm text-muted">{date.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}, {date.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}</span>
            <span className="mt-1 rounded-full bg-tile px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">Payment pending</span>
          </div>
        </div>

        {(r.customer.name || r.customer.phone) && (
          <div className="border-b border-dashed border-line py-4 text-sm">
            <span className="text-muted">Customer: </span>{[r.customer.name, r.customer.phone].filter(Boolean).join(" · ")}
          </div>
        )}

        {/* Line items: a header row on wider screens; each item wraps into two lines on phones */}
        <div className="hidden grid-cols-[1fr_70px_40px_110px_120px] gap-3 border-b border-line py-3 text-xs uppercase tracking-[0.12em] text-muted print:grid">
          <span>Item</span><span>Size</span><span className="text-right">Qty</span><span className="text-right">Price</span><span className="text-right">Amount</span>
        </div>
        <ul>
          {r.lines.map((l) => (
            <li key={l.slug + l.size} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-b border-line/60 py-3 text-sm print:grid-cols-[1fr_70px_40px_110px_120px]">
              <span><span className="font-medium">{l.name}</span><br /><span className="text-muted">{l.material}</span></span>
              <span className="text-right font-medium print:hidden">{formatNaira(l.unitPrice === null ? null : l.unitPrice * l.qty)}</span>
              <span className="col-span-2 text-muted print:hidden">EU {l.size} · Qty {l.qty} · {formatNaira(l.unitPrice)} each</span>
              <span className="hidden print:block">EU {l.size}</span>
              <span className="hidden text-right print:block">{l.qty}</span>
              <span className="hidden whitespace-nowrap text-right print:block">{formatNaira(l.unitPrice)}</span>
              <span className="hidden whitespace-nowrap text-right font-medium print:block">{formatNaira(l.unitPrice === null ? null : l.unitPrice * l.qty)}</span>
            </li>
          ))}
        </ul>

        <dl className="ml-auto mt-5 flex max-w-xs flex-col gap-2 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Items</dt><dd>{r.lines.reduce((n, l) => n + l.qty, 0)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatNaira(r.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>Confirmed on WhatsApp</dd></div>
          <div className="mt-1 flex justify-between border-t border-ink pt-3 text-base font-semibold"><dt>Total due</dt><dd>{formatNaira(r.subtotal)} + delivery</dd></div>
        </dl>

        <p className="mt-8 border-t border-dashed border-line pt-5 text-xs leading-relaxed text-muted">
          Every pair is made to order: production takes {site.productionDays} working days after payment, then we deliver nationwide.
          Quote receipt number <strong className="font-mono text-ink">{r.id}</strong> when you pay or ask about your order. Thank you for shopping LP Wears.
        </p>
      </article>

      {/* Actions (hidden when printing) */}
      <aside className="flex h-fit flex-col gap-4 rounded-panel bg-white p-6 shadow-tile print:hidden">
        <h2 className="text-lg font-semibold">Your details</h2>
        <p className="text-sm text-muted">Optional. They appear on the receipt so we can match your order.</p>
        <label className="flex flex-col gap-1.5 text-sm font-medium">Name
          <input value={r.customer.name} onChange={(e) => setCustomer("name", e.target.value)} autoComplete="name"
            className="field font-normal" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">Phone
          <input value={r.customer.phone} onChange={(e) => setCustomer("phone", e.target.value)} type="tel" inputMode="tel" autoComplete="tel"
            className="field font-normal" />
        </label>
        <a href={whatsappLink(receiptText(r))} target="_blank" rel="noreferrer" className="btn btn-primary mt-2 gap-2"><Icon name="chat" size={18} />Send receipt on WhatsApp</a>
        <button type="button" onClick={() => window.print()} className="btn btn-secondary gap-2"><Icon name="print" size={18} />Download / print (PDF)</button>
        <Link href="/cart" className="link text-center text-sm">Back to cart</Link>
      </aside>
    </div>
  );
}
