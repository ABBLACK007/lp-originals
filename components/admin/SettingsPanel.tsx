"use client";
import type { SiteSettings } from "@/lib/content-types";
import { whatsappHref } from "@/lib/site";
import { Field, Text, Toggle, inputCls } from "./fields";

export default function SettingsPanel({ site, update }: { site: SiteSettings; update: (fn: (s: SiteSettings) => SiteSettings) => void }) {
  const set = (patch: Partial<SiteSettings>) => update((s) => ({ ...s, ...patch }));
  const setPromo = (patch: Partial<SiteSettings["promo"]>) => update((s) => ({ ...s, promo: { ...s.promo, ...patch } }));
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="flex flex-col gap-4 rounded-panel bg-white p-5 ring-1 ring-line">
        <h3 className="font-display text-2xl font-semibold uppercase">WhatsApp</h3>
        <Field label="WhatsApp number" hint="Country code + number, digits only. +234 706 170 2536 → 2347061702536">
          <input value={site.whatsappNumber} inputMode="numeric" maxLength={15} className={inputCls} onChange={(e) => set({ whatsappNumber: e.target.value.replace(/\D/g, "") })} />
        </Field>
        <Field label="Message customers start with" hint="Buttons add what they want after this, e.g. the product and size.">
          <Text value={site.whatsappGreeting} max={160} onChange={(v) => set({ whatsappGreeting: v })} />
        </Field>
        <a href={whatsappHref(site, "a test message")} target="_blank" rel="noreferrer" className="link self-start text-sm">Test the WhatsApp link ↗</a>
      </section>

      <section className="flex flex-col gap-4 rounded-panel bg-white p-5 ring-1 ring-line">
        <h3 className="font-display text-2xl font-semibold uppercase">Promo</h3>
        <Toggle checked={site.promo.enabled} onChange={(v) => setPromo({ enabled: v })} label="Show the promo (homepage section and promo slide)" />
        <Field label="Promo name"><Text value={site.promo.title} max={40} onChange={(v) => setPromo({ title: v })} /></Field>
        <Field label="Offer" hint="e.g. 20% off"><Text value={site.promo.discount} max={30} onChange={(v) => setPromo({ discount: v })} /></Field>
        <Field label="Dates" hint="e.g. 1–31 December"><Text value={site.promo.dates} max={60} onChange={(v) => setPromo({ dates: v })} /></Field>
      </section>

      <section className="flex flex-col gap-4 rounded-panel bg-white p-5 ring-1 ring-line">
        <h3 className="font-display text-2xl font-semibold uppercase">Orders</h3>
        <Field label="Production time (working days)" hint="Shown on product pages, receipts and the ordering steps, e.g. 5–7">
          <Text value={site.productionDays} max={20} onChange={(v) => set({ productionDays: v })} />
        </Field>
      </section>

      <section className="flex flex-col gap-4 rounded-panel bg-white p-5 ring-1 ring-line">
        <h3 className="font-display text-2xl font-semibold uppercase">Brand</h3>
        <Field label="Store name"><Text value={site.name} max={40} onChange={(v) => set({ name: v })} /></Field>
        <Field label="Instagram link"><Text value={site.instagram} max={200} onChange={(v) => set({ instagram: v })} /></Field>
        <Field label="Instagram handle"><Text value={site.instagramHandle} max={40} onChange={(v) => set({ instagramHandle: v })} /></Field>
      </section>
    </div>
  );
}
