"use client";
import Icon from "./Icon";

// The mockup's search pill: light grey, search icon, placeholder, and a filter button behind a divider.
// Filters the products on the same screen as you type.
export default function SearchField({ value, onChange, filter }: { value: string; onChange: (v: string) => void; filter: React.ReactNode }) {
  return (
    <form role="search" onSubmit={(e) => { e.preventDefault(); (document.activeElement as HTMLElement | null)?.blur(); }}
      className="flex h-[50px] items-center rounded-full border border-[#E9E9E9] bg-[#F8F8F8] pl-4 shadow-[inset_0_1px_2px_rgba(17,17,17,0.04)] transition-colors focus-within:border-ink">
      <Icon name="search" size={21} strokeWidth={1.7} className="shrink-0 text-[#555]" />
      <label htmlFor="store-search" className="sr-only">Search the shop</label>
      <input id="store-search" type="search" name="q" value={value} enterKeyHint="search" autoComplete="off" maxLength={60}
        onChange={(e) => onChange(e.target.value)} placeholder="Search sandals, slides, clogs"
        className="h-full min-w-0 flex-grow bg-transparent px-2.5 text-[15px] outline-none placeholder:text-[#8A8A8A] [&::-webkit-search-cancel-button]:hidden" />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="flex h-10 w-9 shrink-0 items-center justify-center text-muted hover:text-ink">
          <Icon name="close" size={17} />
        </button>
      )}
      <span aria-hidden="true" className="h-full w-px bg-[#E6E6E6]" />
      {filter}
    </form>
  );
}
