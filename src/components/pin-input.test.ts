import { describe, expect, test } from "bun:test";
import { sanitizePin } from "./pin-input";

describe("sanitizePin", () => {
  test("numeric keeps digits only, up to the length", () => {
    expect(sanitizePin("12-34 56 78", "numeric", 6)).toBe("123456");
    expect(sanitizePin("Your code: 481 204.", "numeric", 6)).toBe("481204");
  });

  test("alphanumeric keeps letters and digits", () => {
    expect(sanitizePin("ab-12_cd", "alphanumeric", 8)).toBe("ab12cd");
    expect(sanitizePin("ÄB1", "alphanumeric", 4)).toBe("B1");
  });
});
