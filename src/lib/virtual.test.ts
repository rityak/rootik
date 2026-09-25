import { expect, test } from "bun:test";
import { prefixOffsets, virtualRange } from "./virtual";

test("fixed-size range covers the viewport plus overscan", () => {
  // rows of 20px, viewport 100px scrolled to 200px: rows 10..14 visible
  expect(virtualRange(1000, 20, 200, 100, 0)).toEqual([10, 14]);
  expect(virtualRange(1000, 20, 200, 100, 3)).toEqual([7, 17]);
  expect(virtualRange(12, 20, 0, 100, 5)).toEqual([0, 9]);
  expect(virtualRange(0, 20, 0, 100, 5)).toEqual([0, -1]);
});

test("per-index sizes use offsets", () => {
  const offsets = prefixOffsets(5, (i) => (i + 1) * 10); // 10,20,30,40,50 → 0,10,30,60,100,150
  expect(offsets).toEqual([0, 10, 30, 60, 100, 150]);
  expect(virtualRange(5, offsets, 35, 30, 0)).toEqual([2, 3]);
  expect(virtualRange(5, offsets, 0, 5, 1)).toEqual([0, 1]);
});
