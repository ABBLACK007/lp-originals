import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import CartView from "@/components/CartView";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default function CartPage() {
  return (
    <main id="main">
      <TopBar title="My cart" titleLevel="h1" right={null} />
      <div className="px-6 pt-4"><CartView /></div>
    </main>
  );
}
