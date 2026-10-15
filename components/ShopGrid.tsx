"use client";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import Icon from "./Icon";
import ChipRow from "./ChipRow";
import SearchField from "./SearchField";
import { categories, categoryLabel, type Category, type Product } from "@/lib/content-types";

type Filter = "all" | Category;
type Sort = "featured" | "low" | "high";
type For = "all" | "Men" | "Women";
export type CategoryThumbs = Record<Filter, StaticImageData>;

// Every word typed must appear in the product's name, material, category, footbed or description.
const matches = (p: Product, q: string) => {
  const hay = `${p.name} ${p.material} ${categoryLabel(p.category)} ${p.footbed ?? ""} ${p.description ?? ""} ${p.audience ?? ""}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
};

export default function ShopGrid({ items, initial = "all", thumbs }: { items: Product[]; initial?: Filter; thumbs: CategoryThumbs }) {
  const [f, setF] = useState<Filter>(initial);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [who, setWho] = useState<For>("all");
  const [panel, setPanel] = useState(false);

  // The page is static, so the address is read here: a search from the home page arrives as /shop?q=…, and
  // older links (or admin buttons) may say /shop?category=… (moving between pages, the browser can reuse the
  // plain /shop page for those, so the category is applied here too).
  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const fromUrl = params.get("q");
    if (fromUrl) setQ(fromUrl.slice(0, 60));
    const cat = params.get("category");
    if (cat && categories.some((c) => c.id === cat)) setF(cat as Category);
  }, []);

  // Keep the address shareable (/shop/category/slides?q=black) without a navigation.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.pathname = f === "all" ? "/shop" : `/shop/category/${f}`;
    url.searchParams.delete("category");
    if (q.trim()) url.searchParams.set("q", q.trim()); else url.searchParams.delete("q");
    if (url.href !== window.location.href) window.history.replaceState(null, "", url);
  }, [f, q]);

  const list = useMemo(() => {
    const out = items.filter((p) => (f === "all" || p.category === f) && (who === "all" || !p.audience || p.audience === who) && matches(p, q));
    if (sort === "featured") return out;
    const price = (p: Product) => (p.price === null ? (sort === "low" ? Infinity : -Infinity) : p.price);
    return [...out].sort((a, b) => (sort === "low" ? price(a) - price(b) : price(b) - price(a)));
  }, [items, f, q, sort, who]);

  const chips: { id: Filter; label: string; n: number }[] = [
    { id: "all", label: "All styles", n: items.length },
    ...categories.map((c) => ({ id: c.id, label: c.label, n: items.filter((p) => p.category === c.id).length })),
  ];
  const filtersOn = sort !== "featured" || who !== "all";
  const reset = () => { setQ(""); setF("all"); setSort("featured"); setWho("all"); };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <SearchField value={q} onChange={setQ} filter={
          <button type="button" onClick={() => setPanel(!panel)} aria-expanded={panel} aria-controls="shop-filters" aria-label="Sort and filter"
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${panel ? "bg-ink text-white" : "hover:bg-tile"}`}>
            <Icon name="sliders" size={20} />
            {filtersOn && !panel && <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-ink ring-2 ring-white" />}
          </button>
        } />
        {panel && (
          <div id="shop-filters" className="grid animate-pop-in grid-cols-1 gap-5 rounded-panel border border-line bg-white p-5 md:grid-cols-[auto_auto_1fr] md:items-end md:gap-10">
            <div role="group" aria-label="Sort by" className="flex flex-col gap-2.5">
              <span className="text-sm font-semibold">Sort by</span>
              <div className="flex flex-wrap gap-2">
                {([["featured", "Featured"], ["low", "Price: low to high"], ["high", "Price: high to low"]] as const).map(([id, label]) => (
                  <button key={id} type="button" aria-pressed={sort === id} onClick={() => setSort(id)} className="chip">{label}</button>
                ))}
              </div>
            </div>
            <div role="group" aria-label="Made for" className="flex flex-col gap-2.5">
              <span className="text-sm font-semibold">Made for</span>
              <div className="flex flex-wrap gap-2">
                {([["all", "Everyone"], ["Men", "Men"], ["Women", "Women"]] as const).map(([id, label]) => (
                  <button key={id} type="button" aria-pressed={who === id} onClick={() => setWho(id)} className="chip">{label}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 md:justify-end">
              {filtersOn && <button type="button" onClick={() => { setSort("featured"); setWho("all"); }} className="link text-sm">Reset</button>}
              <button type="button" onClick={() => setPanel(false)} className="btn btn-primary btn-sm">Show {list.length} {list.length === 1 ? "style" : "styles"}</button>
            </div>
          </div>
        )}
      </div>

      <ChipRow title="Categories" label="Filter by style">
        {chips.map((c) => (
          <button key={c.id} type="button" onClick={() => setF(c.id)} aria-pressed={f === c.id} className="chip shrink-0 snap-start py-1.5 pl-1.5 pr-4">
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[7px] bg-tile">
              <Image src={thumbs[c.id]} alt="" fill sizes="32px" className="object-cover" />
            </span>
            <span className="whitespace-nowrap">{c.label}</span>
            <span className="tabular text-[13px] opacity-60">{c.n}</span>
          </button>
        ))}
      </ChipRow>

      <p className="text-sm text-muted" aria-live="polite">
        {list.length} {list.length === 1 ? "style" : "styles"}{q.trim() ? <> for “{q.trim()}”</> : null}{f !== "all" ? ` in ${categoryLabel(f)}` : ""}
      </p>

      {list.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {list.map((p, n) => <Reveal key={`${f}-${p.slug}`} delay={(n % 4) * 60} className="h-full"><ProductCard p={p} eager={n < 4} /></Reveal>)}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-panel bg-mist px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white"><Icon name="search" size={24} /></span>
          <p className="text-base font-semibold">No styles match{q.trim() ? ` “${q.trim()}”` : ""}</p>
          <p className="max-w-sm text-sm text-muted">Try a colour or material, like “black”, “suede” or “cork”, or browse every style. Can&apos;t find a pair? We can make it: ask us on WhatsApp.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["black", "suede", "cork"].map((w) => <button key={w} type="button" onClick={() => { setQ(w); setF("all"); }} className="chip">{w}</button>)}
            <button type="button" onClick={reset} className="btn btn-primary btn-sm">Show all styles</button>
          </div>
        </div>
      )}
    </div>
  );
}
