import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import ReceiptView from "@/components/ReceiptView";

export const metadata: Metadata = { title: "Your receipt", robots: { index: false } };

export default function ReceiptPage() {
  return (
    <main id="main">
      <div className="print:hidden"><TopBar title="Receipt" titleLevel="h1" /></div>
      <div className="px-6 pt-4 print:p-0"><ReceiptView /></div>
    </main>
  );
}
