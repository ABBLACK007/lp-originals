import { defineConfig, devices } from "@playwright/test";

// End-to-end tests (tests/). Uses the Chrome already installed on the machine, so no browser download.
//   npm test                                    builds nothing: starts `next start` (run `npm run build` first)
//   BASE_URL=https://lp-originals.vercel.app npm test   runs the same checks against the live site
// Admin tests sign in only when ADMIN_PASSWORD is set, and never save (the store content is shared with production).
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";
const live = !!process.env.BASE_URL;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  workers: 4, // more parallel browsers overload a laptop running the server too (timeouts that aren't real failures)
  retries: live ? 1 : 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [["list"]],
  use: { baseURL, trace: "retain-on-failure" },
  projects: [
    { name: "unit", testMatch: /unit\.spec\.ts/ },
    { name: "desktop", testIgnore: /unit\.spec\.ts/, use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "phone", testIgnore: /unit\.spec\.ts/, use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: live ? undefined : { command: "npm run start", url: baseURL, reuseExistingServer: true, timeout: 120_000 },
});
