"use client";
import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import { logout, saveContent } from "@/app/admin/actions";
import type { Content } from "@/lib/content-types";
import logoDark from "@/public/images/logo-dark.png";
import ProductsPanel from "./ProductsPanel";
import SlidesPanel from "./SlidesPanel";
import GalleryPanel from "./GalleryPanel";
import SettingsPanel from "./SettingsPanel";

const tabs = [
  { id: "products", label: "Products & prices" },
  { id: "hero", label: "Hero slides" },
  { id: "gallery", label: "Gallery" },
  { id: "settings", label: "Settings" },
] as const;
type Tab = (typeof tabs)[number]["id"];

export default function AdminEditor({ initial }: { initial: Content }) {
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [tab, setTab] = useState<Tab>("products");
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string; issues?: string[] } | null>(null);
  const [saving, startSaving] = useTransition();
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = () => startSaving(async () => {
    setStatus(null);
    const res = await saveContent(draft, saved.updatedAt);
    if (res.ok) {
      const next = { ...draft, updatedAt: res.updatedAt };
      setSaved(next); setDraft(next);
      setStatus({ kind: "ok", text: "Saved. The live site updates within a minute." });
    } else {
      setStatus({ kind: "error", text: res.error, issues: res.issues });
    }
  });

  return (
    <div className="min-h-[100svh] bg-cream pb-28">
      <header className="sticky top-0 z-30 border-b border-line bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Image src={logoDark} alt="LP Wears" className="h-10 w-auto" priority />
            <span className="font-display text-xl font-semibold uppercase tracking-wide text-ink">Store admin</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <a href="/" target="_blank" rel="noreferrer" className="link">View site ↗</a>
            <form action={logout}><button type="submit" className="rounded-full px-3 py-1.5 ring-1 ring-line hover:bg-sand">Sign out</button></form>
          </div>
        </div>
        <nav aria-label="Admin sections" className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3">
          {tabs.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} aria-pressed={tab === t.id}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${tab === t.id ? "bg-ink text-white" : "bg-white ring-1 ring-line hover:bg-sand"}`}>{t.label}</button>
          ))}
        </nav>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 pt-6">
        {tab === "products" && <ProductsPanel products={draft.products} update={(fn) => setDraft((d) => ({ ...d, products: fn(d.products) }))} />}
        {tab === "hero" && <SlidesPanel slides={draft.slides} update={(fn) => setDraft((d) => ({ ...d, slides: fn(d.slides) }))} />}
        {tab === "gallery" && <GalleryPanel gallery={draft.gallery} products={draft.products} update={(fn) => setDraft((d) => ({ ...d, gallery: fn(d.gallery) }))} />}
        {tab === "settings" && <SettingsPanel site={draft.site} update={(fn) => setDraft((d) => ({ ...d, site: fn(d.site) }))} />}
      </main>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0 text-sm" aria-live="polite">
            {status ? (
              <div className={status.kind === "ok" ? "text-[#2E6B3A]" : "text-[#8A2E2E]"}>
                {status.text}
                {status.issues && <ul className="mt-1 list-disc pl-5 text-xs">{status.issues.map((x) => <li key={x}>{x}</li>)}</ul>}
              </div>
            ) : dirty ? <span className="text-ink">You have unsaved changes.</span> : <span className="text-muted">All changes saved.</span>}
          </div>
          <div className="flex gap-2">
            <button type="button" disabled={!dirty || saving} onClick={() => { setDraft(saved); setStatus(null); }} className="btn btn-outline btn-sm disabled:opacity-40">Discard</button>
            <button type="button" disabled={!dirty || saving} onClick={save} className="btn btn-gold btn-sm disabled:opacity-40">{saving ? "Saving…" : "Save changes"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
