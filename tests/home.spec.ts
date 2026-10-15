// Home page: hero slideshow, WhatsApp buttons, scroll reveals.
import { test, expect, hydrated, isPhone, whatsappText, GREETING } from "./fixtures";

test.describe("hero slideshow", () => {
  test("shows one slide at a time and the dots switch slides", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    const hero = page.locator('[aria-roledescription="carousel"]');
    const slides = hero.locator('[aria-roledescription="slide"]');
    const n = await slides.count();
    expect(n).toBeGreaterThan(1);
    await expect(hero.locator('[aria-roledescription="slide"]:not([aria-hidden="true"])')).toHaveCount(1);
    await expect(slides.first()).not.toHaveAttribute("aria-hidden", "true");

    await hero.getByRole("button", { name: /^Show slide 2:/ }).click();
    await expect(slides.nth(1)).not.toHaveAttribute("aria-hidden", "true");
    await expect(slides.first()).toHaveAttribute("aria-hidden", "true");
    await expect(hero.getByRole("button", { name: /^Show slide 2:/ })).toHaveAttribute("aria-current", "true");
  });

  test("previous/next buttons and keyboard arrows (desktop)", async ({ page }) => {
    test.skip(isPhone(), "desktop controls");
    await page.goto("/");
    await hydrated(page);
    const hero = page.locator('[aria-roledescription="carousel"]');
    const slides = hero.locator('[aria-roledescription="slide"]');
    const n = await slides.count();
    await hero.getByRole("button", { name: "Next slide" }).click();
    await expect(slides.nth(1)).not.toHaveAttribute("aria-hidden", "true");
    await hero.getByRole("button", { name: "Previous slide" }).click();
    await hero.getByRole("button", { name: "Previous slide" }).click();
    await expect(slides.nth(n - 1)).not.toHaveAttribute("aria-hidden", "true"); // wraps around
    await page.keyboard.press("ArrowRight");
    await expect(slides.first()).not.toHaveAttribute("aria-hidden", "true");
  });

  test("swiping changes slides (phones)", async ({ page }) => {
    test.skip(!isPhone(), "touch");
    await page.goto("/");
    await hydrated(page);
    const hero = page.locator('[aria-roledescription="carousel"]');
    const box = (await hero.boundingBox())!;
    const y = box.y + box.height / 2;
    await hero.dispatchEvent("pointerdown", { pointerType: "touch", clientX: box.x + box.width - 40, clientY: y, isPrimary: true });
    await hero.dispatchEvent("pointerup", { pointerType: "touch", clientX: box.x + 40, clientY: y, isPrimary: true });
    await expect(hero.locator('[aria-roledescription="slide"]').nth(1)).not.toHaveAttribute("aria-hidden", "true");
  });

  test("autoplay can be paused", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    const pause = page.getByRole("button", { name: "Pause slideshow" });
    await pause.click();
    await expect(page.getByRole("button", { name: "Play slideshow" })).toBeVisible();
  });

  test("no autoplay for people who prefer reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await hydrated(page);
    await expect(page.getByRole("button", { name: "Pause slideshow" })).toHaveCount(0);
  });
});

test.describe("WhatsApp", () => {
  test("every WhatsApp link opens the LP chat with the greeting typed", async ({ page }) => {
    await page.goto("/");
    const links = page.locator('a[href^="https://wa.me/"]');
    expect(await links.count()).toBeGreaterThan(2);
    for (const href of await links.evaluateAll((as) => as.map((a) => a.getAttribute("href")))) {
      expect(whatsappText(href)).toMatch(new RegExp(`^${GREETING.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
    }
    for (const a of await links.all()) {
      await expect(a).toHaveAttribute("target", "_blank");
      await expect(a).toHaveAttribute("rel", /noreferrer/);
    }
  });

  test("phone tab bar: shop, saved, home, cart and WhatsApp chat", async ({ page }) => {
    test.skip(!isPhone(), "phones only");
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
  });

  test("the tab bar never covers the end of the page", async ({ page }) => {
    test.skip(!isPhone(), "phones only");
    await page.goto("/cart");
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    const footerBottom = await page.locator("footer").evaluate((f) => f.getBoundingClientRect().bottom);
    const barTop = await page.getByRole("navigation", { name: "Tab bar" }).evaluate((n) => n.getBoundingClientRect().top);
    expect(footerBottom).toBeLessThanOrEqual(barTop);
  });
});

test.describe("scroll reveals", () => {
  test("sections fade in as they come into view, and everything is visible by the end", async ({ page }) => {
    await page.goto("/");
    const below = page.locator("#ordering [data-reveal]").first();
    await expect(below).not.toHaveAttribute("data-in", ""); // not revealed while off screen
    // Scroll through the page the way a visitor would.
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 500) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(40);
    }
    await expect(below).toHaveAttribute("data-in", "");
    // Everything left hidden must be off to the side in a swipe row (those reveal as they're swiped in).
    const hidden = await page.locator("[data-reveal]:not([data-in])").evaluateAll((els) =>
      els.filter((e) => { const r = e.getBoundingClientRect(); return r.right > 0 && r.left < innerWidth; }).length);
    expect(hidden).toBe(0);
  });

  test("content on screen shows without waiting for the page's JavaScript", async ({ page }) => {
    // Block the page's script files: the inline reveal script alone must show the shop.
    await page.route(/\/_next\/static\/chunks\/.*\.js$/, (r) => r.abort());
    await page.goto("/shop");
    await expect(page.locator("main [data-reveal]").first()).toHaveAttribute("data-in", "");
    await expect(page.locator("main article").first()).toBeVisible();
    test.info().annotations.push({ type: "allow-console-errors" }); // the blocked scripts
  });

  test("with reduced motion everything is shown immediately", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const opacity = await page.locator("#details [data-reveal]").first().evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe("1");
  });
});
