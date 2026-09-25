import { expect, test } from "bun:test";
import { nextSelection } from "./selection";

const keys = ["a", "b", "c", "d", "e"];

test("plain activation selects one key, toggle flips it", () => {
  expect(nextSelection(["a", "b"], keys, "c", {}, "multiple", "a")).toEqual(["c"]);
  expect(nextSelection(["a"], keys, "c", { toggle: true }, "multiple", "a")).toEqual(["a", "c"]);
  expect(nextSelection(["a", "c"], keys, "c", { toggle: true }, "multiple", "a")).toEqual(["a"]);
});

test("range follows key order from the anchor", () => {
  expect(nextSelection(["b"], keys, "d", { range: true }, "multiple", "b")).toEqual(["b", "c", "d"]);
  expect(nextSelection(["d"], keys, "b", { range: true }, "multiple", "d")).toEqual(["b", "c", "d"]);
  expect(nextSelection(["a"], keys, "e", { range: true, toggle: true }, "multiple", "d")).toEqual([
    "a",
    "d",
    "e",
  ]);
});

test("single mode keeps one key; toggle on it clears", () => {
  expect(nextSelection(["a"], keys, "b", { toggle: true }, "single", "a")).toEqual(["b"]);
  expect(nextSelection(["b"], keys, "b", { toggle: true }, "single", "b")).toEqual([]);
});
