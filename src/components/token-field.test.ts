import { expect, test } from "bun:test";
import { splitTokens } from "./token-field";

test("splitTokens trims and drops empties", () => {
  expect(splitTokens("a, b,, c")).toEqual(["a", "b", "c"]);
  expect(splitTokens("long hair\nblue eyes\n")).toEqual(["long hair", "blue eyes"]);
  expect(splitTokens("  ")).toEqual([]);
});
