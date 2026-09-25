import { describe, expect, test } from "bun:test";
import { gridColumns } from "./image-grid";

describe("gridColumns", () => {
  test("fits as many min-size columns as the width allows, gaps included", () => {
    expect(gridColumns(900, 160, 8)).toBe(5); // 5×160 + 4×8 = 832 ≤ 900; 6 would need 1000
    expect(gridColumns(1000, 160, 8)).toBe(6); // exactly 6×160 + 5×8
    expect(gridColumns(999, 160, 8)).toBe(5);
  });

  test("never below one column (unmeasured or narrow)", () => {
    expect(gridColumns(0, 160, 0)).toBe(1);
    expect(gridColumns(100, 160, 8)).toBe(1);
  });
});
