// Shopping: filters, choosing a size, cart, receipt and the WhatsApp order messages.
import { test, expect, hydrated, whatsappText, GREETING } from "./fixtures";
import type { Page } from "@playwright/test";

const SANDAL = "/shop/two-buckle-sandal-rust";
const cards = (page: Page) => page.locator("main article");

const naira = (s: string) => Number(s.replace(/[^\d]/g, ""));
// The cart count as visitors see it, on the tab bar.
const expectCartCount = (page: Page, n: number) =>
  expect(page.getByRole("navigation", { name: "Tab bar" }).getByRole("link", { name: n ? `Cart, ${n}` : "Cart", exact: true })).toBeVisible();

async function addToCart(page: Page, path: string, size: string) {
  await page.goto(path);
  await hydrated(page);
  await page.getByRole("button", { name: size, exact: true }).click();
  await page.getByRole("button", { name: "Add to cart" }).first().click();
  await expect(page.getByRole("status")).toContainText("Added to cart");
}

test.describe("shop", () => {
  test("filters by style, keeps the choice in the address and after reloading", async ({ page }) => {
    await page.goto("/shop");
    await hydrated(page);
    const filters = page.getByRole("group", { name: "Filter by style" });
    const all = await cards(page).count();
    expect(all).toBeGreaterThan(5);
    await expect(filters.getByRole("button", { name: /^All styles/ })).toHaveAccessibleName(`All styles ${all}`);

    await filters.getByRole("button", { name: /^Clogs/ }).click();
    await expect(page).toHaveURL(/\/shop\/category\/clogs$/);
    const clogs = await cards(page).count();
    expect(clogs).toBeGreaterThan(0);
    expect(clogs).toBeLessThan(all);
    await expect(filters.getByRole("button", { name: /^Clogs/ })).toHaveAccessibleName(`Clogs ${clogs}`);

    await page.reload();
    await expect(filters.getByRole("button", { name: /^Clogs/ })).toHaveAttribute("aria-pressed", "true");
    await expect(cards(page)).toHaveCount(clogs);

    await hydrated(page);
    await filters.getByRole("button", { name: /^All styles/ }).click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(cards(page)).toHaveCount(all);
  });

  test("old ?category= links open the filtered shop", async ({ page }) => {
    await page.goto("/shop?category=slides");
    await hydrated(page);
    await expect(page.getByRole("group", { name: "Filter by style" }).getByRole("button", { name: /^Slides & palms/ })).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(/\/shop\/category\/slides$/);
  });

  test("product cards open the product page", async ({ page }) => {
    await page.goto("/shop");
    const first = cards(page).first();
    const name = (await first.getByRole("link").textContent())?.trim(); // the name link covers the whole tile
    await first.getByRole("link").click();
    await expect(page).toHaveURL(/\/shop\/[a-z0-9-]+$/);
    await expect(page.locator("h1")).toContainText(name!);
  });
});

test.describe("product page", () => {
  test("asks for a size before adding to the cart", async ({ page }) => {
    await page.goto(SANDAL);
    await hydrated(page);
    await page.getByRole("button", { name: "Add to cart" }).first().click();
    await expect(page.getByRole("alert").filter({ hasText: "Choose a size to add" })).toBeVisible();
    await expectCartCount(page, 0);
  });

  test("adds the chosen size to the cart and fills in the WhatsApp message", async ({ page }) => {
    await addToCart(page, SANDAL, "41");
    await expectCartCount(page, 1);
    await page.locator("details", { hasText: "Delivery and returns" }).locator("summary").click();
    const text = whatsappText(await page.getByRole("link", { name: "Order on WhatsApp" }).getAttribute("href"));
    expect(text).toBe(`${GREETING}the Two-Buckle Sandal (Rust suede), EU size 41.`);
  });


  test("Buy now and Add to cart stay above the tab bar while scrolling", async ({ page }) => {
    await page.goto(SANDAL);
    await hydrated(page);
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await expect(page.getByRole("button", { name: /^Buy now/ })).toBeInViewport();
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Choose a size to add" })).toBeInViewport(); // scrolled back to the sizes
  });
});

