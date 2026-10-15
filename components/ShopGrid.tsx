"use client";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import Icon from "./Icon";
import ChipRow from "./ChipRow";
import SearchField from "./SearchField";
import { categories, categoryLabel, type Category, type Product } from "@/lib/content-types";

type Filter = "all" | Category;
type Sort = "featured" | "low" | "high";
type For = "all" | "Men" | "Women";
type Chip = Filter | "Men" | "Women";
export type CategoryThumbs = Record<Chip, StaticImageData>;

// Every word typed must appear in the product's name, material, category, footbed or description.
const matches = (p: Product, q: string) => {
  const hay = `${p.name} ${p.material} ${categoryLabel(p.category)} ${p.footbed ?? ""} ${p.description ?? ""} ${p.audience ?? ""}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
};

// The store screen below the header: search pill (+ sort/filter sheet), the Categories row, and the product grid.
// `syncUrl` (shop pages): keep the address as /shop or /shop/category/<id> (+ ?q=) so it can be shared and reloaded.
export default function ShopGrid({ items, initial = "all", thumbs, syncUrl = false }: { items: Product[]; initial?: Filter; thumbs: CategoryThumbs; syncUrl?: boolean }) {
  const [f, setF] = useState<Filter>(initial);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [who, setWho] = useState<For>("all");
  const sheet = useRef<HTMLDialogElement>(null);

  // The page is static, so the address is read here: /shop?q=… and older /shop?category=… links.
  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const fromUrl = params.get("q");
    if (fromUrl) setQ(fromUrl.slice(0, 60));
    const cat = params.get("category");
    if (cat && categories.some((c) => c.id === cat)) setF(cat as Category);
  }, []);

  useEffect(() => {
    if (!syncUrl) return;
    const url = new URL(window.location.href);
    url.pathname = f === "all" ? "/shop" : `/shop/category/${f}`;
    url.searchParams.delete("category");
    if (q.trim()) url.searchParams.set("q", q.trim()); else url.searchParams.delete("q");
    if (url.href !== window.location.href) window.history.replaceState(null, "", url);
  }, [f, q, syncUrl]);

  const list = useMemo(() => {
    const out = items.filter((p) => (f === "all" || p.category === f) && (who === "all" || !p.audience || p.audience === who) && matches(p, q));
    if (sort === "featured") return out;
    const price = (p: Product) => (p.price === null ? (sort === "low" ? Infinity : -Infinity) : p.price);
    return [...out].sort((a, b) => (sort === "low" ? price(a) - price(b) : price(b) - price(a)));
  }, [items, f, q, sort, who]);

  const chips: { id: Chip; label: string; n: number }[] = [
    { id: "all", label: "All styles", n: items.length },
    ...categories.map((c) => ({ id: c.id as Chip, label: c.label, n: items.filter((p) => p.category === c.id).length })),
    ...(["Men", "Women"] as const).map((w) => ({ id: w as Chip, label: `For ${w.toLowerCase()}`, n: items.filter((p) => !p.audience || p.audience === w).length })),
  ];
  const active: Chip = who !== "all" && f === "all" ? who : f;
  const choose = (c: Chip) => { if (c === "Men" || c === "Women") { setWho(c); setF("all"); } else { setF(c); setWho("all"); } };
  const filtersOn = sort !== "featured" || who !== "all";
  const reset = () => { setQ(""); setF("all"); setSort("featured"); setWho("all"); };
  const summary = [active !== "all" ? chips.find((c) => c.id === active)?.label : null, q.trim() ? `“${q.trim()}”` : null].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col gap-6">
      <SearchField value={q} onChange={setQ} filter={
        <button type="button" onClick={() => sheet.current?.showModal()} aria-label="Sort and filter" aria-haspopup="dialog"
          className="relative flex h-full w-14 shrink-0 items-center justify-center rounded-r-full text-ink transition-colors hover:bg-black/[0.03]">
          <Icon name="sliders" size={20} strokeWidth={1.7} />
          {filtersOn && <span aria-hidden="true" className="absolute right-4 top-3 h-2 w-2 rounded-full bg-ink ring-2 ring-[#F8F8F8]" />}
        </button>
      } />

      <ChipRow title="Categories" label="Filter by style">
        {chips.map((c) => (
          <button key={c.id} type="button" onClick={() => choose(c.id)} aria-pressed={active === c.id} aria-label={`${c.label} ${c.n}`} title={c.label}
            className={`relative flex h-[42px] w-[66px] shrink-0 snap-start items-center justify-center rounded-[5px] border bg-white shadow-[0_1px_3px_rgba(17,17,17,0.08)] transition-[border-color,transform] duration-150 ease-out active:scale-[0.95]
              ${active === c.id ? "border-[1.5px] border-ink" : "border-[#D9D9D9]"}`}>
            <span className="relative h-[28px] w-[48px]"><Image src={thumbs[c.id]} alt="" fill sizes="48px" className="object-contain" /></span>
          </button>
        ))}
      </ChipRow>

      <p className={summary ? "-mb-2 -mt-2 text-[13px] text-muted" : "sr-only"} aria-live="polite">
        {summary ? `${summary} · ` : ""}{list.length} {list.length === 1 ? "style" : "styles"}
      </p>

      {list.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-[18px] gap-y-6">
          {list.map((p, n) => <ProductCard key={p.slug} p={p} eager={n < 4} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-[10px] bg-tile px-6 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white"><Icon name="search" size={22} /></span>
          <p className="text-[15px] font-semibold">No styles match{q.trim() ? ` “${q.trim()}”` : ""}</p>
          <p className="font-read text-sm text-muted">Try a colour or material, like “black”, “suede” or “cork”. Can&apos;t find a pair? We can make it: ask us on WhatsApp.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["black", "suede", "cork"].map((w) => <button key={w} type="button" onClick={() => { setQ(w); setF("all"); setWho("all"); }} className="chip">{w}</button>)}
            <button type="button" onClick={reset} className="btn btn-primary btn-sm">Show all styles</button>
          </div>
        </div>
      )}

      <dialog ref={sheet} aria-label="Sort and filter" onClick={(e) => { if (e.target === sheet.current) sheet.current?.close(); }}
        className="sheet fixed inset-x-0 bottom-0 top-auto m-0 mx-auto w-full max-w-app rounded-t-[24px] bg-white p-0 text-ink shadow-float open:animate-sheet-up">
        <div id="shop-filters" className="flex flex-col gap-5 px-6 pb-[calc(24px+env(safe-area-inset-bottom))] pt-3">
          <span aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-line" />
          <div role="group" aria-label="Sort by" className="flex flex-col gap-2.5">
            <span className="text-[15px] font-semibold">Sort by</span>
            <div className="flex flex-wrap gap-2">
              {([["featured", "Featured"], ["low", "Price: low to high"], ["high", "Price: high to low"]] as const).map(([id, label]) => (
                <button key={id} type="button" aria-pressed={sort === id} onClick={() => setSort(id)} className="chip">{label}</button>
              ))}
            </div>
          </div>
          <div role="group" aria-label="Made for" className="flex flex-col gap-2.5">
            <span className="text-[15px] font-semibold">Made for</span>
            <div className="flex flex-wrap gap-2">
              {([["all", "Everyone"], ["Men", "Men"], ["Women", "Women"]] as const).map(([id, label]) => (
                <button key={id} type="button" aria-pressed={who === id} onClick={() => setWho(id)} className="chip">{label}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1">
            <button type="button" onClick={() => { setSort("featured"); setWho("all"); }} disabled={!filtersOn} className="link text-sm disabled:opacity-40">Reset</button>
            <button type="button" onClick={() => sheet.current?.close()} className="btn btn-primary btn-sm">Show {list.length} {list.length === 1 ? "style" : "styles"}</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
