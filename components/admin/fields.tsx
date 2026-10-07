"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { uploadImage } from "@/app/admin/actions";
import type { Img } from "@/lib/content-types";

export const inputCls = "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] outline-none transition-colors focus:border-ink";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
      {label}
      {children}
      {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function Text({ value, onChange, max, placeholder, multiline }: { value: string; onChange: (v: string) => void; max: number; placeholder?: string; multiline?: boolean }) {
  return multiline
    ? <textarea value={value} onChange={(e) => onChange(e.target.value)} maxLength={max} rows={3} placeholder={placeholder} className={`${inputCls} resize-y`} />
    : <input value={value} onChange={(e) => onChange(e.target.value)} maxLength={max} placeholder={placeholder} className={inputCls} />;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm">
      <span className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-ink" : "bg-line"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[22px]" : "translate-x-0.5"}`} />
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      {label}
    </label>
  );
}

export function SmallBtn({ onClick, children, danger, disabled, title }: { onClick: () => void; children: React.ReactNode; danger?: boolean; disabled?: boolean; title?: string }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title} aria-label={title}
      className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition-colors disabled:opacity-40 ${danger ? "text-[#8A2E2E] ring-[#8A2E2E]/30 hover:bg-[#8A2E2E]/10" : "ring-line hover:bg-sand"}`}>
      {children}
    </button>
  );
}

// Shrinks a phone photo in the browser before upload (max 2000px, JPEG), so it fits Vercel's request limit.
async function shrink(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode"))), "image/jpeg", 0.88));
  } catch {
    return file; // the server re-checks and re-encodes anyway
  }
}

export async function uploadFile(file: File): Promise<Img> {
  const blob = await shrink(file);
  const form = new FormData();
  form.append("file", new File([blob], "photo.jpg", { type: blob.type || "image/jpeg" }));
  const res = await uploadImage(form);
  if (!res.ok) throw new Error(res.error);
  return res.img;
}

export function UploadButton({ onUploaded, label = "Upload photo", multiple }: { onUploaded: (img: Img) => void; label?: string; multiple?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true); setError(null);
    try {
      for (const f of Array.from(files)) onUploaded(await uploadFile(f));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };
  return (
    <span className="inline-flex flex-col gap-1">
      <button type="button" onClick={() => ref.current?.click()} disabled={busy}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-transform active:scale-[0.97] disabled:opacity-60">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 16V4" /><path d="M6 10l6-6 6 6" /><path d="M4 20h16" /></svg>
        {busy ? "Uploading…" : label}
      </button>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} hidden onChange={(e) => pick(e.target.files)} />
      {error && <span role="alert" className="text-xs text-[#8A2E2E]">{error}</span>}
    </span>
  );
}

export function Thumb({ img, className = "h-20 w-16", children }: { img: Img; className?: string; children?: React.ReactNode }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg bg-sand ring-1 ring-line ${className}`}>
      <Image src={img} alt="" fill sizes="120px" className="object-cover" />
      {children}
    </div>
  );
}

export const move = <T,>(arr: T[], i: number, d: -1 | 1) => {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};
