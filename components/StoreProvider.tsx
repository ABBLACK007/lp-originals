"use client";
import { createContext, useContext, useMemo } from "react";
import type { Product, SiteSettings } from "@/lib/content-types";
import { whatsappHref } from "@/lib/site";

// Store settings and visible products, read on the server (lib/content.ts) and shared with client components.
type Store = { site: SiteSettings; products: Product[] };
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ value, children }: { value: Store; children: React.ReactNode }) {
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const s = useContext(StoreContext);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}

export function useProducts() {
  const { products } = useStore();
  return useMemo(() => ({ products, getProduct: (slug: string) => products.find((p) => p.slug === slug) }), [products]);
}

// Returns a function building the WhatsApp chat link with the greeting pre-typed.
export function useWhatsapp() {
  const { site } = useStore();
  return (want = "") => whatsappHref(site, want);
}
