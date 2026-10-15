import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import SavedView from "@/components/SavedView";

export const metadata: Metadata = { title: "Saved styles", robots: { index: false } };

export default function SavedPage() {
  return (
    <main id="main">
      <Header />
      <div className="mx-auto flex max-w-page flex-col gap-8 px-5 pt-8 md:px-8 md:pt-14">
        <SectionTitle level={1} title="Saved styles" sub="The pairs you hearted, kept on this phone or computer." />
        <SavedView />
      </div>
      <Footer />
    </main>
  );
}
