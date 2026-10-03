import Link from "next/link";
import Logo from "./Logo";
import { site, whatsappLink } from "@/lib/site";

export default function Footer() {
  const col = "flex flex-col gap-3";
  const a = "text-sm text-white/70 no-underline hover:text-gold";
  return (
    <footer className="mx-3 mb-3 mt-20 rounded-hero bg-ink px-6 pb-8 pt-12 text-white md:mx-6 md:mb-6 md:mt-28 md:px-14 md:pt-16">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-xs flex-col gap-5">
          <Logo className="h-20 w-auto md:h-24" />
          <p className="text-sm leading-relaxed text-white/70">Handmade cork-footbed sandals, slides, palms and clogs.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:flex md:gap-16">
          <div className={col}>
            <span className="text-sm font-semibold">Shop</span>
            <Link className={a} href="/shop">All styles</Link>
            <Link className={a} href="/#new-drops">New drops</Link>
            <Link className={a} href="/gallery">Gallery</Link>
            <Link className={a} href="/cart">Cart</Link>
          </div>
          <div className={col}>
            <span className="text-sm font-semibold">Help</span>
            <Link className={a} href="/shop#size-guide">Size guide</Link>
            <Link className={a} href="/#ordering">Delivery</Link>
            <a className={a} href={whatsappLink("Hi, I'd like to track my order.")} target="_blank" rel="noreferrer">Track order</a>
          </div>
          <div className={col}>
            <span className="text-sm font-semibold">Follow</span>
            <a className={a} href={site.instagram} target="_blank" rel="noreferrer">Instagram {site.instagramHandle}</a>
            <a className={a} href={whatsappLink("Hi LP Wears!")} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="mt-12 flex justify-between border-t border-white/15 pt-6 text-[13px] text-white/60">
        <span>© {new Date().getFullYear()} LP Wears</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
