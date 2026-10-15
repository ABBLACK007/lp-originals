// The shop-app features: search, sort and filter, saved styles, quick add, colours, quantity and Buy now.
import { test, expect, hydrated, isPhone } from "./fixtures";
import type { Page } from "@playwright/test";

const cards = (page: Page) => page.locator("main article");
const prices = async (page: Page) => (await cards(page).locator(".tabular").allTextContents()).map((t) => Number(t.replace(/[^\d]/g, "")));

test.describe("search", () => {
  test("filters as you type, keeps the search in the address, and helps when nothing matches", async ({ page }) => {
    await page.goto("/shop");
    await hydrated(page);
    const all = await cards(page).count();
    const search = page.getByRole("searchbox", { name: "Search the shop" });
    await search.fill("black");
    await expect(page).toHaveURL(/[?&]q=black/);
    const n = await cards(page).count();
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(all);
    await expect(page.getByText(new RegExp(`^${n} styles? for “black”`))).toBeVisible();

    await search.fill("zzzz");
    await expect(page.getByText("No styles match “zzzz”")).toBeVisible();
    await page.getByRole("button", { name: "suede", exact: true }).click();
    await expect(search).toHaveValue("suede");
    expect(await cards(page).count()).toBeGreaterThan(0);

    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(cards(page)).toHaveCount(all);
    await expect(page).toHaveURL(/\/shop$/);
  });

  test("searching from the home page opens the shop with the results", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    const search = page.getByRole("searchbox", { name: "Search the shop" });
    await search.fill("clog");
    await search.press("Enter");
    await expect(page).toHaveURL(/\/shop\?q=clog$/);
    await expect(page.getByRole("searchbox", { name: "Search the shop" })).toHaveValue("clog");
    await expect(cards(page)).toHaveCount(1);
    await expect(cards(page).first()).toContainText("Clog");
  });
});

test.describe("sort and filter", () => {
  test("price sorting and the men / women filter", async ({ page }) => {
    await page.goto("/shop");
    await hydrated(page);
    const all = await cards(page).count();
    await page.getByRole("button", { name: "Sort and filter" }).click();
    const panel = page.locator("#shop-filters");
    await panel.getByRole("button", { name: "Price: low to high" }).click();
    const up = await prices(page);
    expect(up).toEqual([...up].sort((a, b) => a - b));
    await panel.getByRole("button", { name: "Price: high to low" }).click();
    const down = await prices(page);
    expect(down).toEqual([...down].sort((a, b) => b - a));

    await panel.getByRole("button", { name: "Women", exact: true }).click();
    const women = await cards(page).count();
    expect(women).toBeLessThan(all); // pairs made only for men drop out; unisex pairs stay
    await panel.getByRole("button", { name: /^Show \d+ styles?$/ }).click();
    await expect(panel).toBeHidden();
    await page.getByRole("button", { name: "Sort and filter" }).click();
    await page.locator("#shop-filters").getByRole("button", { name: "Reset" }).click();
    await expect(cards(page)).toHaveCount(all);
  });
});

test.describe("saved styles", () => {
  test("the heart saves a style, the Saved page lists it, and it lasts after reloading", async ({ page }) => {
    await page.goto("/shop");
    await hydrated(page);
    const heart = page.getByRole("button", { name: "Save Two-Buckle Sandal" });
    await heart.click();
    await expect(page.getByRole("button", { name: "Remove Two-Buckle Sandal from saved" })).toHaveAttribute("aria-pressed", "true");
    await page.reload();
    await hydrated(page);
    await expect(page.getByRole("button", { name: "Remove Two-Buckle Sandal from saved" })).toBeVisible();

    await page.goto("/saved");
    await expect(cards(page)).toHaveCount(1);
    await expect(cards(page).first()).toContainText("Two-Buckle Sandal");
    await hydrated(page);
    await page.getByRole("button", { name: "Remove Two-Buckle Sandal from saved" }).click();
    await expect(page.getByText("No saved styles yet")).toBeVisible();
  });

  test("ignores tampered saved data", async ({ page }) => {
    // Written before any page script runs, as a visitor (or another tab) might have left it.
    await page.addInitScript(() => localStorage.setItem("lp-saved-v1", JSON.stringify(["two-buckle-sandal-rust", "not-a-product", 7, "<script>"])));
    await page.goto("/saved");
    await expect(cards(page)).toHaveCount(1);
  });
});

