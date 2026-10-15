"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "./Icon";
import { useCart } from "./CartProvider";
import { useSaved } from "./SavedProvider";
import { useWhatsapp } from "./StoreProvider";

// The mockup's bottom bar: white bar with a rounded bump in the middle holding the black Home disc.
// Shop and Cart on the left, WhatsApp chat and Saved on the right. Fixed to the bottom of the app column.
export default function TabBar() {
  const path = usePathname();
  const { count } = useCart();
  const { slugs } = useSaved();
  const whatsappLink = useWhatsapp();
  const item = (href: string, icon: IconName, label: string, active: boolean, badge = 0) => (
    <Link href={href} aria-label={badge ? `${label}, ${badge}` : label} aria-current={active ? "page" : undefined}
      className="relative flex h-[60px] flex-col items-center justify-center gap-1 text-ink no-underline transition-transform duration-150 ease-out active:scale-[0.9]">
      <span className="relative">
        <Icon name={icon} size={26} strokeWidth={1.5} filled={active && icon === "heart"} />
        {badge > 0 && <span key={badge} className="tabular absolute -right-2.5 -top-1.5 flex h-[18px] min-w-[18px] animate-pop-in items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-white ring-2 ring-white">{badge}</span>}
      </span>
      <span aria-hidden="true" className={`h-1 w-1 rounded-full bg-ink transition-opacity duration-150 ${active ? "opacity-100" : "opacity-0"}`} />
    </Link>
  );
  return (
    <nav aria-label="Tab bar" className="fixed bottom-0 left-1/2 z-40 w-full max-w-app -translate-x-1/2 [filter:drop-shadow(0_-4px_12px_rgba(17,17,17,0.10))] print:hidden">
      <div className="relative bg-white pb-[env(safe-area-inset-bottom)]">
        {/* the bump */}
        <span aria-hidden="true" className="absolute left-1/2 top-0 h-[84px] w-[84px] -translate-x-1/2 -translate-y-[20px] rounded-full bg-white" />
        <div className="relative grid h-[68px] grid-cols-5 items-center px-3">
          {item("/shop", "grid", "Shop", path.startsWith("/shop"))}
          {item("/cart", "cart", "Cart", path === "/cart" || path === "/receipt", count)}
          <Link href="/" aria-label="Home" aria-current={path === "/" ? "page" : undefined}
            className="relative mx-auto -mt-[30px] flex h-[58px] w-[58px] items-center justify-center rounded-full bg-ink text-white no-underline transition-transform duration-150 ease-out active:scale-[0.92]">
            <Icon name="home" size={26} strokeWidth={1.6} />
          </Link>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
            className="flex h-[60px] flex-col items-center justify-center gap-1 text-ink no-underline transition-transform duration-150 ease-out active:scale-[0.9]">
            <Icon name="chats" size={26} strokeWidth={1.5} />
            <span aria-hidden="true" className="h-1 w-1" />
          </a>
          {item("/saved", "heart", "Saved", path === "/saved", slugs.length)}
        </div>
      </div>
    </nav>
  );
}
