import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const meta = JSON.parse(readFileSync(join(import.meta.dirname, "../build/meta.json"), "utf8")) as {
  stories: Record<string, unknown>;
};

for (const id of Object.keys(meta.stories)) {
  test(id, async ({ page }) => {
    // fake clock: "now" is fixed and timers don't fire, so streaming logs and relative times hold still
    await page.clock.install({ time: new Date("2026-09-25T12:00:00Z") });
    await page.goto(`/?story=${id}&mode=preview`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot(`${id}.png`, { fullPage: true });
  });
}
