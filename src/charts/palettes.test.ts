import { expect, test } from "bun:test";
import { oklchToLinearRgb, parseColor } from "../lib/color";
import { SIGNAL_PALETTES, signalPaletteVars } from "../theme/palettes";

const luminance = (css: string) => {
  const c = parseColor(css);
  if (!c) throw new Error(css);
  const [r = 0, g = 0, b = 0] = oklchToLinearRgb(c).map((v) => Math.max(0, Math.min(1, v)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
test("chart slots separate marks from every named material and keep readable labels", () => {
  for (const palette of SIGNAL_PALETTES)
    for (const mode of ["light", "dark"] as const) {
      const vars = signalPaletteVars(palette, mode);
      const value = (key: string) => vars[key] ?? "";
      for (let i = 1; i <= 6; i++) {
        const color = value(`--rk-chart-${i}`);
        const parsed = parseColor(color);
        expect(parsed).not.toBeNull();
        if (mode === "dark") {
          expect(parsed?.l).toBeGreaterThanOrEqual(0.48);
          expect(parsed?.l).toBeLessThanOrEqual(0.67);
        }
        for (const surface of ["--rk-bg", "--rk-surface-1", "--rk-surface-2", "--rk-well"])
          expect(contrast(color, value(surface))).toBeGreaterThanOrEqual(3);
        expect(contrast(color, value("--rk-chart-on-fill"))).toBeGreaterThanOrEqual(4.5);
      }
      for (let step = 0; step <= 100; step++) {
        const share = step / 100;
        const l = 0.26 + (0.86 - 0.26) * share,
          c = 0.035 + (0.12 - 0.035) * share;
        expect(
          contrast(
            `oklch(${l} ${c} 250)`,
            value(share > 0.5 ? "--rk-chart-seq-text-hi" : "--rk-chart-seq-text-lo"),
          ),
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
});
