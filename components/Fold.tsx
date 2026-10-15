import Icon from "./Icon";

// Fold-out section (the mockup's Description / Delivery rows). Native <details>: keyboard and screen readers
// work without script; the opening ease lives in globals.css (details.fold).
export default function Fold({ title, open = false, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details className="fold border-b border-line" open={open}>
      <summary className="flex min-h-[56px] items-center justify-between gap-4 text-base font-semibold">
        {title}
        <Icon name="chevronDown" size={20} className="fold-chevron shrink-0" />
      </summary>
      <div className="pb-5 text-[15px] leading-relaxed text-muted">{children}</div>
    </details>
  );
}
