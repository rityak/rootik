import { expect, test } from "bun:test";
import { clampNumber, parseNumber } from "./number-input";

test("scientific steps preserve small values and invalid precision never throws", () => {
  expect(clampNumber(2e-7, { step: 1e-7 })).toBe(2e-7);
  expect(clampNumber(2.25e-7, { step: 2.5e-8 })).toBe(2.25e-7);
  expect(clampNumber(123, { step: 1e3 })).toBe(123);
  expect(() => clampNumber(1, { precision: 1000 })).not.toThrow();
  expect(() => clampNumber(1, { precision: Number.NaN })).not.toThrow();
});

test("clampNumber clamps and rounds to the step's decimals", () => {
  expect(clampNumber(0.1 + 0.2, { step: 0.1 })).toBe(0.3);
  expect(clampNumber(150, { min: 0, max: 100 })).toBe(100);
  expect(clampNumber(-3, { min: 0 })).toBe(0);
  expect(clampNumber(1.23456, { step: 0.01 })).toBe(1.23);
  expect(clampNumber(1.23456, { precision: 3 })).toBe(1.235);
});

test("parseNumber accepts comma decimals and spaces", () => {
  expect(parseNumber(" 1,5 ")).toBe(1.5);
  expect(parseNumber("12 000")).toBe(12000);
  expect(parseNumber("abc")).toBeNaN();
});
