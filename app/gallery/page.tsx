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
      <div className="mx-auto flex max-w-page flex-col gap-10 px-5 pt-14 md:px-8 md:pt-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle light="The LP" strong="gallery" sub="Our pairs up close, and how they wear. Tap any photo to see it full size." />
          <a href={site.instagram} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm self-start md:self-auto">Follow {site.instagramHandle}</a>
        </div>
        <GalleryGrid items={gallery} />
      </div>
      <Footer />
    </main>
  );
}
