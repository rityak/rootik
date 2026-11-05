import { expect, test } from "bun:test";
import { SIGNAL_PALETTES, signalPaletteVars } from "./palettes";
import {
  APPEARANCE_SECTIONS,
  defaultValues,
  normalizeAppearanceValues,
  THEMES,
  toCssVars,
  toDataAttrs,
} from "./schema";

test("named Signal themes share production recipes and leave palette colors to scoped CSS", () => {
  const base = defaultValues(APPEARANCE_SECTIONS);
  for (const palette of SIGNAL_PALETTES) {
    const values = { ...base, ...THEMES[palette.id], colorMode: "light" as const };
    const vars = toCssVars(APPEARANCE_SECTIONS, values);
    expect(vars["--rk-accent"]).toBeUndefined();
    expect(vars["--rk-neutral-h"]).toBeUndefined();
    expect(vars["--rk-ambient"]).toBeNull();
    expect(toDataAttrs(APPEARANCE_SECTIONS, values)["data-rk-mode"]).toBe("light");
    expect(toDataAttrs(APPEARANCE_SECTIONS, values)["data-rk-palette"]).toBe(palette.id);
    for (const mode of ["light", "dark"] as const) {
      expect(Object.keys(signalPaletteVars(palette, mode)).every((key) => key.startsWith("--rk-"))).toBe(
        true,
      );
    }
  }
  const fonts = toCssVars(APPEARANCE_SECTIONS, {
    ...base,
    font: "rubik",
    monoFont: "jetbrains",
    displayFont: "literata",
  });
  expect(fonts["--rk-font-sans"]).toContain("Rubik Variable");
  expect(fonts["--rk-font-mono"]).toContain("JetBrains Mono Variable");
  expect(fonts["--rk-font-display"]).toContain("Literata Variable");
  expect(
    normalizeAppearanceValues(APPEARANCE_SECTIONS, { palette: "unknown", colorMode: "sepia", font: "bad" }),
  ).toEqual({});
  expect(toCssVars(APPEARANCE_SECTIONS, base)["--rk-accent"]).toBeString();
});

test("square and Fluent appearance disable every radius, including pill controls", () => {
  const base = defaultValues(APPEARANCE_SECTIONS);
  for (const overrides of [{ radius: 0, pill: true }, { corners: "square" }, { style: "fluent" }] as const) {
    const vars = toCssVars(APPEARANCE_SECTIONS, { ...base, ...overrides });
    expect(vars["--rk-radius"]).toBe("0px");
    expect(vars["--rk-radius-control"]).toBe("0px");
    expect(vars["--rk-roundness"]).toBe("0");
  }
  expect(THEMES.fluent.svgShapes).toBe(false);
  expect(THEMES.fluent.corners).toBe("square");
});
