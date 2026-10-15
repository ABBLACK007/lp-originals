import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartView from "@/components/CartView";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default function CartPage() {
  return (
    <main id="main">
      <Header />
      <div className="mx-auto max-w-page px-5 pt-8 md:px-8 md:pt-14">
        <h1 className="mb-8 text-[28px] font-semibold md:text-[40px]">Your cart</h1>
        <CartView />
      </div>
      <Footer />
    </main>
  );
}
