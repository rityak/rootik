import { expect, test } from "bun:test";
import { scopeVars } from "./provider";
import { APPEARANCE_SECTIONS, defaultValues, materialVars, toCssVars, toDataAttrs } from "./schema";

test("scopeVars returns only the vars an override changes", () => {
  const base = defaultValues(APPEARANCE_SECTIONS);
  expect(scopeVars(APPEARANCE_SECTIONS, base, { density: "compact" })).toEqual({ "--rk-density": "0.86" });
  expect(scopeVars(APPEARANCE_SECTIONS, base, {})).toEqual({});
});

test("tuning knobs at defaults keep the designed materials; Fluent goes solid and flags the root", () => {
  const base = defaultValues(APPEARANCE_SECTIONS);
  const vars = toCssVars(APPEARANCE_SECTIONS, base);
  expect(vars["--rk-surface-alpha"]).toBe("80%");
  expect(vars["--rk-surface-filter"]).toBe("blur(10px) saturate(1.25)");
  expect(vars["--rk-ambient"]).toContain("var(--rk-accent) 14%");
  expect(vars["--rk-glass"]).toBe("1");
  expect(vars["--rk-shell-space"]).toBeNull();
  expect(vars["--rk-backdrop"]).toBeNull();
  expect(toDataAttrs(APPEARANCE_SECTIONS, base)).toEqual({
    "data-rk-style": "rootik",
    "data-rk-palette": "legacy",
  });

  const fluent = scopeVars(APPEARANCE_SECTIONS, base, { style: "fluent" });
  expect(fluent["--rk-radius"]).toBe("4px");
  expect(fluent["--rk-glass"]).toBe("0");
  expect(toCssVars(APPEARANCE_SECTIONS, { ...base, style: "fluent" })["--rk-surface-alpha"]).toBeNull();

  const tuned = toCssVars(APPEARANCE_SECTIONS, { ...base, glow: "off", "material.transparency": 0 });
  expect(tuned["--rk-ambient"]).toBeNull();
  expect(tuned["--rk-surface-alpha"]).toBe("100%");
  expect(
    materialVars("frost", { glow: "custom", glowColor: "red", glowStrength: 50 })["--rk-ambient"],
  ).toContain("red 12%");
  expect(toCssVars(APPEARANCE_SECTIONS, { ...base, backdrop: 'a"b.png' })["--rk-backdrop"]).toContain(
    'url("a\\"b.png")',
  );
});
