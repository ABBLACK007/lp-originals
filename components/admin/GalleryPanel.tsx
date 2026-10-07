"use client";
import type { GalleryItem, Product } from "@/lib/content-types";
import { SmallBtn, Thumb, UploadButton, inputCls, move } from "./fields";

type Update = (fn: (prev: GalleryItem[]) => GalleryItem[]) => void;

export default function GalleryPanel({ gallery, products, update }: { gallery: GalleryItem[]; products: Product[]; update: Update }) {
  const set = (i: number, patch: Partial<GalleryItem>) => update((g) => g.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <UploadButton multiple label="Add photos" onUploaded={(img) => update((g) => [{ src: img, alt: "LP Wears sandals", kind: "product" }, ...g])} />
        <span className="text-sm text-muted">{gallery.length} photos. Describe each photo: it&apos;s read aloud to blind visitors and helps Google.</span>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((g, i) => (
          <li key={g.src.src + i} className="flex gap-3 rounded-panel bg-white p-3 ring-1 ring-line">
            <Thumb img={g.src} className="h-28 w-24" />
            <div className="flex min-w-0 flex-grow flex-col gap-2">
              <textarea value={g.alt} maxLength={140} rows={2} aria-label="Photo description" onChange={(e) => set(i, { alt: e.target.value })} className={`${inputCls} resize-none text-sm`} />
              <div className="flex gap-2">
                <select aria-label="Photo type" value={g.kind} onChange={(e) => set(i, { kind: e.target.value as GalleryItem["kind"] })} className={`${inputCls} py-1.5 text-sm`}>
                  <option value="product">Product</option><option value="campaign">Campaign</option>
                </select>
                <select aria-label="Linked product" value={g.product ?? ""} onChange={(e) => set(i, { product: e.target.value || undefined })} className={`${inputCls} py-1.5 text-sm`}>
                  <option value="">No product link</option>
                  {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}, {p.material}</option>)}
                </select>
              </div>
              <div className="flex gap-1.5">
                <SmallBtn title="Move earlier" disabled={i === 0} onClick={() => update((x) => move(x, i, -1))}>←</SmallBtn>
                <SmallBtn title="Move later" disabled={i === gallery.length - 1} onClick={() => update((x) => move(x, i, 1))}>→</SmallBtn>
                <SmallBtn danger title="Remove photo" onClick={() => update((x) => x.filter((_, k) => k !== i))}>Remove</SmallBtn>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
