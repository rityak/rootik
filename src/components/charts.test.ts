import { expect, test } from "bun:test";
import { bin } from "./charts";

test("bin counts every value once, edges are nice and the max lands in the last bin", () => {
  const values = [0, 0.5, 1, 1.5, 2, 9.99, 10];
  const bins = bin(values, { count: 5 });
  expect(bins.map((b) => [b.x0, b.x1])).toEqual([
    [0, 2],
    [2, 4],
    [4, 6],
    [6, 8],
    [8, 10],
  ]);
  expect(bins.reduce((n, b) => n + b.value, 0)).toBe(values.length);
  expect(bins.at(-1)?.value).toBe(2);
});

test("bin ignores values outside an explicit domain", () => {
  expect(bin([-5, 1, 2, 50], { domain: [0, 10], count: 2 }).reduce((n, b) => n + b.value, 0)).toBe(2);
});

import { treemapLayout, waffleCells } from "./part-charts";

test("waffleCells rounds shares by largest remainder to the rounded total", () => {
  expect(waffleCells([1, 1, 1], 3)).toEqual([34, 33, 33]);
  expect(waffleCells([30, 20], 100)).toEqual([30, 20]);
});

test("treemapLayout tiles the box without gaps: areas are proportional and sum to the whole", () => {
  const rects = treemapLayout([6, 6, 4, 3, 2, 2, 1], 600, 400);
  const area = rects.reduce((n, r) => n + r.w * r.h, 0);
  expect(Math.round(area)).toBe(600 * 400);
  expect(Math.round((rects[0]?.w ?? 0) * (rects[0]?.h ?? 0))).toBe(Math.round((600 * 400 * 6) / 24));
  for (const r of rects) {
    expect(r.x + r.w).toBeLessThanOrEqual(600 + 1e-6);
    expect(r.y + r.h).toBeLessThanOrEqual(400 + 1e-6);
  }
});
