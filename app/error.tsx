"use client";
import Link from "next/link";
import { whatsappLink } from "@/lib/site";

// Shown if a page crashes in the browser. No error details are displayed to visitors.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="mx-auto flex min-h-[70vh] max-w-page flex-col items-start justify-center gap-5 px-5 md:px-8">
      <h1 className="font-display text-5xl font-light uppercase text-bronze">Something <strong className="font-semibold">slipped</strong></h1>
      <p className="max-w-md text-muted">Sorry, this page didn&apos;t load properly. Try again, or send us a message and we&apos;ll help you order.</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn btn-gold">Try again</button>
        <Link href="/" className="btn btn-outline">Back home</Link>
        <a href={whatsappLink("Hi LP Originals, the website had a problem. Can you help me order?")} target="_blank" rel="noreferrer" className="btn btn-outline">WhatsApp us</a>
      </div>
    </main>
  );
}
