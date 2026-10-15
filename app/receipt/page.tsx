import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReceiptView from "@/components/ReceiptView";

export const metadata: Metadata = { title: "Your receipt", robots: { index: false } };

export default function ReceiptPage() {
  return (
    <main id="main">
      <div className="print:hidden"><Header /></div>
      <div className="mx-auto max-w-page px-5 pt-8 md:px-8 md:pt-14 print:max-w-none print:p-0">
        <h1 className="mb-8 text-[28px] font-semibold md:text-[40px] print:hidden">Your receipt</h1>
        <ReceiptView />
      </div>
      <div className="print:hidden"><Footer /></div>
    </main>
  );
}
