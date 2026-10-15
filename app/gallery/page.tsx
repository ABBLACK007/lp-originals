import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import GalleryGrid from "@/components/GalleryGrid";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Gallery", description: "LP Wears sandals and slides up close, and how they wear.", alternates: { canonical: "/gallery" } };

export default async function GalleryPage() {
  const { site, gallery } = await getContent();
  return (
    <main id="main">
      <TopBar title="The LP gallery" titleLevel="h1" />
      <div className="flex flex-col gap-5 px-6 pt-4">
        <p className="font-read text-[15px] text-muted">Our pairs up close, and how they wear. Tap any photo to see it full size. More on <a href={site.instagram} target="_blank" rel="noreferrer" className="link text-ink">Instagram {site.instagramHandle}</a>.</p>
        <GalleryGrid items={gallery} />
      </div>
    </main>
  );
}
