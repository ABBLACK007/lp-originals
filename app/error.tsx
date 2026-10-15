"use client";
import Link from "next/link";
import { useWhatsapp } from "@/components/StoreProvider";

// Shown if a page crashes in the browser. No error details are displayed to visitors.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const whatsappLink = useWhatsapp();
  return (
    <main id="main" className="mx-auto flex min-h-[70vh] max-w-page flex-col items-start justify-center gap-5 px-5 md:px-8">
      <h1 className="text-[28px] font-semibold md:text-[40px]">Something slipped</h1>
      <p className="max-w-md text-muted">Sorry, this page didn&apos;t load properly. Try again, or send us a message and we&apos;ll help you order.</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">Try again</button>
        <Link href="/" className="btn btn-secondary">Back home</Link>
        <a href={whatsappLink("help placing an order (the website had a problem).")} target="_blank" rel="noreferrer" className="btn btn-secondary">WhatsApp us</a>
      </div>
    </main>
  );
}
