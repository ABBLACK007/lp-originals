import type { Config } from "tailwindcss";

// Design tokens. Monochrome shoe-shop world (see PRODUCT.md and .impeccable/surfaces): white ground, grey tiles,
// ink for every primary control; colour comes from the product photos (and a red saved heart).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  // hover: styles only apply on devices that can hover (no sticky hover after a tap on phones)
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        canvas: "#ECECEC", // around the app column on wide screens
        paper: "#FFFFFF",  // page ground
        mist: "#F6F6F6",   // quiet bands and inputs
        tile: "#F1F1F1",   // product tiles, chips
        line: "#E4E4E4",   // hairlines and borders
        edge: "#D2D2D2",   // stronger borders (secondary buttons, unselected chips)
        ink: "#111111",    // text and primary controls
        char: "#2B2B2B",   // ink hover / pressed
        muted: "#666666",  // secondary text (≥4.5:1 on white and on tile)
        heart: "#EF4627",  // saved heart only (the mockup's orange-red)
        ok: "#1F7A45",     // success text
        bad: "#B42318",    // error text
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        read: ["var(--font-read)", "system-ui", "sans-serif"], // Roboto: paragraphs and small labels, as on the mockup
      },
      borderRadius: { btn: "8px", chip: "10px", card: "16px", panel: "16px", hero: "24px" }, // hero: the hero frame and footer only
      boxShadow: {
        tile: "0 1px 2px rgba(17,17,17,0.04), 0 10px 24px -14px rgba(17,17,17,0.18)",
        float: "0 12px 32px -12px rgba(17,17,17,0.28)",
        bar: "0 -10px 30px -18px rgba(17,17,17,0.35)",
      },
      maxWidth: { page: "1280px", app: "430px" }, // app: the phone-width store column on every screen
      transitionTimingFunction: {
        out: "cubic-bezier(0.23, 1, 0.32, 1)",      // UI enter / press feedback
        "in-out": "cubic-bezier(0.77, 0, 0.175, 1)", // on-screen movement
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",    // sheets
      },
      keyframes: {
        "pop-in": { from: { opacity: "0", transform: "scale(0.96)" }, to: { opacity: "1", transform: "scale(1)" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        rise: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "sheet-up": { from: { transform: "translateY(100%)" }, to: { transform: "translateY(0)" } },
        heart: { "0%": { transform: "scale(1)" }, "35%": { transform: "scale(0.82)" }, "70%": { transform: "scale(1.18)" }, "100%": { transform: "scale(1)" } },
        progress: { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
      },
      animation: {
        "pop-in": "pop-in 200ms cubic-bezier(0.23, 1, 0.32, 1)",
        "fade-in": "fade-in 200ms ease-out",
        rise: "rise 600ms cubic-bezier(0.23, 1, 0.32, 1) both",
        "sheet-up": "sheet-up 320ms cubic-bezier(0.32, 0.72, 0, 1)",
        heart: "heart 420ms cubic-bezier(0.23, 1, 0.32, 1)",
        progress: "progress 6500ms linear both", // slide length; the bar finishing advances the hero
      },
    },
  },
  plugins: [],
};
export default config;
