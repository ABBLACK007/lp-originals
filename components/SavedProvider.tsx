"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useProducts } from "./StoreProvider";

// Saved styles (the heart buttons). Kept on the customer's phone in localStorage; no account needed.
type Saved = { slugs: string[]; ready: boolean; has: (slug: string) => boolean; toggle: (slug: string) => void };

const SavedContext = createContext<Saved | null>(null);
const KEY = "lp-saved-v1";
const MAX = 60;

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const { getProduct } = useProducts();
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // localStorage is user-editable: keep only slugs of products that exist.
    try {
      const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(raw)) setSlugs([...new Set(raw.filter((s): s is string => typeof s === "string" && !!getProduct(s)))].slice(0, MAX));
    } catch {}
    setReady(true);
  }, [getProduct]);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(slugs)); } catch {}
  }, [slugs, ready]);

  const value = useMemo<Saved>(() => ({
    slugs,
    ready,
    has: (slug) => slugs.includes(slug),
    toggle: (slug) => setSlugs((xs) => (xs.includes(slug) ? xs.filter((s) => s !== slug) : getProduct(slug) ? [slug, ...xs].slice(0, MAX) : xs)),
  }), [slugs, ready, getProduct]);

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const s = useContext(SavedContext);
  if (!s) throw new Error("useSaved must be used inside SavedProvider");
  return s;
}
