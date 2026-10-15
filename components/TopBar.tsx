"use client";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
import CartButton from "./CartButton";

// App top bar for inner screens: round back button, optional title, optional right-hand control (the cart by
// default), as on the mockup's product screen.
export default function TopBar({ title, right = <CartButton />, titleLevel = "span" }: { title?: string; right?: React.ReactNode; titleLevel?: "h1" | "span" }) {
  const router = useRouter();
  // Back to where they came from on this site; visitors who landed here directly go to the store.
  const back = () => (document.referrer.startsWith(window.location.origin) && window.history.length > 1 ? router.back() : router.push("/shop"));
  const T = titleLevel;
  return (
    <div className="sticky top-0 z-30 grid grid-cols-[44px_1fr_44px] items-center bg-white/95 px-6 pb-2 pt-5">
      <button type="button" onClick={back} aria-label="Back" className="relative flex h-[34px] w-[34px] items-center justify-center rounded-full border-[1.5px] border-ink text-ink transition-transform duration-150 ease-out active:scale-[0.92]">
        <span aria-hidden="true" className="absolute -inset-1.5" />
        <Icon name="chevronLeft" size={16} strokeWidth={2.4} />
      </button>
      {title ? <T className="truncate text-center text-[17px] font-semibold">{title}</T> : <span />}
      <div className="flex justify-end">{right}</div>
    </div>
  );
}
