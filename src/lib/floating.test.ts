import { afterAll, beforeAll, expect, test } from "bun:test";
import { computePosition } from "./floating";

// computePosition reads the viewport size; the test runner has no DOM
const viewport = { innerWidth: 1000, innerHeight: 800 };
const saved = (globalThis as { window?: unknown }).window;
beforeAll(() => {
  (globalThis as { window?: unknown }).window = viewport;
});
afterAll(() => {
  (globalThis as { window?: unknown }).window = saved;
});

const rect = (x: number, y: number, w: number, h: number) =>
  ({ left: x, top: y, right: x + w, bottom: y + h, width: w, height: h }) as DOMRect;

test("places below-start with the gap when there is room", () => {
  const p = computePosition(rect(100, 100, 80, 30), 200, 120, "bottom-start", 6);
  expect(p).toMatchObject({ x: 100, y: 136, side: "bottom" });
});

test("flips to the opposite side when the preferred one lacks room", () => {
  const p = computePosition(rect(100, 740, 80, 30), 200, 120, "bottom-start", 6);
  expect(p.side).toBe("top");
  expect(p.y).toBe(740 - 6 - 120);
});

test("keeps the preferred side when the opposite has even less room", () => {
  // 40px below vs 20px above: stays below
  const p = computePosition(rect(100, 20, 80, 740), 200, 120, "bottom-start", 6);
  expect(p.side).toBe("bottom");
});

test("aligns end and center, and shifts into the viewport padding", () => {
  expect(computePosition(rect(500, 100, 80, 30), 200, 50, "bottom-end", 6).x).toBe(380);
  expect(computePosition(rect(500, 100, 80, 30), 200, 50, "bottom", 6).x).toBe(440);
  // anchor at the right edge: clamped to viewport - width - 8px padding
  expect(computePosition(rect(950, 100, 40, 30), 200, 50, "bottom-start", 6).x).toBe(1000 - 200 - 8);
  // anchor at the left edge
  expect(computePosition(rect(0, 100, 40, 30), 200, 50, "bottom-end", 6).x).toBe(8);
});

test("side placements and available space", () => {
  const p = computePosition(rect(100, 300, 40, 40), 150, 60, "right-start", 4);
  expect(p).toMatchObject({ x: 144, y: 300, side: "right" });
  expect(p.available).toBe(1000 - 140 - 4 - 8);
});
