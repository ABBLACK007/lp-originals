import { test as base, expect, type Page } from "@playwright/test";

// Every browser test fails if the page logs a JavaScript error or a console error (hydration mismatches,
// crashed components, blocked scripts). Tests that expect an error response opt out with allowConsoleErrors().
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [async ({ page }, use, info) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
    await use(errors);
    if (!info.annotations.some((a) => a.type === "allow-console-errors")) expect(errors, "console errors").toEqual([]);
  }, { auto: true }],
});
export { expect };

export const allowConsoleErrors = () => test.info().annotations.push({ type: "allow-console-errors" });

export const WHATSAPP = "2347061702536";
export const GREETING = "Hi, I'm from the LP Wears website. I want to get ";

// The pre-typed WhatsApp message of a wa.me link.
export function whatsappText(href: string | null) {
  expect(href).toMatch(new RegExp(`^https://wa\\.me/${WHATSAPP}\\?text=`));
  return new URL(href!).searchParams.get("text") ?? "";
}

// Wait until React has hydrated (event handlers attached), so clicks aren't lost on a slow first load.
export async function hydrated(page: Page) {
  await page.waitForFunction(() => {
    const b = document.querySelector("button");
    return !!b && Object.keys(b).some((k) => k.startsWith("__reactProps$"));
  });
}

export const isPhone = () => test.info().project.name === "phone";
