// Fades and lifts its content into place the first time it scrolls into view.
// `delay` (ms) staggers items in a row. CSS lives in app/globals.css ([data-reveal]); the observer is the
// small inline script in app/layout.tsx (revealScript), which runs before React loads, so content on screen
// shows straight away instead of waiting for the page's JavaScript.
export default function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: {
  children: React.ReactNode; delay?: number; className?: string; as?: "div" | "section" | "li";
}) {
  return (
    // suppressHydrationWarning: the script adds data-in before React hydrates.
    <Tag data-reveal="" suppressHydrationWarning className={className} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
