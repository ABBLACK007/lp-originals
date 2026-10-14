// Admin sign-in. The editor test signs in only when ADMIN_PASSWORD is set, and never saves
// (the store content is shared with the live site).
import { test, expect, hydrated } from "./fixtures";

test.use({ trace: "off" }); // traces would record the typed password

test.describe("admin", () => {
  test("wrong password is refused", async ({ page }) => {
    await page.goto("/admin/login");
    await hydrated(page);
    await page.getByLabel("Password").fill("definitely-not-the-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert").filter({ hasText: /wrong password/i })).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("signed-in editor: tabs, unsaved-change tracking, discard, sign out", async ({ page }) => {
    const password = process.env.ADMIN_PASSWORD;
    test.skip(!password, "set ADMIN_PASSWORD to run");
    await page.goto("/admin/login");
    await hydrated(page);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin$/, { timeout: 30_000 }); // loads the latest content from storage
    await hydrated(page);
    await expect(page.getByText("All changes saved.")).toBeVisible();

    for (const tab of ["Hero slides", "Gallery", "Settings", "Products & prices"]) {
      await page.getByRole("button", { name: tab }).click();
      await expect(page.getByRole("button", { name: tab })).toHaveAttribute("aria-pressed", "true");
    }

    // Edit something, check it's tracked, then throw it away. Nothing is saved.
    await page.getByRole("button", { name: "Settings" }).click();
    const days = page.getByLabel(/Production time/i);
    const before = await days.inputValue();
    await days.fill(`${before}9`);
    await expect(page.getByText("You have unsaved changes.")).toBeVisible();
    await page.getByRole("button", { name: "Discard" }).click();
    await expect(days).toHaveValue(before);
    await expect(page.getByText("All changes saved.")).toBeVisible();

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/admin\/login$/, { timeout: 30_000 });
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});
