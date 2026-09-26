import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartView from "@/components/CartView";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default function CartPage() {
  return (
    <main id="main">
      <Header />
      <div className="mx-auto max-w-page px-5 pt-14 md:px-8 md:pt-20">
        <h1 className="mb-10 font-display text-5xl font-light uppercase text-bronze md:text-[56px]">Your <strong className="font-semibold">cart</strong></h1>
        <CartView />
      </div>
      <Footer />
    </main>
  );
}
