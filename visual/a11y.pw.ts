import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const stories = [
  "data--row-selection",
  "data--resizable-columns",
  "data--training-log",
  "display--badges",
  "display--feedback",
  "inputs--selects",
  "layouts--vpn-compact",
  "layouts--support-workspace",
  "navigation--contents",
  "overlays--dialogs",
  "overview--dashboard",
];

async function openStory(page: Page, id: string) {
  await page.goto(`/?story=${id}&mode=preview`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
}

async function expectNoSeriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(
    results.violations
      .filter(({ impact }) => impact === "serious" || impact === "critical")
      .map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map(({ target }) => target) })),
  ).toEqual([]);
}

for (const id of stories) {
  test(`${id} has no serious accessibility violations`, async ({ page }) => {
    await openStory(page, id);
    await expectNoSeriousViolations(page);
  });
}

for (const id of ["data--row-selection", "data--training-log", "display--badges", "display--feedback"]) {
  test(`${id} has no serious accessibility violations in dark mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await openStory(page, id);
    await expectNoSeriousViolations(page);
  });
}

test("table resize works from the keyboard and exposes its value", async ({ page }) => {
  await openStory(page, "data--resizable-columns");
  const separator = page.getByRole("separator").first();
  const before = Number(await separator.getAttribute("aria-valuenow"));
  await separator.press("ArrowRight");
  expect(Number(await separator.getAttribute("aria-valuenow"))).toBeGreaterThan(before);
});

test("dialog traps focus, passes axe while open and restores focus", async ({ page }) => {
  await openStory(page, "overlays--dialogs");
  const trigger = page.getByRole("button", { name: "Dialog", exact: true });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Save preset" })).toBeVisible();
  await expectNoSeriousViolations(page);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Save preset" })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("phone story fits a 375px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await openStory(page, "layouts--vpn-compact");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const box = await page.locator(".stage-device").boundingBox();
  expect(box).not.toBeNull();
  expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(375);
});

test("support workspace filters tickets, switches tabs and adds an IP", async ({ page }) => {
  await openStory(page, "layouts--support-workspace");
  const tickets = page.locator(".support-ticket");
  await page.getByRole("searchbox", { name: "Поиск по тикетам" }).fill("Проверка");
  await expect(tickets).toHaveCount(3);
  await page.getByRole("searchbox", { name: "Поиск по тикетам" }).fill("");
  await page.getByRole("tab", { name: /Бэкапы/ }).click();
  await expect(page.getByText("Демо-снимок A")).toBeVisible();
  await page.getByRole("tab", { name: "IP-адреса" }).click();
  const rows = page.getByRole("table", { name: "IPv4 адреса" }).locator("tbody tr");
  await expect(rows).toHaveCount(2);
  await page.getByRole("button", { name: "Добавить IP" }).click();
  await expect(rows).toHaveCount(3);
});
