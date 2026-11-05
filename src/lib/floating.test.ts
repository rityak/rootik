import { afterAll, beforeAll, expect, test } from "bun:test";
import { clampFloatingPosition, computePosition, floatingViewport } from "./floating";

// computePosition reads the viewport size; the test runner has no DOM
const viewport: {
  innerWidth: number;
  innerHeight: number;
  visualViewport?: { width: number; height: number; offsetLeft: number; offsetTop: number };
  document?: { documentElement: { clientWidth: number } };
} = { innerWidth: 1000, innerHeight: 800 };
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
  expect(p.availableHeight).toBe(800 - 16);
});

test("visible viewport offsets constrain layers above the keyboard and inside pinch zoom", () => {
  viewport.visualViewport = { width: 320, height: 240, offsetLeft: 100, offsetTop: 200 };
  try {
    const p = computePosition(rect(330, 370, 60, 30), 200, 120, "bottom-end", 6);
    expect(p).toMatchObject({ x: 190, y: 244, side: "top", availableHeight: 156 });
    expect(clampFloatingPosition(900, -10, 304, 224)).toEqual({ x: 108, y: 208 });
  } finally {
    Reflect.deleteProperty(viewport, "visualViewport");
  }
});

test("viewport width excludes the page scrollbar when visualViewport is unavailable", () => {
  viewport.document = { documentElement: { clientWidth: 980 } };
  try {
    expect(floatingViewport().width).toBe(980);
    expect(clampFloatingPosition(900, 900, 360, 280)).toEqual({ x: 612, y: 512 });
  } finally {
    Reflect.deleteProperty(viewport, "document");
  }
});

test("offscreen anchors never produce a negative height budget", () => {
  const p = computePosition(rect(-100, -100, 1200, 1000), 200, 120, "bottom", 6);
  expect(p.available).toBe(0);
  expect(p.availableHeight).toBe(0);
  expect(p.x).toBeGreaterThanOrEqual(8);
  expect(p.y).toBeGreaterThanOrEqual(8);
});
