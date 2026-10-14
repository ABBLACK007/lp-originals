// Gallery: filters and the photo viewer.
import { test, expect, hydrated } from "./fixtures";

test.describe("gallery", () => {
  test("filters, opens the photo viewer, steps through and closes", async ({ page }) => {
    await page.goto("/gallery");
    await hydrated(page);
    const photos = page.locator("main ul li");
    const all = await photos.count();
    expect(all).toBeGreaterThan(3);
    await page.getByRole("button", { name: "Campaign" }).click();
    const campaign = await photos.count();
    expect(campaign).toBeLessThan(all);
    await page.getByRole("button", { name: "All", exact: true }).click();
    await expect(photos).toHaveCount(all);

    await photos.first().getByRole("button").click();
    const viewer = page.getByRole("dialog", { name: "Photo viewer" });
    await expect(viewer).toBeVisible();
    await expect(viewer).toContainText(`1 / ${all}`);
    await viewer.getByRole("button", { name: "Next photo" }).click();
    await expect(viewer).toContainText(`2 / ${all}`);
    await page.keyboard.press("ArrowLeft");
    await expect(viewer).toContainText(`1 / ${all}`);
    await viewer.getByRole("button", { name: "Previous photo" }).click();
    await expect(viewer).toContainText(`${all} / ${all}`); // wraps around
    await page.keyboard.press("Escape");
    await expect(viewer).toBeHidden();
  });
});
