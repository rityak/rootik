import { expect, test } from "bun:test";
import { scopeVars } from "./provider";
import { APPEARANCE_SECTIONS, defaultValues } from "./schema";

test("scopeVars returns only the vars an override changes", () => {
  const base = defaultValues(APPEARANCE_SECTIONS);
  expect(scopeVars(APPEARANCE_SECTIONS, base, { density: "compact" })).toEqual({ "--rk-density": "0.86" });
  expect(scopeVars(APPEARANCE_SECTIONS, base, {})).toEqual({});
});
