// Shopping: filters, choosing a size, cart, receipt and the WhatsApp order messages.
import { test, expect, hydrated, isPhone, whatsappText, GREETING } from "./fixtures";
import type { Page } from "@playwright/test";

const SANDAL = "/shop/two-buckle-sandal-rust";
const cards = (page: Page) => page.locator("main article");
const cartButton = (page: Page) => page.locator("header").first().getByRole("link", { name: /^Cart, / });
const naira = (s: string) => Number(s.replace(/[^\d]/g, ""));

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
    await expect(filters.getByRole("button", { name: /^All/ })).toContainText(String(all));

    await filters.getByRole("button", { name: /^Clogs/ }).click();
    await expect(page).toHaveURL(/\?category=clogs$/);
    const clogs = await cards(page).count();
    expect(clogs).toBeGreaterThan(0);
    expect(clogs).toBeLessThan(all);
    for (const label of await cards(page).locator("span.uppercase").allTextContents()) expect(label).toBe("Clogs");

    await page.reload();
    await expect(filters.getByRole("button", { name: /^Clogs/ })).toHaveAttribute("aria-pressed", "true");
    await expect(cards(page)).toHaveCount(clogs);

    await hydrated(page);
    await filters.getByRole("button", { name: /^All/ }).click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(cards(page)).toHaveCount(all);
  });

  test("product cards open the product page", async ({ page }) => {
    await page.goto("/shop");
    const first = cards(page).first();
    const name = (await first.getByRole("link").nth(1).textContent())?.trim(); // photo, name, "Choose size"
    await first.getByRole("link").first().click();
    await expect(page).toHaveURL(/\/shop\/[a-z0-9-]+$/);
    await expect(page.locator("h1")).toContainText(name!);
  });

  test("category links from a product open the filtered shop", async ({ page }) => {
    await page.goto(SANDAL);
    await page.getByRole("link", { name: "Cork footbed" }).first().click();
    await expect(page).toHaveURL(/\/shop\?category=cork$/);
    await expect(page.getByRole("group", { name: "Filter by style" }).getByRole("button", { name: /^Cork footbed/ })).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("product page", () => {
  test("asks for a size before adding to the cart", async ({ page }) => {
    await page.goto(SANDAL);
    await hydrated(page);
    await page.getByRole("button", { name: "Add to cart" }).first().click();
    await expect(page.getByRole("alert").filter({ hasText: "Choose a size to add" })).toBeVisible();
    await expect(cartButton(page)).toHaveAccessibleName("Cart, 0 items");
  });

  test("adds the chosen size to the cart and fills in the WhatsApp message", async ({ page }) => {
    await addToCart(page, SANDAL, "41");
    await expect(cartButton(page)).toHaveAccessibleName("Cart, 1 item");
    const text = whatsappText(await page.getByRole("link", { name: "Order on WhatsApp" }).last().getAttribute("href"));
    expect(text).toBe(`${GREETING}the Two-Buckle Sandal (Rust suede), EU size 41.`);
  });

  test("photo thumbnails switch the main photo", async ({ page }) => {
    await page.goto(SANDAL);
    await hydrated(page);
    const thumbs = page.getByRole("group", { name: "Product photos" }).getByRole("button");
    test.skip((await thumbs.count()) < 2, "product has one photo");
    await thumbs.nth(1).click();
    await expect(thumbs.nth(1)).toHaveAttribute("aria-pressed", "true");
    await expect(thumbs.nth(0)).toHaveAttribute("aria-pressed", "false");
  });

  test("phones get a sticky add-to-cart bar after scrolling", async ({ page }) => {
    test.skip(!isPhone(), "phones only");
    await page.goto(SANDAL);
    await hydrated(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    const bar = page.locator("div.fixed.bottom-0").filter({ hasText: "Two-Buckle Sandal" });
    await expect(bar).toBeVisible();
    await bar.getByRole("button", { name: "Choose size" }).click();
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
    const unit = naira(await line.locator("span.text-sm").filter({ hasText: "₦" }).first().textContent() ?? "");

    await line.getByRole("button", { name: "Increase quantity" }).click();
    await expect(line.locator("[aria-live]")).toHaveText("2");
    if (unit > 0) await expect(page.locator("aside")).toContainText((unit * 2).toLocaleString("en-NG"));
    await expect(cartButton(page)).toHaveAccessibleName("Cart, 2 items");

    await page.reload();
    await hydrated(page);
    await expect(line.locator("[aria-live]")).toHaveText("2");

    const text = whatsappText(await page.locator("aside").getByRole("link", { name: "Order on WhatsApp" }).getAttribute("href"));
    expect(text).toContain("2 x Two-Buckle Sandal (Rust suede), EU 41");

    await line.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByText("Your cart is empty")).toBeVisible();
    await expect(cartButton(page)).toHaveAccessibleName("Cart, 0 items");
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
    await expect(cartButton(page)).toHaveAccessibleName("Cart, 1 item");
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
