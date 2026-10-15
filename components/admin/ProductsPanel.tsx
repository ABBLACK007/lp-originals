"use client";
import { useState } from "react";
import { categories, categoryLabel, type Product } from "@/lib/content-types";
import { formatNaira } from "@/lib/site";
import { Field, SmallBtn, Text, Thumb, Toggle, UploadButton, inputCls, move } from "./fields";

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);

type Update = (fn: (prev: Product[]) => Product[]) => void;

export default function ProductsPanel({ products, update }: { products: Product[]; update: Update }) {
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");
  // Edits always apply to the latest list (uploads can finish after other changes).
  const set = (slug: string, patch: Partial<Product> | ((p: Product) => Partial<Product>)) =>
    update((ps) => ps.map((p) => (p.slug === slug ? { ...p, ...(typeof patch === "function" ? patch(p) : patch) } : p)));

  const add = () => {
    let slug = "new-product", n = 2;
    while (products.some((p) => p.slug === slug)) slug = `new-product-${n++}`;
    const p: Product = { slug, name: "New product", material: "Material and colour", category: "slides", price: null, isNew: true, hidden: true, images: [], art: { style: "one", strap: "#6E4B2F" } };
    update((ps) => [p, ...ps]);
    setOpen(slug);
  };

  const list = products.filter((p) => `${p.name} ${p.material}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={add} className="btn btn-gold btn-sm">+ Add product</button>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className={`${inputCls} max-w-xs`} />
        <span className="text-sm text-muted">{products.length} products · {products.filter((p) => p.hidden).length} hidden</span>
      </div>
      <ul className="flex flex-col gap-2.5">
        {list.map((p) => {
          const i = products.indexOf(p);
          const isOpen = open === p.slug;
          return (
            <li key={p.slug} className="overflow-hidden rounded-panel bg-white ring-1 ring-line">
              <button type="button" onClick={() => setOpen(isOpen ? null : p.slug)} aria-expanded={isOpen}
                className="flex w-full items-center gap-3 p-3 text-left hover:bg-cream/60">
                {p.images[0] ? <Thumb img={p.images[0]} className="h-14 w-12" /> : <div className="h-14 w-12 shrink-0 rounded-lg bg-sand" />}
                <span className="flex min-w-0 flex-grow flex-col">
                  <span className="truncate font-medium">{p.name}</span>
                  <span className="truncate text-xs text-muted">{p.material} · {categoryLabel(p.category)}</span>
                </span>
                <span className="hidden text-sm sm:block">{formatNaira(p.price)}</span>
                {p.hidden && <span className="rounded-full bg-line px-2 py-0.5 text-[11px]">Hidden</span>}
                {p.isNew && <span className="rounded-full bg-gold/30 px-2 py-0.5 text-[11px]">New</span>}
                <span aria-hidden="true" className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
              </button>
              {isOpen && (
                <div className="grid gap-4 border-t border-line p-4 md:grid-cols-2">
                  <Field label="Name"><Text value={p.name} max={60} onChange={(v) => set(p.slug, { name: v })} /></Field>
                  <Field label="Material and colour"><Text value={p.material} max={80} onChange={(v) => set(p.slug, { material: v })} /></Field>
                  <Field label="Price (₦)" hint="Whole naira. Leave empty to show “₦ [PRICE]”.">
                    <input inputMode="numeric" value={p.price ?? ""} className={inputCls} placeholder="e.g. 25000"
                      onChange={(e) => { const d = e.target.value.replace(/\D/g, "").slice(0, 9); set(p.slug, { price: d === "" ? null : Number(d) }); }} />
                  </Field>
                  <Field label="Category">
                    <select value={p.category} onChange={(e) => set(p.slug, { category: e.target.value as Product["category"] })} className={inputCls}>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Footbed" hint="Optional, e.g. Cork-latex footbed"><Text value={p.footbed ?? ""} max={60} onChange={(v) => set(p.slug, { footbed: v || undefined })} /></Field>
                  <Field label="For">
                    <select value={p.audience ?? ""} onChange={(e) => set(p.slug, { audience: (e.target.value || undefined) as Product["audience"] })} className={inputCls}>
                      <option value="">Everyone</option><option value="Men">Men</option><option value="Women">Women</option>
                    </select>
                  </Field>
                  <Field label="Page link" hint={p.slug.startsWith("new-product") ? "Set this before showing the product: it becomes /shop/your-link and shouldn't change after." : `/shop/${p.slug} (fixed once the product is live)`}>
                    <div className="flex gap-2">
                      <input value={p.slug} className={inputCls} onChange={(e) => { const s = slugify(e.target.value); if (s && !products.some((x) => x.slug === s && x !== p)) { set(p.slug, { slug: s }); setOpen(s); } }} />
                      <SmallBtn title="Make link from name" onClick={() => { const s = slugify(`${p.name} ${p.material}`.split(",")[0]); if (s && !products.some((x) => x.slug === s)) { set(p.slug, { slug: s }); setOpen(s); } }}>From name</SmallBtn>
                    </div>
                  </Field>
                  <div className="flex flex-wrap items-end gap-5">
                    <Toggle checked={!!p.isNew} onChange={(v) => set(p.slug, { isNew: v })} label="“New” badge" />
                    <Toggle checked={!p.hidden} onChange={(v) => set(p.slug, { hidden: !v })} label="Show in shop" />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-sm font-medium">Photos <span className="font-normal text-muted">(first one is the main photo)</span></span>
                    <div className="flex flex-wrap items-start gap-3">
                      {p.images.map((img, n) => (
                        <div key={img.src} className="flex flex-col items-center gap-1.5">
                          <Thumb img={img} className="h-28 w-[90px]" />
                          <div className="flex gap-1">
                            <SmallBtn title="Move left" disabled={n === 0} onClick={() => set(p.slug, (x) => ({ images: move(x.images, n, -1) }))}>←</SmallBtn>
                            <SmallBtn title="Move right" disabled={n === p.images.length - 1} onClick={() => set(p.slug, (x) => ({ images: move(x.images, n, 1) }))}>→</SmallBtn>
                            <SmallBtn title="Remove photo" danger onClick={() => set(p.slug, (x) => ({ images: x.images.filter((_, k) => k !== n) }))}>✕</SmallBtn>
                          </div>
                        </div>
                      ))}
                      {p.images.length < 8 && <UploadButton multiple onUploaded={(img) => set(p.slug, (x) => ({ images: [...x.images, img].slice(0, 8) }))} />}
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2 border-t border-line pt-3 md:col-span-2">
                    <div className="flex gap-2">
                      <SmallBtn title="Move up in the shop" disabled={i === 0} onClick={() => update((ps) => move(ps, i, -1))}>↑ Up</SmallBtn>
                      <SmallBtn title="Move down in the shop" disabled={i === products.length - 1} onClick={() => update((ps) => move(ps, i, 1))}>↓ Down</SmallBtn>
                    </div>
                    <DeleteButton onConfirm={() => update((ps) => ps.filter((x) => x.slug !== p.slug))} />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );

}

export function DeleteButton({ onConfirm, label = "Delete product" }: { onConfirm: () => void; label?: string }) {
  const [sure, setSure] = useState(false);
  return sure
    ? <span className="flex items-center gap-2 text-xs">Sure? <SmallBtn danger onClick={onConfirm}>Yes, delete</SmallBtn><SmallBtn onClick={() => setSure(false)}>Cancel</SmallBtn></span>
    : <SmallBtn danger onClick={() => setSure(true)}>{label}</SmallBtn>;
}
