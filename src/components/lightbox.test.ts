import { describe, expect, test } from "bun:test";
import { clampView, FIT_VIEW, zoomAt } from "./lightbox";

describe("zoomAt", () => {
  test("zooming at the center keeps the pan", () => {
    expect(zoomAt(FIT_VIEW, 2)).toEqual({ scale: 2, x: 0, y: 0 });
  });

  test("the point under the cursor stays put", () => {
    const at = { x: 100, y: -40 };
    const view = zoomAt({ scale: 1.5, x: 20, y: 10 }, 3, at);
    // image point under `at` before and after: (at - pan) / scale
    expect((at.x - view.x) / view.scale).toBeCloseTo((at.x - 20) / 1.5);
    expect((at.y - view.y) / view.scale).toBeCloseTo((at.y - 10) / 1.5);
  });

  test("zooming back to 1 around the same point returns to the start", () => {
    const at = { x: 60, y: 30 };
    const back = zoomAt(zoomAt(FIT_VIEW, 2.5, at), 1, at);
    expect(back.x).toBeCloseTo(0);
    expect(back.y).toBeCloseTo(0);
  });
});

describe("clampView", () => {
  const stage = { width: 800, height: 600 };
  const content = { width: 800, height: 400 };

  test("a fitted image can't pan", () => {
    expect(clampView({ scale: 1, x: 50, y: -30 }, content, stage)).toEqual({ scale: 1, x: 0, y: 0 });
  });

  test("pans up to the overflow on each axis", () => {
    // 2x: 1600×800 in 800×600 → ±400 horizontally, ±100 vertically
    expect(clampView({ scale: 2, x: 999, y: -999 }, content, stage)).toEqual({ scale: 2, x: 400, y: -100 });
    expect(clampView({ scale: 2, x: 120, y: 40 }, content, stage)).toEqual({ scale: 2, x: 120, y: 40 });
  });

  test("an axis that still fits stays centred", () => {
    expect(clampView({ scale: 1.2, x: 10, y: 80 }, content, stage)).toEqual({ scale: 1.2, x: 10, y: 0 });
  });
});
