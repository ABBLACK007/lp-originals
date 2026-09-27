"use client";
import { useEffect, useRef } from "react";

// Fades and lifts its content into place the first time it scrolls into view.
// `delay` (ms) staggers items in a row. CSS lives in app/globals.css ([data-reveal]).
export default function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: {
  children: React.ReactNode; delay?: number; className?: string; as?: "div" | "section" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.setAttribute("data-in", ""); io.disconnect(); }
    }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} data-reveal="" className={className} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
