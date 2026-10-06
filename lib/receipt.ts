// Order receipts generated from the cart, in the customer's browser. There is no payment yet, so a
// receipt is an order summary marked "payment pending"; WhatsApp is how the order reaches LP Wears.
import type { CartItem } from "@/components/CartProvider";
import { getProduct } from "./products";
import { formatNaira } from "./site";

export type ReceiptLine = { slug: string; name: string; material: string; size: string; qty: number; unitPrice: number | null };
export type Receipt = {
  id: string; // e.g. LPW-261006-4F7K
  createdAt: string; // ISO date
  signature: string; // cart contents the receipt was made from
  lines: ReceiptLine[];
  subtotal: number | null; // null while any price is still a placeholder
  customer: { name: string; phone: string };
};

const KEY = "lp-receipt-v1";

export const cartSignature = (items: CartItem[]) =>
  items.map((i) => `${i.slug}:${i.size}:${i.qty}`).sort().join("|");

function newId(date: Date) {
  const ymd = date.toISOString().slice(2, 10).replace(/-/g, "");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  const rnd = crypto.getRandomValues(new Uint8Array(4));
  return `LPW-${ymd}-${Array.from(rnd, (b) => alphabet[b % alphabet.length]).join("")}`;
}

export function buildReceipt(items: CartItem[], customer = { name: "", phone: "" }): Receipt {
  const lines = items.flatMap((i) => {
    const p = getProduct(i.slug);
    return p ? [{ slug: i.slug, name: p.name, material: p.material, size: i.size, qty: i.qty, unitPrice: p.price }] : [];
  });
  const priced = lines.every((l) => l.unitPrice !== null);
  const now = new Date();
  return {
    id: newId(now),
    createdAt: now.toISOString(),
    signature: cartSignature(items),
    lines,
    subtotal: priced ? lines.reduce((n, l) => n + (l.unitPrice ?? 0) * l.qty, 0) : null,
    customer,
  };
}

// Same cart -> same receipt (number and date stay put on refresh); a changed cart gets a new receipt.
export function receiptForCart(items: CartItem[]): Receipt {
  const sig = cartSignature(items);
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as Receipt | null;
    if (saved && saved.signature === sig && typeof saved.id === "string") return saved;
    const r = buildReceipt(items, saved?.customer ?? { name: "", phone: "" });
    localStorage.setItem(KEY, JSON.stringify(r));
    return r;
  } catch {
    return buildReceipt(items);
  }
}

export function saveReceipt(r: Receipt) {
  try { localStorage.setItem(KEY, JSON.stringify(r)); } catch {}
}

// Plain-text version sent on WhatsApp.
export function receiptText(r: Receipt) {
  const rows = r.lines.map((l) => `- ${l.qty} x ${l.name} (${l.material}), EU ${l.size}: ${formatNaira(l.unitPrice === null ? null : l.unitPrice * l.qty)}`);
  return [
    `my order. Receipt ${r.id} (${new Date(r.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })})`,
    ...rows,
    `Subtotal: ${formatNaira(r.subtotal)} (delivery to be confirmed)`,
    r.customer.name && `Name: ${r.customer.name}`,
    r.customer.phone && `Phone: ${r.customer.phone}`,
  ].filter(Boolean).join("\n");
}