test.describe("cart", () => {
  test("quantities, totals, saving across visits and removing", async ({ page }) => {
    await addToCart(page, SANDAL, "41");
    await page.goto("/cart");
    await hydrated(page);
    const line = page.locator("main li").filter({ hasText: "Two-Buckle Sandal" });
    await expect(line).toContainText("EU 41");
    const unit = naira(await line.locator(".tabular").first().textContent() ?? ""); // line total at quantity 1

    await line.getByRole("button", { name: "Increase quantity" }).click();
    await expect(line.locator("[aria-live]")).toHaveText("2");
    if (unit > 0) await expect(page.locator("aside")).toContainText((unit * 2).toLocaleString("en-NG"));
    await expectCartCount(page, 2);

    await page.reload();
    await hydrated(page);
    await expect(line.locator("[aria-live]")).toHaveText("2");

    const text = whatsappText(await page.locator("aside").getByRole("link", { name: "Order on WhatsApp" }).getAttribute("href"));
    expect(text).toContain("2 x Two-Buckle Sandal (Rust suede), EU 41");

    await line.getByRole("button", { name: /^Remove / }).click();
    await expect(page.getByText("Your cart is empty")).toBeVisible();
    await expectCartCount(page, 0);
  });

  test("ignores tampered cart data saved in the browser", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("lp-cart-v2", JSON.stringify([
      { slug: "two-buckle-sandal-rust", size: "41", qty: 1 },
      { slug: "two-buckle-sandal-rust", size: "99", qty: 1 },
      { slug: "<img src=x onerror=alert(1)>", size: "41", qty: 1 },
      { slug: "two-buckle-sandal-rust", size: "40", qty: 500 },
      "junk", null, 42,
    ])));
    await page.goto("/cart");
    await hydrated(page);
    await expect(page.locator("main li")).toHaveCount(1);
    await expectCartCount(page, 1);
    await page.evaluate(() => localStorage.setItem("lp-cart-v2", "{not json"));
    await page.reload();
    await expect(page.getByText("Your cart is empty")).toBeVisible();
  });
});

test.describe("receipt", () => {
  test("is generated from the cart, keeps its number, and changes when the cart does", async ({ page }) => {
    await addToCart(page, SANDAL, "41");
    await page.goto("/receipt");
    const receipt = page.getByRole("article", { name: /^Receipt LPW-/ });
    await expect(receipt).toBeVisible();
    const id = (await receipt.getAttribute("aria-label"))!.replace("Receipt ", "");
    expect(id).toMatch(/^LPW-\d{6}-[A-HJ-NP-Z2-9]{4}$/);
    await expect(receipt).toContainText("Two-Buckle Sandal");
    await expect(receipt).toContainText("+234 706 170 2536");
    await expect(receipt).toContainText("Payment pending");

    await page.getByLabel("Name").fill("Ada Test");
    await page.getByLabel("Phone").fill("08012345678");
    await expect(receipt).toContainText("Ada Test · 08012345678");
    const text = whatsappText(await page.getByRole("link", { name: "Send receipt on WhatsApp" }).getAttribute("href"));
    expect(text).toContain(`Receipt ${id}`);
    expect(text).toContain("Name: Ada Test");

    await page.reload();
    await expect(page.getByRole("article", { name: `Receipt ${id}` })).toContainText("Ada Test"); // same receipt after reload

    await addToCart(page, "/shop/cut-out-slide-red", "38");
    await page.goto("/receipt");
    const next = page.getByRole("article", { name: /^Receipt LPW-/ });
    await expect(next).toContainText("Cut-Out Slide");
    expect(await next.getAttribute("aria-label")).not.toBe(`Receipt ${id}`);
    await expect(next).toContainText("Ada Test"); // customer details carry over
  });

  test("an empty cart has no receipt", async ({ page }) => {
    await page.goto("/receipt");
    await expect(page.getByText("there's no receipt yet")).toBeVisible();
  });
});
