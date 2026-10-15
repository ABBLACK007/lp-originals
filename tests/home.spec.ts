// Home (the mockup's app): opening screen, store screen, tab bar, menu and WhatsApp links.
import { test, expect, hydrated, whatsappText, GREETING } from "./fixtures";

test.describe("opening screen", () => {
  test("photo, headline and Next, which moves on to the store", async ({ page }) => {
    await page.goto("/");
    const opening = page.getByRole("region", { name: "Welcome" });
    await expect(opening.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(opening.locator("img")).toHaveJSProperty("complete", true);
    await opening.getByRole("link", { name: "Next" }).click();
    await expect(page).toHaveURL(/#store$/);
    await expect(page.getByRole("searchbox", { name: "Search the shop" })).toBeInViewport();
  });

  test("the store screen: name, search, categories and product cards", async ({ page }) => {
    await page.goto("/");
    const store = page.locator("#store");
    await expect(store).toContainText("LP Wears");
    await expect(store.getByRole("searchbox", { name: "Search the shop" })).toBeVisible();
    await expect(store.getByRole("heading", { name: "Categories" })).toBeVisible();
    await expect(store.getByRole("group", { name: "Filter by style" }).getByRole("button")).toHaveCount(6);
    expect(await store.locator("article").count()).toBeGreaterThan(5);
  });
});

test.describe("app shell", () => {
  test("tab bar: shop, cart, home, WhatsApp chat and saved", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    const bar = page.getByRole("navigation", { name: "Tab bar" });
    await expect(bar).toBeVisible();
    await expect(bar.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    whatsappText(await bar.getByRole("link", { name: "Chat on WhatsApp" }).getAttribute("href"));
    await bar.getByRole("link", { name: "Shop" }).click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(bar.getByRole("link", { name: "Shop" })).toHaveAttribute("aria-current", "page");
    await bar.getByRole("link", { name: /^Saved/ }).click();
    await expect(page).toHaveURL(/\/saved$/);
    await bar.getByRole("link", { name: /^Cart/ }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await bar.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("the store is a phone-width app on every screen", async ({ page }) => {
    await page.goto("/shop");
    const width = await page.locator("main#main").evaluate((m) => m.getBoundingClientRect().width);
    expect(width).toBeLessThanOrEqual(430);
  });

  test("the tab bar never covers the last products", async ({ page }) => {
    await page.goto("/shop");
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    const lastBottom = await page.locator("main article").last().evaluate((a) => a.getBoundingClientRect().bottom);
    const barTop = await page.getByRole("navigation", { name: "Tab bar" }).evaluate((n) => n.getBoundingClientRect().top);
    expect(lastBottom).toBeLessThanOrEqual(barTop);
  });

  test("menu: gallery, help, saved and the links out", async ({ page }) => {
    await page.goto("/shop");
    await hydrated(page);
    await page.getByRole("button", { name: "Menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    whatsappText(await menu.getByRole("link", { name: "Track my order" }).getAttribute("href"));
    await menu.getByRole("link", { name: "Gallery" }).click();
    await expect(page).toHaveURL(/\/gallery$/);
    await expect(page.locator("h1")).toHaveText(/gallery/i);
    await page.goBack();
    await hydrated(page);
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "Size guide" }).click();
    await expect(page).toHaveURL(/\/help#sizes$/);
    await expect(page.getByRole("heading", { name: "Size guide" })).toBeInViewport();
  });
});

test.describe("WhatsApp", () => {
  test("every WhatsApp link opens the LP chat with the greeting typed", async ({ page }) => {
    for (const path of ["/", "/shop/two-buckle-sandal-rust", "/help"]) {
      await page.goto(path);
      const hrefs = await page.locator('a[href^="https://wa.me/"]').evaluateAll((as) => as.map((a) => [a.getAttribute("href"), a.getAttribute("target"), a.getAttribute("rel")]));
      expect(hrefs.length, path).toBeGreaterThan(0);
      for (const [href, target, rel] of hrefs) {
        expect(whatsappText(href)).toMatch(new RegExp(`^${GREETING.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
        expect(target).toBe("_blank");
        expect(rel).toMatch(/noreferrer/);
      }
    }
  });
});
