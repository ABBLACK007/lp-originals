import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import SavedView from "@/components/SavedView";

export const metadata: Metadata = { title: "Saved styles", robots: { index: false } };

export default function SavedPage() {
  return (
    <main id="main">
      <TopBar title="Saved styles" titleLevel="h1" />
      <div className="px-6 pt-4"><SavedView /></div>
    </main>
  );
}
