import { expect, test } from "bun:test";
import { oklchToLinearRgb, parseColor } from "../lib/color";
import { svgPalettes, svgPaletteVars } from "./svg-palettes";

const luminance = (css: string) => {
  const color = parseColor(css);
  if (!color) throw new Error(`Invalid palette color: ${css}`);
  const [r = 0, g = 0, b = 0] = oklchToLinearRgb(color).map((value) => Math.max(0, Math.min(1, value)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) =>
  (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);

test("curated palette labels, fields, focus and error states retain contrast in both modes", () => {
  for (const palette of svgPalettes) {
    for (const mode of ["light", "dark"] as const) {
      const vars = svgPaletteVars(palette, mode);
      const value = (key: string) => {
        const color = vars[key];
        if (!color) throw new Error(`Missing ${palette.id}/${mode}/${key}`);
        return color;
      };
      const action = parseColor(value("--rk-accent"));
      if (!action) throw new Error("Invalid action color");
      const hover = `oklch(${action.l - 0.035} ${action.c} ${action.h})`;
      for (const fill of [value("--rk-accent"), hover]) {
        expect(contrast(value("--rk-on-accent"), fill)).toBeGreaterThanOrEqual(4.5);
      }
      for (const surface of ["--rk-bg", "--rk-surface-1", "--rk-surface-2", "--rk-well"]) {
        for (const text of [
          "--rk-text",
          "--rk-text-2",
          "--rk-text-3",
          "--rk-accent-text",
          "--rx-secondary",
          "--rx-detail",
          "--rk-danger",
        ]) {
          expect(contrast(value(text), value(surface))).toBeGreaterThanOrEqual(4.5);
        }
        expect(contrast(value("--rk-control-edge"), value(surface))).toBeGreaterThanOrEqual(3);
      }
      expect(contrast(value("--rk-inverse"), value("--rk-on-inverse"))).toBeGreaterThanOrEqual(4.5);
    }
  }
});

test("palette material families remain distinct, including achromatic Albedo and rose Makima", () => {
  expect(svgPalettes.map((palette) => palette.id)).toEqual([
    "cobalt",
    "albedo",
    "makima",
    "miyabi",
    "hoshino",
    "maomao",
  ]);
  for (const mode of ["light", "dark"] as const) {
    const surfaces = svgPalettes.map((palette) => palette[mode].surface.join(" "));
    expect(new Set(surfaces).size).toBe(svgPalettes.length);
  }
  const albedo = svgPalettes.find((palette) => palette.id === "albedo");
  const makima = svgPalettes.find((palette) => palette.id === "makima");
  expect(albedo?.light.surface[1]).toBeLessThanOrEqual(0.003);
  expect(makima?.light.surface[2]).toBe(355);
});

test("the page canvas remains neutral and identical across palettes", () => {
  for (const mode of ["light", "dark"] as const) {
    const backgrounds = svgPalettes.map((palette) => svgPaletteVars(palette, mode)["--rk-bg"]);
    expect(new Set(backgrounds).size).toBe(1);
    const color = parseColor(backgrounds[0] ?? "");
    expect(color?.c).toBeLessThanOrEqual(0.001);
  }
});
