import { expect, test } from "bun:test";
import { niceTicks } from "./components/charts";
import { pageRange } from "./components/nav";
import { APPEARANCE_SECTIONS, defaultValues, toCssVars } from "./theme/schema";

test("niceTicks covers the range with round steps", () => {
  expect(niceTicks(0, 2140)).toEqual([0, 1000, 2000, 3000]);
  expect(niceTicks(0.35, 0.9)).toEqual([0.2, 0.4, 0.6, 0.8, 1]);
  expect(niceTicks(5, 5)).toEqual([5, 5.25, 5.5, 5.75, 6]);
});

test("pageRange keeps ends, neighbours and fills single gaps", () => {
  expect(pageRange(1, 1, 1)).toEqual([1]);
  expect(pageRange(4, 12, 1)).toEqual([1, 2, 3, 4, 5, "…", 12]);
  expect(pageRange(8, 12, 1)).toEqual([1, "…", 7, 8, 9, "…", 12]);
});

test("appearance schema maps values to CSS vars", () => {
  const values = {
    ...defaultValues(APPEARANCE_SECTIONS),
    pill: true,
    radius: 20,
    density: "compact",
    motion: "system",
  };
  const vars = toCssVars(APPEARANCE_SECTIONS, values);
  expect(vars["--rk-radius"]).toBe("20px");
  expect(vars["--rk-radius-control"]).toBe("999px");
  expect(vars["--rk-density"]).toBe("0.86");
  expect(vars["--rk-motion"]).toBeNull();
  expect(vars["--rk-font-size"]).toBe("13px");
});

test("square corners zero every radius, pill included", () => {
  const values = { ...defaultValues(APPEARANCE_SECTIONS), pill: true, radius: 20, corners: "square" };
  const vars = toCssVars(APPEARANCE_SECTIONS, values);
  expect(vars["--rk-radius"]).toBe("0px");
  expect(vars["--rk-radius-control"]).toBe("0px");
  expect(vars["--rk-roundness"]).toBe("0");
});
