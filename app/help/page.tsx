import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Icon from "@/components/Icon";
import { getContent } from "@/lib/content";
import { sizes } from "@/lib/content-types";
import { whatsappHref } from "@/lib/site";

export const metadata: Metadata = { title: "How to order and size guide", description: "How ordering works at LP Wears, the size guide, delivery and exchanges.", alternates: { canonical: "/help" } };

// Help: how to order, size guide (foot lengths from /admin › Settings), delivery and exchanges, contact.
export default async function HelpPage() {
  const { site } = await getContent();
  const wa = (want = "") => whatsappHref(site, want);
  const foot = site.footLength ?? {};
  const hasChart = sizes.some((s) => foot[s]?.trim());
  const steps = [
    { t: "Choose your pair", s: "Pick a style, colour and your EU size, then add it to your cart." },
    { t: "Confirm on WhatsApp", s: "Send your cart or receipt on WhatsApp and we confirm payment and delivery with you. Card payment at checkout is coming soon." },
    { t: "Handmade and delivered", s: `We make your pair to order (${site.productionDays} working days), then deliver it nationwide.` },
  ];
  const h2 = "scroll-mt-20 text-[17px] font-semibold";
  return (
    <main id="main">
      <TopBar title="Help" titleLevel="h1" />
      <div className="flex flex-col gap-8 px-6 pt-4 font-read text-[15px] leading-relaxed text-[#555]">
        <section className="flex flex-col gap-3">
          <h2 id="order" className={`${h2} font-sans text-ink`}>How to order</h2>
          <ol className="flex flex-col gap-3">
            {steps.map((x, n) => (
              <li key={x.t} className="flex gap-3.5 rounded-[10px] bg-tile p-4">
                <span className="tabular flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-sans text-sm font-semibold text-white">{n + 1}</span>
                <span className="flex flex-col"><span className="font-sans font-medium text-ink">{x.t}</span>{x.s}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-3">
          <h2 id="sizes" className={`${h2} font-sans text-ink`}>Size guide</h2>
          <p>We make every pair in EU sizes {sizes[0]} to {sizes[sizes.length - 1]}. Stand on a sheet of paper, mark your heel and longest toe, and measure the distance in centimetres. {hasChart ? "Match it below; between sizes, size up." : "Send it to us on WhatsApp and we'll match you to the right size before we make your pair."}</p>
          {hasChart && (
            <div className="overflow-x-auto rounded-[10px] bg-tile p-3">
              <table className="min-w-[520px] text-left text-sm text-ink">
                <thead><tr className="border-b border-edge"><th scope="row" className="py-2 pr-4 font-semibold">EU size</th>{sizes.map((s) => <th key={s} scope="col" className="px-2 py-2 font-medium">{s}</th>)}</tr></thead>
                <tbody><tr><th scope="row" className="py-2 pr-4 font-semibold">Foot (cm)</th>{sizes.map((s) => <td key={s} className="px-2 py-2 text-muted">{foot[s]?.trim() || "–"}</td>)}</tr></tbody>
              </table>
            </div>
          )}
          <a href={wa("help choosing my size. My foot length is ___ cm.")} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm self-start font-sans">Ask about my size</a>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={`${h2} font-sans text-ink`}>Delivery and exchanges</h2>
          <p>Every pair is made to order, then delivered nationwide; the delivery fee is confirmed on WhatsApp. Wrong size? We&apos;ll exchange unworn pairs.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className={`${h2} font-sans text-ink`}>Talk to us</h2>
          <a href={wa()} target="_blank" rel="noreferrer" className="flex min-h-[48px] items-center justify-between border-b border-line font-sans text-ink no-underline">Chat on WhatsApp<Icon name="external" size={16} /></a>
          <a href={wa("an update on my order. My name is ")} target="_blank" rel="noreferrer" className="flex min-h-[48px] items-center justify-between border-b border-line font-sans text-ink no-underline">Track my order<Icon name="external" size={16} /></a>
          <a href={site.instagram} target="_blank" rel="noreferrer" className="flex min-h-[48px] items-center justify-between font-sans text-ink no-underline">Instagram {site.instagramHandle}<Icon name="external" size={16} /></a>
        </section>
      </div>
    </main>
  );
}
