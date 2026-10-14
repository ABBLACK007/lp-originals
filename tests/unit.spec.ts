// Logic that runs without a browser: validation of admin content, links, prices, receipts and admin sessions.
import { test, expect } from "@playwright/test";
import { hrefSchema, imgSchema, productSchema, siteSchema } from "../lib/content-schema";
import { formatNaira, formatPhone, whatsappHref } from "../lib/site";
import { buildReceipt, cartSignature, receiptText } from "../lib/receipt";
import type { Product } from "../lib/content-types";

const blob = "https://pfv4isj8xyzwi9ga.public.blob.vercel-storage.com/uploads/0b1c.jpg";
const product: Product = {
  slug: "two-buckle-sandal-rust", name: "Two-Buckle Sandal", material: "Rust suede", category: "cork", price: 28000,
  images: [{ src: blob, width: 1600, height: 2000 }], art: { style: "two", strap: "#8A4B2A" },
};

test.describe("links saved from the admin", () => {
  for (const ok of ["whatsapp", "/shop", "/shop?category=cork", "/#ordering", "#ordering", "https://instagram.com/lpwears"]) {
    test(`accepts ${ok}`, () => expect(hrefSchema.safeParse(ok).success).toBe(true));
  }
  for (const bad of ["javascript:alert(1)", "JavaScript:alert(1)", "//evil.example", "/\\evil.example", "http://insecure.example", "data:text/html,hi", "vbscript:x", " /shop\" onmouseover=x"]) {
    test(`rejects ${JSON.stringify(bad)}`, () => expect(hrefSchema.safeParse(bad).success).toBe(false));
  }
});

test.describe("images saved from the admin", () => {
  test("accepts built-in and uploaded photos", () => {
    expect(imgSchema.safeParse({ src: "/_next/static/media/hero.123abc.jpg", width: 10, height: 10 }).success).toBe(true);
    expect(imgSchema.safeParse({ src: blob, width: 10, height: 10 }).success).toBe(true);
  });
  test("rejects photos from other sites and script URLs", () => {
    for (const src of ["https://evil.example/a.jpg", "http://pfv4isj8xyzwi9ga.public.blob.vercel-storage.com/a.jpg", "javascript:alert(1)", "/../secret"]) {
      expect(imgSchema.safeParse({ src, width: 10, height: 10 }).success, src).toBe(false);
    }
  });
  test("rejects a blur preview that isn't an image", () => {
    expect(imgSchema.safeParse({ src: blob, width: 10, height: 10, blurDataURL: "data:text/html;base64,PHNjcmlwdD4=" }).success).toBe(false);
  });
});

test.describe("products", () => {
  test("a valid product passes", () => expect(productSchema.safeParse(product).success).toBe(true));
  test("price is whole naira, not negative, or empty (null)", () => {
    expect(productSchema.safeParse({ ...product, price: -1 }).success).toBe(false);
    expect(productSchema.safeParse({ ...product, price: 1.5 }).success).toBe(false);
    expect(productSchema.safeParse({ ...product, price: null }).success).toBe(true);
  });
  test("product links (slugs) are lowercase words and dashes only", () => {
    for (const slug of ["../admin", "Two Buckle", "a", "x/y", "-start"]) expect(productSchema.safeParse({ ...product, slug }).success, slug).toBe(false);
  });
  test("names are one line", () => expect(productSchema.safeParse({ ...product, name: "a\nb" }).success).toBe(false));
});

