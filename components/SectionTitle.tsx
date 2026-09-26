export default function SectionTitle({ light, strong, sub, center = false }: { light: string; strong: string; sub?: string; center?: boolean }) {
  return (
    <div className={`flex flex-col gap-3.5 ${center ? "items-center text-center" : ""}`}>
      <h2 className="font-display text-4xl font-light uppercase leading-[1.05] text-bronze md:text-[56px]">
        {light} <strong className="font-semibold">{strong}</strong>
      </h2>
      {sub && <p className="max-w-lg text-[15px] leading-relaxed text-muted md:text-base">{sub}</p>}
    </div>
  );
}
