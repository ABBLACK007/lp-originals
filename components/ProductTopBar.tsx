"use client";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
import CartButton from "./CartButton";
import HeartButton from "./HeartButton";

// Phones: the product screen's own top bar (back, save, cart), as on the mockup. Wider screens use the header.
export default function ProductTopBar({ slug, name }: { slug: string; name: string }) {
  const router = useRouter();
  // Back to where they came from on this site; visitors who landed here directly (Instagram, WhatsApp) go to the shop.
  const back = () => (document.referrer.startsWith(window.location.origin) && window.history.length > 1 ? router.back() : router.push("/shop"));
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between bg-white/95 px-5 py-3 md:hidden">
      <button type="button" onClick={back} aria-label="Back" className="icon-btn"><Icon name="arrowLeft" size={20} /></button>
      <div className="flex gap-2">
        <HeartButton slug={slug} name={name} />
        <CartButton />
      </div>
    </div>
  );
}