test.describe("settings", () => {
  const site = {
    name: "LP Wears", instagram: "https://www.instagram.com/lpwears/", instagramHandle: "@lpwears", whatsappNumber: "2347061702536",
    whatsappGreeting: "Hi", productionDays: "5", promo: { enabled: true, title: "Drop", discount: "10% off", dates: "1–7 Dec" },
  };
  test("valid settings pass", () => expect(siteSchema.safeParse(site).success).toBe(true));
  test("WhatsApp number must be digits with country code", () => {
    for (const n of ["+234 706 170 2536", "0706", "abc"]) expect(siteSchema.safeParse({ ...site, whatsappNumber: n }).success, n).toBe(false);
  });
  test("size guide foot lengths are centimetres for real EU sizes", () => {
    expect(siteSchema.safeParse({ ...site, footLength: { "36": "23", "41": "26.5", "46": "" } }).success).toBe(true);
    expect(siteSchema.safeParse({ ...site, footLength: { "41": "<b>big</b>" } }).success).toBe(false);
    expect(siteSchema.safeParse({ ...site, footLength: { "99": "30" } }).success).toBe(false);
  });
  test("Instagram must be an instagram.com profile", () => {
    expect(siteSchema.safeParse({ ...site, instagram: "https://evil.example/lpwears" }).success).toBe(false);
  });
});

test.describe("formatting", () => {
  test("WhatsApp link opens the LP chat with the greeting typed", () => {
    const href = whatsappHref({ whatsappNumber: "+234 706-170-2536", whatsappGreeting: "Hi, I want " }, "the sandal & slide");
    expect(href).toBe("https://wa.me/2347061702536?text=Hi%2C%20I%20want%20the%20sandal%20%26%20slide");
  });
  test("naira prices", () => {
    expect(formatNaira(28000).replace(/\s/g, "")).toBe("₦28,000");
    expect(formatNaira(null)).toBe("₦ [PRICE]");
  });
  test("phone numbers", () => {
    expect(formatPhone("2347061702536")).toBe("+234 706 170 2536");
    expect(formatPhone("447700900123")).toBe("+447700900123");
  });
});

test.describe("receipts", () => {
  const get = (slug: string) => (slug === product.slug ? product : undefined);
  test("totals, numbering and unknown products", () => {
    const r = buildReceipt([{ slug: product.slug, size: "41", qty: 2 }, { slug: "gone", size: "40", qty: 1 }], get);
    expect(r.id).toMatch(/^LPW-\d{6}-[A-HJ-NP-Z2-9]{4}$/);
    expect(r.lines).toHaveLength(1);
    expect(r.subtotal).toBe(56000);
    expect(receiptText(r)).toContain("2 x Two-Buckle Sandal (Rust suede), EU 41");
  });
  test("no total while a price is still a placeholder", () => {
    const r = buildReceipt([{ slug: product.slug, size: "41", qty: 1 }], () => ({ ...product, price: null }));
    expect(r.subtotal).toBeNull();
  });
  test("the same cart in any order has the same signature", () => {
    const a = { slug: "a", size: "40", qty: 1 }, b = { slug: "b", size: "41", qty: 2 };
    expect(cartSignature([a, b])).toBe(cartSignature([b, a]));
  });
});

test.describe("admin sessions", () => {
  test.beforeEach(() => {
    process.env.ADMIN_PASSWORD = "correct horse battery";
    process.env.ADMIN_SESSION_SECRET = "s".repeat(40);
  });
  test("sign-in, tampering, expiry and password change", async () => {
    const auth = await import("../lib/admin-auth");
    expect(await auth.checkPassword("correct horse battery")).toBe(true);
    expect(await auth.checkPassword("correct horse batter")).toBe(false);
    const token = await auth.createSession();
    expect(await auth.verifySession(token)).toBe(true);
    const [exp, sig] = token.split(".");
    expect(await auth.verifySession(`${Number(exp) + 1}.${sig}`)).toBe(false); // extended expiry
    expect(await auth.verifySession(`${exp}.${sig.slice(0, -2)}xx`)).toBe(false); // forged signature
    expect(await auth.verifySession(undefined)).toBe(false);
    process.env.ADMIN_PASSWORD = "a different password";
    expect(await auth.verifySession(token)).toBe(false); // changing the password signs everyone out
  });
  test("refuses weak settings", async () => {
    const auth = await import("../lib/admin-auth");
    process.env.ADMIN_PASSWORD = "short";
    expect(auth.adminConfigured()).toBe(false);
    expect(await auth.checkPassword("short")).toBe(false);
  });
});