test.describe("quick add", () => {
  test("the cart button on a tile asks for a size, then adds the pair", async ({ page }) => {
    await page.goto("/shop");
    await hydrated(page);
    await page.getByRole("button", { name: "Add Two-Buckle Sandal to cart" }).click();
    const sheet = page.getByRole("dialog", { name: "Choose a size" });
    await expect(sheet).toBeVisible();
    await sheet.getByRole("button", { name: "Add to cart" }).click();
    await expect(sheet.getByRole("alert")).toContainText("Choose a size first");
    await sheet.getByRole("button", { name: "42", exact: true }).click();
    await sheet.getByRole("button", { name: "Add to cart" }).click();
    await expect(sheet.getByRole("status")).toContainText("Added to cart, EU 42");
    await sheet.getByRole("link", { name: "View cart" }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.locator("main li").filter({ hasText: "Two-Buckle Sandal" })).toContainText("EU 42");
  });

  test("Escape closes the size sheet", async ({ page }) => {
    test.skip(isPhone(), "keyboard");
    await page.goto("/shop");
    await hydrated(page);
    await page.getByRole("button", { name: "Add Cut-Out Slide to cart" }).click();
    await expect(page.getByRole("dialog", { name: "Choose a size" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Choose a size" })).toBeHidden();
  });
});

test.describe("product page", () => {
  test("colour swatches link the other colours of a style", async ({ page }) => {
    await page.goto("/shop/stitched-cut-out-slide-black");
    await hydrated(page);
    const colours = page.getByRole("group", { name: "Colours" });
    await expect(colours.locator("[aria-current]")).toContainText("Black leather, white stitching");
    await colours.getByRole("link", { name: /green velvet/ }).click();
    await expect(page).toHaveURL(/\/shop\/stitched-cut-out-slide-green$/);
  });

  test("quantity and Buy now put the pairs in the cart", async ({ page }) => {
    await page.goto("/shop/two-buckle-sandal-rust");
    await hydrated(page);
    await page.getByRole("button", { name: "Increase quantity" }).click();
    await expect(page.getByRole("group", { name: "Quantity" }).locator("[aria-live]")).toHaveText("2");
    await expect(page.getByRole("button", { name: /^Buy now for ₦\s?56,000$/ })).toBeVisible();
    await page.getByRole("button", { name: "40", exact: true }).click();
    await page.getByRole("button", { name: /^Buy now/ }).click();
    await expect(page).toHaveURL(/\/cart$/);
    const line = page.locator("main li").filter({ hasText: "Two-Buckle Sandal" });
    await expect(line).toContainText("EU 40");
    await expect(line.locator("[aria-live]")).toHaveText("2");
  });

  test("description is open, delivery folds out", async ({ page }) => {
    await page.goto("/shop/two-buckle-sandal-rust");
    const description = page.locator("details", { hasText: "Description" });
    await expect(description).toHaveAttribute("open", "");
    const delivery = page.locator("details", { hasText: "Delivery and returns" });
    await expect(delivery).not.toHaveAttribute("open", "");
    await delivery.locator("summary").click();
    await expect(delivery).toHaveAttribute("open", "");
    await expect(delivery).toContainText("working days");
  });

  test("the stand turns to the next photo", async ({ page }) => {
    await page.goto("/shop/two-buckle-sandal-rust");
    await hydrated(page);
    await page.getByRole("button", { name: /^Turn to photo 2 of/ }).click();
    await expect(page.getByRole("group", { name: "Product photos" }).getByRole("button", { name: "Show photo 2" })).toHaveAttribute("aria-pressed", "true");
  });

  test("phones: back button and save in the top bar", async ({ page }) => {
    test.skip(!isPhone(), "phones only");
    await page.goto("/shop");
    await hydrated(page);
    await cards(page).first().getByRole("link").click();
    await expect(page).toHaveURL(/\/shop\/[a-z0-9-]+$/);
    await hydrated(page);
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page).toHaveURL(/\/shop$/);
  });
});
