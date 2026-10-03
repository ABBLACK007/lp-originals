import { useId } from "react";

// Circular "stamp" badge: text on a circle that slowly turns around a fixed LP monogram.
export default function RotatingStamp({ text = "HANDMADE IN NIGERIA · LP WEARS · ", size = 128, tone = "gold", filled = false, className = "" }: {
  text?: string; size?: number; tone?: "gold" | "bronze"; filled?: boolean; className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const color = tone === "gold" ? "#C9A45C" : "#8C6B2A";
  // Positioned by the caller (absolute/fixed in className) or in normal flow (relative) – never both,
  // or "relative" would win in the CSS and the stamp would push the layout around.
  const positioned = className.split(" ").some((c) => c === "absolute" || c === "fixed" || c.endsWith(":absolute") || c.endsWith(":fixed"));
  return (
    <div className={`${positioned ? "" : "relative"} shrink-0 rounded-full ${filled ? (tone === "gold" ? "bg-ink shadow-xl ring-1 ring-gold/40" : "bg-cream shadow-xl ring-1 ring-bronze/30") : ""} ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full animate-spin-slow">
        <defs><path id={`c${id}`} d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs>
        <text fill={color} style={{ fontSize: 10.5, letterSpacing: "0.26em", fontWeight: 600, fontFamily: "var(--font-sans)" }}>
          {/* textLength = circumference (2π·46 ≈ 289): one copy of the text spaced evenly around the full circle. */}
          <textPath href={`#c${id}`} textLength="286" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
        <circle cx="60" cy="60" r="31" fill="none" stroke={color} strokeWidth="1" strokeDasharray="2 3" />
        <text x="60" y="70" textAnchor="middle" fill={color} style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}>LP</text>
      </svg>
    </div>
  );
}
