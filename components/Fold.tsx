import Icon from "./Icon";

// The mockup's fold-out row (Description / Delivery): bold title with a chevron, a grey rule under the title,
// grey text below. Native <details>: keyboard and screen readers work without script; the ease is in globals.css.
export default function Fold({ title, open = false, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details className="fold" open={open}>
      <summary className="flex min-h-[44px] items-center justify-between gap-4 border-b-[1.5px] border-[#D6D6D6] text-[16px] font-semibold">
        {title}
        <Icon name="chevronDown" size={18} strokeWidth={2.4} className="fold-chevron shrink-0" />
      </summary>
      <div className="pb-4 pt-2.5 font-read text-[15px] leading-relaxed text-[#8A8A8A]">{children}</div>
    </details>
  );
}
