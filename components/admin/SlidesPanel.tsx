"use client";
import type { Slide } from "@/lib/content-types";
import { Field, SmallBtn, Text, Thumb, Toggle, UploadButton, inputCls, move } from "./fields";
import { DeleteButton } from "./ProductsPanel";

type Update = (fn: (prev: Slide[]) => Slide[]) => void;

export default function SlidesPanel({ slides, update }: { slides: Slide[]; update: Update }) {
  const set = (id: string, patch: Partial<Slide>) => update((ss) => ss.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const add = () => {
    let id = "slide", n = 2;
    while (slides.some((s) => s.id === id)) id = `slide-${n++}`;
    update((ss) => [...ss, { ...ss[0], id, hidden: true, eyebrow: "NEW", title: "New slide", sub: "", focus: "50% 50%", shade: "left", ctas: [{ label: "Shop now", href: "/shop", style: "gold" }] }]);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        Slides play in this order. Photos fill the whole slide: use a wide photo for computers and, if you have one, a tall photo for phones.
        In any text you can write <code className="rounded bg-sand px-1">{"{promo.discount}"}</code>, <code className="rounded bg-sand px-1">{"{promo.dates}"}</code> or <code className="rounded bg-sand px-1">{"{promo.title}"}</code> to show the promo settings.
      </p>
      {slides.map((s, i) => {
        const [fx, fy] = (s.focus ?? "50% 50%").split(" ").map((v) => parseInt(v));
        return (
          <section key={s.id} className="flex flex-col gap-4 rounded-panel bg-white p-4 ring-1 ring-line">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-2xl font-semibold uppercase">Slide {i + 1}{s.hidden && <span className="ml-2 align-middle text-xs font-normal normal-case text-muted">(hidden)</span>}</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Toggle checked={!s.hidden} onChange={(v) => set(s.id, { hidden: !v })} label="Show" />
                <SmallBtn title="Move earlier" disabled={i === 0} onClick={() => update((ss) => move(ss, i, -1))}>↑</SmallBtn>
                <SmallBtn title="Move later" disabled={i === slides.length - 1} onClick={() => update((ss) => move(ss, i, 1))}>↓</SmallBtn>
                {slides.length > 1 && <DeleteButton label="Delete slide" onConfirm={() => update((ss) => ss.filter((x) => x.id !== s.id))} />}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_1.3fr]">
              <div className="flex flex-col gap-3">
                <div className="flex items-end gap-3">
                  <div className="flex flex-col items-center gap-1.5">
                    <Thumb img={s.image} className="h-24 w-40">
                      {/* focal point marker */}
                      <span className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gold shadow" style={{ left: `${fx}%`, top: `${fy}%` }} />
                    </Thumb>
                    <span className="text-xs text-muted">Computers</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    {s.mobileImage ? <Thumb img={s.mobileImage} className="h-24 w-14" /> : <div className="flex h-24 w-14 items-center justify-center rounded-lg bg-sand text-center text-[10px] text-muted">same</div>}
                    <span className="text-xs text-muted">Phones</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <UploadButton label="Change photo" onUploaded={(img) => set(s.id, { image: img })} />
                  <UploadButton label="Phone photo" onUploaded={(img) => set(s.id, { mobileImage: img })} />
                  {s.mobileImage && <SmallBtn onClick={() => set(s.id, { mobileImage: undefined })}>Use same photo on phones</SmallBtn>}
                </div>
                <Field label={`Focus point: ${fx}% across, ${fy}% down`} hint="Which part of the photo stays in view when it's cropped.">
                  <input type="range" min={0} max={100} value={fx} onChange={(e) => set(s.id, { focus: `${e.target.value}% ${fy}%` })} />
                  <input type="range" min={0} max={100} value={fy} onChange={(e) => set(s.id, { focus: `${fx}% ${e.target.value}%` })} />
                </Field>
                <Toggle checked={s.shade === "left"} onChange={(v) => set(s.id, { shade: v ? "left" : "none" })} label="Extra shade behind text (for bright photos)" />
              </div>
              <div className="flex flex-col gap-3">
                <Field label="Small label"><Text value={s.eyebrow} max={40} onChange={(v) => set(s.id, { eyebrow: v })} /></Field>
                <Field label="Headline"><Text value={s.title} max={80} onChange={(v) => set(s.id, { title: v })} /></Field>
                <Field label="Text"><Text value={s.sub} max={220} multiline onChange={(v) => set(s.id, { sub: v })} /></Field>
                {s.ctas.map((c, n) => (
                  <div key={n} className="grid grid-cols-[1fr_1.2fr_auto_auto] items-end gap-2">
                    <Field label={`Button ${n + 1}`}><Text value={c.label} max={30} onChange={(v) => set(s.id, { ctas: s.ctas.map((x, k) => (k === n ? { ...x, label: v } : x)) })} /></Field>
                    <Field label="Goes to"><Text value={c.href} max={300} placeholder="/shop, #ordering, whatsapp" onChange={(v) => set(s.id, { ctas: s.ctas.map((x, k) => (k === n ? { ...x, href: v } : x)) })} /></Field>
                    <select aria-label="Button style" value={c.style} onChange={(e) => set(s.id, { ctas: s.ctas.map((x, k) => (k === n ? { ...x, style: e.target.value as "gold" | "outline" } : x)) })} className={`${inputCls} w-auto`}>
                      <option value="gold">Gold</option><option value="outline">Outline</option>
                    </select>
                    <SmallBtn danger title="Remove button" onClick={() => set(s.id, { ctas: s.ctas.filter((_, k) => k !== n) })}>✕</SmallBtn>
                  </div>
                ))}
                {s.ctas.length < 2 && <div><SmallBtn onClick={() => set(s.id, { ctas: [...s.ctas, { label: "Chat on WhatsApp", href: "whatsapp", style: "outline" }] })}>+ Add button</SmallBtn></div>}
              </div>
            </div>
          </section>
        );
      })}
      {slides.length < 10 && <div><button type="button" onClick={add} className="btn btn-gold btn-sm">+ Add slide</button></div>}
    </div>
  );
}
