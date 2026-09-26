import Link from "next/link";
import Image from "next/image";
import { logo } from "@/lib/images";

export default function Logo({ size = 44 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="LP Originals home">
      <Image src={logo} alt="" width={size} height={size} className="rounded-full object-cover" />
      <span className="font-display text-xl font-bold tracking-[0.08em] text-gold">ORIGINALS</span>
    </Link>
  );
}
