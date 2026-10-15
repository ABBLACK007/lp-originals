import type { Config } from "tailwindcss";

// Design tokens — keep in sync with design/README.md
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  // hover: styles only apply on devices that can hover (no sticky hover after a tap on phones)
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        cream: "#F2EDE6",   // page ground
        sand: "#E2DBD0",    // product card ground
        dune: "#EAE2D7",    // feature panel ground
        ink: "#141210",     // logo black: hero, footer
        char: "#1A1715",    // active panels
        smoke: "#2A2521",   // inactive panels
        gold: "#C9A45C",    // logo gold: primary buttons, accents
        goldhover: "#D4B06A",
        bronze: "#8C6B2A",  // gold for text on cream (AA contrast)
        text: "#2A2724",
        muted: "#6A635A",
        line: "#D6CEC2",
      },
      fontFamily: {
        display: ["var(--font-display)", "'Arial Narrow'", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { card: "16px", panel: "20px", hero: "28px" },
      maxWidth: { page: "1312px" },
      transitionTimingFunction: {
        out: "cubic-bezier(0.23, 1, 0.32, 1)",      // UI enter / press feedback
        "in-out": "cubic-bezier(0.77, 0, 0.175, 1)", // on-screen movement
      },
      keyframes: {
        "pop-in": { from: { opacity: "0", transform: "scale(0.97)" }, to: { opacity: "1", transform: "scale(1)" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        rise: { from: { opacity: "0", transform: "translateY(18px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "marquee-rev": { from: { transform: "translateX(-50%)" }, to: { transform: "translateX(0)" } },
        progress: { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
      },
      animation: {
        "pop-in": "pop-in 220ms cubic-bezier(0.23, 1, 0.32, 1)",
        "fade-in": "fade-in 200ms ease-out",
        rise: "rise 700ms cubic-bezier(0.23, 1, 0.32, 1) both",
        marquee: "marquee 40s linear infinite",
        "marquee-rev": "marquee-rev 55s linear infinite",
        "spin-slow": "spin 24s linear infinite",
        progress: "progress 6500ms linear both", // keep in sync with DURATION in components/HeroSlider.tsx
      },
    },
  },
  plugins: [],
};
export default config;
