import { defineConfig, devices } from "@playwright/test";

// Screenshot of every story from the static Ladle build (`bun run build:stories`). Baselines are
// rendered on Linux in CI (fonts differ per OS); refresh them with the Visual workflow's `update` input.
export default defineConfig({
  testDir: "visual",
  testMatch: "*.pw.ts",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "list",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled", caret: "hide" } },
  // reduced motion: the kit zeroes its durations, smooth scrolls jump — nothing is caught mid-flight
  use: {
    ...devices["Desktop Chrome"],
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
    baseURL: "http://localhost:61001",
  },
  webServer: {
    command: "bunx ladle preview --port 61001",
    url: "http://localhost:61001",
    reuseExistingServer: !process.env.CI,
  },
});
