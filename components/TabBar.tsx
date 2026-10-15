"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "./Icon";
import { useCart } from "./CartProvider";
import { useSaved } from "./SavedProvider";
import { useWhatsapp } from "./StoreProvider";

// Phone tab bar (the mockup's bottom bar): Shop, Saved, a raised Home disc, Cart, and WhatsApp chat.
// Hidden on wider screens (they have the header) and in the admin.
export default function TabBar() {
  const path = usePathname();
  const { count } = useCart();
  const { slugs } = useSaved();
  const whatsappLink = useWhatsapp();
  if (path.startsWith("/admin")) return null;
  const item = (href: string, icon: IconName, label: string, active: boolean, badge = 0) => (
    <Link href={href} aria-label={badge ? `${label}, ${badge}` : label} aria-current={active ? "page" : undefined}
      className={`relative flex h-14 flex-col items-center justify-center gap-1 no-underline transition-[transform,color] duration-150 ease-out active:scale-[0.92] ${active ? "text-ink" : "text-muted"}`}>
      <span className="relative">
        <Icon name={icon} size={24} filled={active && icon === "heart"} />
        {badge > 0 && <span key={badge} className="tabular absolute -right-2.5 -top-1.5 flex h-[18px] min-w-[18px] animate-pop-in items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-white ring-2 ring-white">{badge}</span>}
      </span>
      <span aria-hidden="true" className={`h-1 w-1 rounded-full bg-ink transition-opacity duration-150 ${active ? "opacity-100" : "opacity-0"}`} />
    </Link>
  );
  const home = path === "/";
  return (
    <nav aria-label="Tab bar" className="fixed inset-x-0 bottom-0 z-40 rounded-t-[22px] bg-white pb-[env(safe-area-inset-bottom)] shadow-bar md:hidden print:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 items-end px-3">
        {item("/shop", "grid", "Shop", path.startsWith("/shop"))}
        {item("/saved", "heart", "Saved", path === "/saved", slugs.length)}
        <div className="flex justify-center">
          <Link href="/" aria-label="Home" aria-current={home ? "page" : undefined}
            className="-mt-6 mb-2 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-ink text-white no-underline shadow-float ring-[5px] ring-white transition-transform duration-150 ease-out active:scale-[0.92]">
            <Icon name="home" size={24} />
          </Link>
        </div>
        {item("/cart", "bag", "Cart", path === "/cart" || path === "/receipt", count)}
        <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
          className="flex h-14 flex-col items-center justify-center gap-1 text-muted no-underline transition-[transform,color] duration-150 ease-out active:scale-[0.92]">
          <Icon name="chat" size={24} />
          <span aria-hidden="true" className="h-1 w-1" />
        </a>
      </div>
    </nav>
  );
}
