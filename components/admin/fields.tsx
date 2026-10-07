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

// Photos are shrunk in the browser before upload, because Vercel rejects request bodies over ~4.5MB and
// phone photos are often 3–12MB (iPhones also save HEIC, which the server can't read). Three decoders are
// tried, so it works on iPhone Safari, Android and desktop browsers alike.
const MAX_SEND = 3.5 * 1024 * 1024;

async function decode(file: File): Promise<CanvasImageSource & { width: number; height: number }> {
  try { return await createImageBitmap(file, { imageOrientation: "from-image" }); } catch {}
  try { return await createImageBitmap(file); } catch {}
  // <img> decoding: handles HEIC on Apple devices and applies the photo's rotation automatically.
  const url = URL.createObjectURL(file);
  try {
    const img = document.createElement("img"); // not `new Image()`: Image is next/image in this file
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return Object.assign(img, { width: img.naturalWidth, height: img.naturalHeight });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

async function shrink(file: File): Promise<Blob> {
  let src;
  try {
    src = await decode(file);
  } catch {
    // Can't read it here; a small JPG/PNG/WebP can still go as it is (the server re-checks it).
    if (["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= MAX_SEND) return file;
    throw new Error("This photo couldn't be opened. Save or export it as a JPG and try again.");
  }
  // Step the size and quality down until the photo is small enough to send.
  for (const [max, quality] of [[2000, 0.86], [1600, 0.8], [1280, 0.72], [1024, 0.65]] as const) {
    const scale = Math.min(1, max / Math.max(src.width, src.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(src.width * scale));
    canvas.height = Math.max(1, Math.round(src.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) break;
    ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", quality));
    if (blob && blob.size <= MAX_SEND) return blob;
  }
  throw new Error("This photo is too large to upload. Try a smaller photo or a screenshot of it.");
}

export async function uploadFile(file: File): Promise<Img> {
  const blob = await shrink(file);
  const form = new FormData();
  form.append("file", new File([blob], "photo.jpg", { type: blob.type || "image/jpeg" }));
  let res;
  try {
    res = await uploadImage(form);
  } catch {
    throw new Error("The upload didn't go through. Check your connection and try again.");
  }
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
      <input ref={ref} type="file" accept="image/*" multiple={multiple} hidden onChange={(e) => pick(e.target.files)} />
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
