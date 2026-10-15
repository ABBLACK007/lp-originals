// Every page loads cleanly, navigation works, and the security and SEO basics are in place.
import { test, expect, allowConsoleErrors, hydrated, isPhone } from "./fixtures";

const pages = [
  { path: "/", h1: /LP Wears/ },
  { path: "/shop", h1: /Shop all styles/i },
  { path: "/shop?category=clogs", h1: /Shop all styles/i },
  { path: "/shop/two-buckle-sandal-rust", h1: /Two-Buckle Sandal/ },
  { path: "/gallery", h1: /gallery/i },
  { path: "/cart", h1: /cart/i },
  { path: "/receipt", h1: /receipt/i },
  { path: "/saved", h1: /Saved styles/i },
];

test.describe("pages", () => {
  for (const p of pages) {
    test(`${p.path} loads with one main heading and working images`, async ({ page }) => {
      const res = await page.goto(p.path);
      expect(res?.status()).toBe(200);
      await expect(page).toHaveTitle(/LP Wears/);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(p.h1);
      await expect(page.locator("main#main")).toBeVisible();
      // No broken images among those that have loaded or are on screen.
      await page.waitForLoadState("load");
      const broken = await page.locator("img").evaluateAll((imgs) =>
        (imgs as HTMLImageElement[]).filter((i) => i.complete && i.currentSrc && i.naturalWidth === 0).map((i) => i.currentSrc));
      expect(broken).toEqual([]);
    });
  }

  test("unknown pages show the 404 page", async ({ page }) => {
    allowConsoleErrors(); // the browser logs the 404 response
    for (const path of ["/nope", "/shop/not-a-product", "/shop/category/bogus"]) {
      const res = await page.goto(path);
      expect(res?.status(), path).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(/walked off/i);
    }
  });

  test("no page is wider than a small phone (320px)", async ({ page }) => {
    test.skip(!isPhone(), "phones");
    await page.setViewportSize({ width: 320, height: 640 });
    await page.addInitScript(() => {
      localStorage.setItem("lp-cart-v2", JSON.stringify([{ slug: "stitched-cut-out-slide-green", size: "41", qty: 2 }]));
      localStorage.setItem("lp-saved-v1", JSON.stringify(["perforated-cut-out-slide-brown"]));
    });
    for (const path of ["/", "/shop", "/shop/stitched-cut-out-slide-black", "/shop/category/slides", "/cart", "/receipt", "/saved", "/gallery", "/nope"]) {
      await page.goto(path);
      await page.waitForTimeout(300);
      const [scroll, client] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      expect(scroll, path).toBeLessThanOrEqual(client);
    }
    allowConsoleErrors(); // the 404 page
  });

  test("old product link redirects to the new one", async ({ request }) => {
    const res = await request.get("/shop/closed-toe-clog", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers().location).toMatch(/\/shop\/closed-toe-clog-mocha$/);
  });
});

test.describe("navigation", () => {
  test("header links reach the main pages", async ({ page }) => {
    await page.goto("/shop");
    await hydrated(page);
    const header = page.locator("header").first();
    const go = async (label: string) => {
      if (isPhone()) {
        await header.getByRole("button", { name: "Open menu" }).click();
        await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: label }).click();
      } else {
        await header.getByRole("navigation", { name: "Main" }).getByRole("link", { name: label }).click();
      }
    };
    await go("Gallery");
    await expect(page).toHaveURL(/\/gallery$/);
    await expect(page.locator("h1")).toHaveText(/gallery/i);
    await go("Shop");
    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByRole("navigation", { name: "Mobile" })).toHaveCount(0); // menu closes after navigating
    await page.locator("header").first().getByRole("link", { name: "LP Wears home" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("skip link moves focus to the content", async ({ page }) => {
    test.skip(isPhone(), "keyboard only");
    await page.goto("/shop");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });
});

test.describe("security", () => {
  test("security headers are sent", async ({ request }) => {
    const h = (await request.get("/")).headers();
    expect(h["content-security-policy"]).toContain("default-src 'self'");
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(h["content-security-policy"]).not.toContain("unsafe-eval");
    expect(h["strict-transport-security"]).toContain("max-age=");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["permissions-policy"]).toContain("camera=()");
    expect(h["cross-origin-opener-policy"]).toBe("same-origin");
    expect(h["x-powered-by"]).toBeUndefined();
  });

  test("the image optimizer only serves this site's photos", async ({ request }) => {
    const remote = await request.get("/_next/image?url=" + encodeURIComponent("https://example.com/a.jpg") + "&w=640&q=75");
    expect(remote.status()).toBe(400);
    const otherBlobPath = await request.get("/_next/image?url=" + encodeURIComponent("https://pfv4isj8xyzwi9ga.public.blob.vercel-storage.com/content/store-1.json") + "&w=640&q=75");
    expect(otherBlobPath.status()).toBe(400);
    const quality = await request.get("/_next/image?url=%2Ficons%2Ficon-512.png&w=640&q=100");
    expect(quality.status()).toBe(400);
  });

  test("admin pages need a valid sign-in", async ({ request }) => {
    for (const cookie of [undefined, "lp_admin=9999999999999.forged", "lp_admin=1.abc"]) {
      const res = await request.get("/admin", { maxRedirects: 0, headers: cookie ? { cookie } : {} });
      expect(res.status(), cookie).toBe(307);
      expect(res.headers().location).toMatch(/\/admin\/login$/);
    }
    const login = await request.get("/admin/login");
    expect(login.status()).toBe(200);
    expect(login.headers()["cache-control"]).toMatch(/no-store|private/);
  });

  test("search engines skip admin, cart, receipt and saved; sitemap lists the products", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    for (const path of ["/admin", "/cart", "/receipt", "/saved"]) expect(robots).toContain(`Disallow: ${path}`);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/shop/two-buckle-sandal-rust</loc>");
    expect(sitemap).not.toContain("/admin");
  });

  test("favicon.ico exists (browsers ask for it during navigation)", async ({ request }) => {
    const res = await request.get("/favicon.ico");
    expect(res.status()).toBe(200);
  });

  test("product pages carry structured data", async ({ page }) => {
    await page.goto("/shop/two-buckle-sandal-rust");
    const json = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent() ?? "{}");
    expect(json["@type"]).toBe("Product");
    expect(json.name).toContain("Two-Buckle Sandal");
  });
});
