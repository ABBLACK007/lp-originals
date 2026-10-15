// Section heading: sentence-case Poppins, optional line of support text, optional action (e.g. "See all") on the right.
// `level={1}` when the title is the page's main heading (shop, gallery, saved).
export default function SectionTitle({ title, sub, action, center = false, level = 2 }: {
  title: string; sub?: string; action?: React.ReactNode; center?: boolean; level?: 1 | 2;
}) {
  const H = level === 1 ? "h1" : "h2";
  return (
    <div className={`flex gap-4 ${center ? "flex-col items-center text-center" : "items-end justify-between"}`}>
      <div className={`flex flex-col gap-2 ${center ? "items-center" : ""}`}>
        <H className={`font-semibold leading-tight ${level === 1 ? "text-[28px] md:text-[40px]" : "text-[22px] md:text-[30px]"}`}>{title}</H>
        {sub && <p className="max-w-xl text-[15px] leading-relaxed text-muted">{sub}</p>}
      </div>
      {action && <div className="shrink-0 pb-1">{action}</div>}
    </div>
  );
}
