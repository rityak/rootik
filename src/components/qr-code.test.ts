import { describe, expect, test } from "bun:test";
import { encodeQr, qrPath } from "./qr-code";

const rows = (m: boolean[][]) => m.map((r) => r.map((b) => (b ? "1" : "0")).join(""));

describe("encodeQr", () => {
  test("picks the smallest version for the data and level", () => {
    expect(encodeQr("hello", "M").length).toBe(21); // v1
    expect(encodeQr("https://example.com/", "L").length).toBe(25); // v2
    expect(encodeQr("x".repeat(300), "H").length).toBe(89); // v18
    expect(() => encodeQr("x".repeat(3000), "H")).toThrow(RangeError);
  });

  test("function patterns: finders, timing, dark module", () => {
    const m = encodeQr("rootik", "Q");
    const n = m.length;
    const finder = ["1111111", "1000001", "1011101", "1011101", "1011101", "1000001", "1111111"];
    const at = (x0: number, y0: number) => finder.map((_, y) => rows(m)[y0 + y]?.slice(x0, x0 + 7));
    expect(at(0, 0)).toEqual(finder);
    expect(at(n - 7, 0)).toEqual(finder);
    expect(at(0, n - 7)).toEqual(finder);
    for (let i = 8; i < n - 8; i++) {
      expect(m[6]?.[i]).toBe(i % 2 === 0);
      expect(m[i]?.[6]).toBe(i % 2 === 0);
    }
    expect(m[n - 8]?.[8]).toBe(true);
  });

  // matrix verified by decoding with jsQR (see the PR); pins the encoder, masks and format bits
  test("golden: hello / M", () => {
    expect(rows(encodeQr("hello", "M"))).toEqual([
      "111111100110001111111",
      "100000100110001000001",
      "101110100100101011101",
      "101110100011001011101",
      "101110100110101011101",
      "100000101001101000001",
      "111111101010101111111",
      "000000000001100000000",
      "100101101100010100000",
      "001011000010001000011",
      "000110111100110001101",
      "111011001001000001011",
      "011010110010101010000",
      "000000001101000110101",
      "111111100010010101110",
      "100000101011110110000",
      "101110100001001110001",
      "101110101101000101111",
      "101110100110100010101",
      "100000100110011000000",
      "111111101111100101010",
    ]);
  });
});

describe("qrPath", () => {
  test("merges horizontal runs and offsets by the quiet zone", () => {
    expect(qrPath([[true, true, false, true]], 1)).toBe("M1 1h2v1h-2zM4 1h1v1h-1z");
  });
});
