import { describe, expect, test } from "bun:test";
import { formatOklch, inSrgbGamut, oklchToHex, parseColor } from "./color-picker";

describe("parseColor", () => {
  test("oklch with and without alpha, percentages", () => {
    expect(parseColor("oklch(0.57 0.2 277)")).toEqual({ l: 0.57, c: 0.2, h: 277, alpha: 1 });
    expect(parseColor("oklch(57% 50% 277deg / 50%)")).toEqual({ l: 0.57, c: 0.2, h: 277, alpha: 0.5 });
    expect(parseColor("OKLCH(0.9 0 -30)")?.h).toBe(330);
  });

  test("hex and rgb round-trip through OKLCH", () => {
    for (const hex of ["#ff0000", "#00ff00", "#0000ff", "#7f7f7f", "#123456", "#ffffff", "#000000"]) {
      const c = parseColor(hex);
      expect(c).not.toBeNull();
      if (c) expect(oklchToHex(c)).toBe(hex);
    }
    expect(parseColor("#f00")).toEqual(parseColor("#ff0000"));
    expect(parseColor("rgb(255 0 0 / 0.5)")?.alpha).toBe(0.5);
  });

  test("known reference: sRGB red ≈ oklch(0.628 0.258 29.2)", () => {
    const red = parseColor("#ff0000");
    expect(red?.l).toBeCloseTo(0.628, 3);
    expect(red?.c).toBeCloseTo(0.258, 3);
    expect(red?.h).toBeCloseTo(29.23, 1);
  });

  test("garbage is null", () => {
    expect(parseColor("blue-ish")).toBeNull();
    expect(parseColor("#12")).toBeNull();
  });
});

describe("formatOklch / gamut", () => {
  test("rounds and adds alpha only when translucent; greys print hue 0", () => {
    expect(formatOklch({ l: 0.56789, c: 0.20012, h: 276.96, alpha: 1 })).toBe("oklch(0.568 0.2 277)");
    expect(formatOklch({ l: 0.5, c: 0, h: 120, alpha: 0.25 })).toBe("oklch(0.5 0 0 / 0.25)");
  });

  test("sRGB gamut edge", () => {
    expect(inSrgbGamut({ l: 0.57, c: 0.2, h: 277 })).toBe(true);
    expect(inSrgbGamut({ l: 0.9, c: 0.3, h: 277 })).toBe(false);
  });
});
