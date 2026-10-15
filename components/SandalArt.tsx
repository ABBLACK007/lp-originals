import type { SandalStyle } from "@/lib/content-types";

// Drawn top-view placeholder used until real product photos exist.
export default function SandalArt({ style, strap, className = "" }: { style: SandalStyle; strap: string; className?: string }) {
  return (
    <svg viewBox="0 0 220 120" className={className} aria-hidden="true">
      <path d="M26 60 C26 36 48 27 80 29 L150 27 C182 25 200 42 200 62 C200 84 182 97 150 95 L80 91 C48 93 26 84 26 60 Z" fill="#6B5440" />
      <path d="M32 60 C32 40 52 33 81 35 L150 33 C178 31 193 46 193 62 C193 80 178 90 150 89 L81 85 C52 87 32 80 32 60 Z" fill="#C9A27A" />
      {style === "two" && (
        <>
          <rect x="92" y="24" width="24" height="72" rx="7" fill={strap} />
          <rect x="136" y="23" width="24" height="74" rx="7" fill={strap} />
          <rect x="95" y="30" width="18" height="10" rx="2" fill="none" stroke="#C9A45C" strokeWidth="2.5" />
          <rect x="139" y="30" width="18" height="10" rx="2" fill="none" stroke="#C9A45C" strokeWidth="2.5" />
        </>
      )}
      {style === "one" && <rect x="104" y="24" width="52" height="72" rx="10" fill={strap} />}
      {style === "clog" && (
        <>
          <path d="M118 33 L150 30 C180 28 197 45 197 62 C197 81 180 93 150 92 L118 88 C108 70 108 51 118 33 Z" fill={strap} />
          <rect x="84" y="28" width="16" height="64" rx="6" fill={strap} />
        </>
      )}
    </svg>
  );
}
