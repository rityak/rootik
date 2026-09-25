import { expect, test } from "bun:test";
import { niceTicks } from "./components/charts";
import { pageRange } from "./components/nav";
import { APPEARANCE_SECTIONS, defaultValues, type SettingsSection, toCssVars } from "./theme/schema";

test("niceTicks handles negative and tiny ranges", () => {
  expect(niceTicks(-120, 80)).toEqual([-150, -100, -50, 0, 50, 100]);
  const tiny = niceTicks(0.001, 0.004);
  expect(tiny[0]).toBeLessThanOrEqual(0.001);
  expect(tiny.at(-1)).toBeGreaterThanOrEqual(0.004);
});

test("pageRange at the ends and with wider siblings", () => {
  expect(pageRange(1, 12, 1)).toEqual([1, 2, "…", 12]);
  expect(pageRange(12, 12, 1)).toEqual([1, "…", 11, 12]);
  expect(pageRange(6, 12, 2)).toEqual([1, "…", 4, 5, 6, 7, 8, "…", 12]);
  expect(pageRange(3, 5, 1)).toEqual([1, 2, 3, 4, 5]);
});

test("toCssVars: every default maps to a string or null, extensions use cssVar + unit", () => {
  const vars = toCssVars(APPEARANCE_SECTIONS, defaultValues(APPEARANCE_SECTIONS));
  for (const value of Object.values(vars)) expect(value === null || typeof value === "string").toBe(true);

  const extension: SettingsSection = {
    id: "editor",
    title: "Editor",
    fields: [
      {
        key: "editor.size",
        type: "slider",
        label: "Size",
        default: 14,
        min: 10,
        max: 20,
        cssVar: "--editor-size",
        unit: "px",
      },
      { key: "editor.wrap", type: "toggle", label: "Wrap", default: true, cssVar: "--editor-wrap" },
    ],
  };
  const out = toCssVars([extension], { "editor.size": 16 });
  expect(out).toEqual({ "--editor-size": "16px", "--editor-wrap": "true" });
});
