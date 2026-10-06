"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, sizes } from "@/lib/products";

export type CartItem = { slug: string; size: string; qty: number };
type Cart = {
  items: CartItem[];
  count: number;
  ready: boolean; // saved cart has been read from the browser

  add: (slug: string, size: string) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
  clear: () => void;
};

const CartContext = createContext<Cart | null>(null);
const KEY = "lp-cart-v2"; // v2: catalogue rebuilt from real product photos
const MAX_QTY = 20;
const MAX_LINES = 30;

const isValidItem = (i: unknown): i is CartItem => {
  const x = i as CartItem;
  return !!x && typeof x.slug === "string" && !!getProduct(x.slug) && sizes.includes(x.size)
    && Number.isInteger(x.qty) && x.qty >= 1 && x.qty <= MAX_QTY;
};
const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(n) || 1));

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // Don't write until the saved cart has been read, or the first render's empty cart overwrites it.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // localStorage is user-editable: keep only well-formed lines for real products and sizes.
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) setItems(saved.filter(isValidItem).slice(0, MAX_LINES));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, loaded]);

  const value = useMemo<Cart>(() => ({
    items,
    ready: loaded,
    count: items.reduce((n, i) => n + i.qty, 0),
    add: (slug, size) => setItems((xs) => {
      const hit = xs.find((i) => i.slug === slug && i.size === size);
      if (!getProduct(slug) || !sizes.includes(size)) return xs;
      if (hit) return xs.map((i) => (i === hit ? { ...i, qty: clampQty(i.qty + 1) } : i));
      return xs.length >= MAX_LINES ? xs : [...xs, { slug, size, qty: 1 }];
    }),
    setQty: (slug, size, qty) => setItems((xs) => xs.map((i) => (i.slug === slug && i.size === size ? { ...i, qty: clampQty(qty) } : i))),
    remove: (slug, size) => setItems((xs) => xs.filter((i) => !(i.slug === slug && i.size === size))),
    clear: () => setItems([]),
  }), [items, loaded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
