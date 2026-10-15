import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import GalleryGrid from "@/components/GalleryGrid";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Gallery", description: "LP Wears sandals and slides up close, and how they wear.", alternates: { canonical: "/gallery" } };

export default async function GalleryPage() {
  const { site, gallery } = await getContent();
  return (
    <main id="main">
      <Header />
      <div className="mx-auto flex max-w-page flex-col gap-8 px-5 pt-8 md:px-8 md:pt-14">
        <SectionTitle level={1} title="The LP gallery" sub="Our pairs up close, and how they wear. Tap any photo to see it full size."
          action={<a href={site.instagram} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm hidden sm:inline-flex">Follow {site.instagramHandle}</a>} />
        <GalleryGrid items={gallery} />
      </div>
      <Footer />
    </main>
  );
}
