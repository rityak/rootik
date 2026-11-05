import { expect, test } from "bun:test";
import {
  APPEARANCE_SECTIONS,
  defaultValues,
  normalizeAppearanceValues,
  toCssVars,
  toDataAttrs,
} from "../theme/schema";

test("motion recipes are opt-in, validated, scoped and disabled with motion or Fluent", () => {
  const defaults = defaultValues(APPEARANCE_SECTIONS);
  expect(defaults.effects).toBe("off");
  for (const effects of ["off", "subtle", "expressive"] as const) {
    const values = { ...defaults, effects };
    const vars = toCssVars(APPEARANCE_SECTIONS, values);
    expect(toDataAttrs(APPEARANCE_SECTIONS, values)["data-rk-effects"]).toBe(effects);
    expect(vars["--rk-effects-strength"]).toBe(
      effects === "off" ? "0" : effects === "subtle" ? "0.14" : "0.3",
    );
    expect(vars["--rk-switch-animation"]).toBe(effects === "off" ? "none" : "rk-switch-light");
  }
  for (const overrides of [{ motion: "off" }, { style: "fluent" }] as const) {
    expect(
      toCssVars(APPEARANCE_SECTIONS, { ...defaults, effects: "expressive", ...overrides })[
        "--rk-switch-animation"
      ],
    ).toBe("none");
  }
  expect(
    normalizeAppearanceValues(APPEARANCE_SECTIONS, {
      effects: "unknown",
      effectStyle: "noise",
      themeTransition: "spin",
    }),
  ).toEqual({});
});
