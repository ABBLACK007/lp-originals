import type { MetadataRoute } from "next";

// Lets customers "Add to Home Screen" from Instagram's browser with the LP icon and colours.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LP Wears",
    short_name: "LP Wears",
    description: "Handmade cork-footbed sandals, slides, palms and clogs.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2EDE6",
    theme_color: "#141210",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
