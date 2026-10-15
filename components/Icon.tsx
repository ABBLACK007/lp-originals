// One icon set for the whole store: 24px grid, 1.8 stroke, round caps and joins. Decorative by default
// (aria-hidden); the button or link around an icon carries the accessible name.
const paths = {
  home: <><path d="M4 11l8-7 8 7" /><path d="M6 9.5V20h4.5v-5.5h3V20H18V9.5" /></>,
  grid: <><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" />,
  bag: <><path d="M5.5 8h13l-1 12h-11z" /><path d="M9 8V7a3 3 0 0 1 6 0v1" /></>,
  cartPlus: <><path d="M5.5 8h13l-1 12h-11z" /><path d="M9 8V7a3 3 0 0 1 6 0v1" /><path d="M12 11.5v5M9.5 14h5" /></>,
  chat: <><path d="M7.9 20A9 9 0 1 0 4 16.1L2.5 21.5z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></>,
  sliders: <><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>,
  arrowLeft: <><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></>,
  arrowRight: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
  chevronLeft: <path d="M14.5 6l-6 6 6 6" />,
  chevronRight: <path d="M9.5 6l6 6-6 6" />,
  chevronDown: <path d="M6 9.5l6 6 6-6" />,
  arrowUp: <><path d="M12 19V5" /><path d="M6 11l6-6 6 6" /></>,
  arrowDown: <><path d="M12 5v14" /><path d="M18 13l-6 6-6-6" /></>,
  external: <><path d="M7 17L17 7" /><path d="M8.5 7H17v8.5" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M4 8h16M4 16h16" />,
  turn: <><path d="M20 12a8 8 0 1 1-2.3-5.7" /><path d="M20 4.5V9h-4.5" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  trash: <><path d="M4.5 7h15" /><path d="M9.5 7V4.8h5V7" /><path d="M6.5 7l1 12.5h9l1-12.5" /></>,
  play: <path d="M8 5.5v13l11-6.5z" />,
  pause: <path d="M9 6v12M15 6v12" />,
  truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></>,
  scissors: <><circle cx="6" cy="7" r="2.5" /><circle cx="6" cy="17" r="2.5" /><path d="M8 8.5L20 17M8 15.5L20 7" /></>,
  swap: <><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 5v6h-6" /></>,
  gift: <><path d="M4 10h16v10H4z" /><path d="M3 7h18v3H3z" /><path d="M12 7v13" /><path d="M12 7c-1.5-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3.5-2-5 1z" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  leaf: <><path d="M20 4C11 4 5 10 5 19" /><path d="M20 4c0 9-6 14-13 14" /><path d="M5 19l7-7" /></>,
  cushion: <><path d="M3 15c3 0 4-5 9-5s6 3 9 3v3H3z" /><path d="M3 18h18" /></>,
  air: <path d="M3 9c3-2 6 2 9 0s6-2 9 0M3 14c3-2 6 2 9 0s6-2 9 0M3 19c3-2 6 2 9 0s6-2 9 0" />,
  shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
  ruler: <><path d="M3 15.5L15.5 3 21 8.5 8.5 21z" /><path d="M7 11.5l2 2M10 8.5l1.5 1.5M13 5.5l2 2" /></>,
  print: <><path d="M7 9V3h10v6" /><rect x="3" y="9" width="18" height="8" rx="2" /><path d="M7 14h10v7H7z" /></>,
} as const;

export type IconName = keyof typeof paths;

export default function Icon({ name, size = 22, className = "", filled = false, strokeWidth = 1.8 }: {
  name: IconName; size?: number; className?: string; filled?: boolean; strokeWidth?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {paths[name]}
    </svg>
  );
}
