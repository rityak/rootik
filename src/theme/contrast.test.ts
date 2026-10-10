import { expect, test } from "bun:test";
import { inSrgbGamut, type Oklch, oklchToLinearRgb, parseColor } from "../lib/color";
import { ACCENTS, APPEARANCE_SECTIONS, THEMES, toCssVars } from "./schema";

function luminance(color: Oklch) {
  const [r, g, b] = oklchToLinearRgb(color).map((channel) => Math.max(0, Math.min(1, channel))) as [
    number,
    number,
    number,
  ];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a: number, b: number) {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test("opaque accent presets and in-gamut custom colors retain AA labels at rest and hover", () => {
  const colors: string[] = [...ACCENTS.map((accent) => accent.value), THEMES.rain.accent];
  for (let hue = 0; hue < 360; hue += 30)
    for (let lightness = 0.1; lightness < 1; lightness += 0.05) {
      const color = { l: lightness, c: 0.1, h: hue, alpha: 1 };
      if (inSrgbGamut(color)) colors.push(`oklch(${lightness} 0.1 ${hue})`);
    }
  for (const accent of colors) {
    const color = parseColor(accent);
    if (!color) throw new Error(`Invalid preset ${accent}`);
    for (const palette of ["legacy", "rain"] as const) {
      const vars = toCssVars(APPEARANCE_SECTIONS, { accent, palette });
      for (const [key, l] of [
        ["--rk-accent-label", color.l],
        ["--rk-accent-hover-label", Math.max(0, color.l - (palette === "rain" ? 0.01 : 0.02))],
      ] as const) {
        const foreground = vars[key] === "var(--rk-label-light)" ? 1 : 0.08 ** 3;
        expect(ratio(luminance({ ...color, l }), foreground)).toBeGreaterThanOrEqual(4.5);
      }
    }
  }
});

test("muted text and opaque Rain boundaries meet contrast on the brightest solid surface", () => {
  const neutrals = APPEARANCE_SECTIONS.flatMap((section) => section.fields).find(
    (field) => field.key === "neutral",
  );
  if (neutrals?.type !== "select") throw new Error("Missing neutral options");
  for (const { value: neutral } of neutrals.options) {
    const vars = toCssVars(APPEARANCE_SECTIONS, { neutral });
    const h = Number(vars["--rk-neutral-h"]),
      c = Number(vars["--rk-neutral-c"]);
    const surface = luminance({ l: 0.325, c: c * 1.83, h, alpha: 1 });
    expect(ratio(surface, luminance({ l: 0.7, c: c * 2.8, h, alpha: 1 }))).toBeGreaterThanOrEqual(4.5);
    expect(ratio(surface, luminance({ l: 0.62, c: c * 1.67, h, alpha: 1 }))).toBeGreaterThanOrEqual(3);
  }
});
