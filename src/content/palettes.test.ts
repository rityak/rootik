import { expect, test } from "bun:test";
import { oklchToLinearRgb, parseColor } from "../lib/color";
import { SIGNAL_PALETTES, signalPaletteVars } from "../theme/palettes";

const luminance = (css: string) => {
  const color = parseColor(css);
  if (!color) throw new Error(css);
  const [r = 0, g = 0, b = 0] = oklchToLinearRgb(color).map((v) => Math.max(0, Math.min(1, v)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) =>
  (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
test("content syntax keeps text contrast and QR polarity is independent of theme", () => {
  for (const palette of SIGNAL_PALETTES)
    for (const mode of ["light", "dark"] as const) {
      const vars = signalPaletteVars(palette, mode);
      for (const token of ["--rk-syntax-string", "--rk-syntax-number", "--rk-syntax-boolean"])
        for (const bg of ["--rk-bg", "--rk-surface-1", "--rk-surface-2", "--rk-well"])
          expect(contrast(vars[token] ?? "", vars[bg] ?? "")).toBeGreaterThanOrEqual(4.5);
      expect(luminance(vars["--rk-qr-plate"] ?? "")).toBeGreaterThan(0.95);
      expect(luminance(vars["--rk-qr-ink"] ?? "")).toBeLessThan(0.01);
      expect(contrast(vars["--rk-qr-plate"] ?? "", vars["--rk-qr-ink"] ?? "")).toBeGreaterThan(15);
    }
});
