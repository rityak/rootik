import { expect, test } from "bun:test";
import { fitCount } from "./overflow-list";

test("fitCount keeps everything that fits, otherwise reserves the indicator", () => {
  expect(fitCount([50, 50, 50], 170, 10, 30)).toBe(3);
  // 30 (+N) + 10 + 50 + 10 + 50 = 150 ≤ 160, a third doesn't fit
  expect(fitCount([50, 50, 50, 50], 160, 10, 30)).toBe(2);
  expect(fitCount([200], 100, 10, 30)).toBe(0);
  expect(fitCount([200], 100, 10, 30, 1)).toBe(1);
});
