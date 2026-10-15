"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "./Icon";

// Pill search field with a filter button on the right (the mockup's search bar).
// Controlled (`value` + `onChange`): filters in place, as on /shop. Uncontrolled: submitting opens /shop?q=…
export default function SearchField({ value, onChange, filter, autoFocus }: {
  value?: string; onChange?: (v: string) => void; filter: React.ReactNode; autoFocus?: boolean;
}) {
  const router = useRouter();
  const [own, setOwn] = useState("");
  const controlled = value !== undefined;
  const q = controlled ? value : own;
  return (
    <form role="search" onSubmit={(e) => {
      e.preventDefault();
      if (!controlled) router.push(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop");
      else (document.activeElement as HTMLElement | null)?.blur(); // phones: close the keyboard to show results
    }}
      className="flex h-14 items-center rounded-full border border-edge bg-white pl-5 pr-2 transition-colors focus-within:border-ink">
      <Icon name="search" size={20} className="shrink-0 text-muted" />
      <label htmlFor="store-search" className="sr-only">Search the shop</label>
      <input id="store-search" type="search" name="q" value={q} autoFocus={autoFocus} enterKeyHint="search" autoComplete="off" maxLength={60}
        onChange={(e) => (controlled ? onChange?.(e.target.value) : setOwn(e.target.value))}
        placeholder="Search sandals, slides, clogs"
        className="h-full min-w-0 flex-grow bg-transparent px-3 text-[15px] outline-none [&::-webkit-search-cancel-button]:hidden" />
      {q && controlled && (
        <button type="button" onClick={() => onChange?.("")} aria-label="Clear search" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted hover:text-ink">
          <Icon name="close" size={18} />
        </button>
      )}
      <span aria-hidden="true" className="mx-1 h-7 w-px bg-line" />
      {filter}
    </form>
  );
}
