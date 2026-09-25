import { describe, expect, test } from "bun:test";
import { filterLog, formatLogTime, type LogLine, parseLogQuery } from "./log-view";

const LINES: LogLine[] = [
  { level: "info", source: "trainer", message: "epoch 1/10 started" },
  { level: "debug", source: "loader", message: "batch 1 of 250" },
  { level: "warn", source: "trainer", message: "loss spiked to 3.21" },
  { level: "error", source: "cuda", message: "out of memory (tried 2.00 GiB)" },
  { message: "plain stdout line" },
];

describe("parseLogQuery", () => {
  test("empty query matches everything", () => {
    expect(parseLogQuery("  ")).toBeNull();
  });

  test("plain text is a case-insensitive literal", () => {
    const q = parseLogQuery("GiB)");
    expect(q?.flags).toContain("i");
    expect(filterLog(LINES, null, q)).toEqual([3]);
  });

  test("/regex/flags is a pattern; an unfinished one searches literally", () => {
    expect(filterLog(LINES, null, parseLogQuery("/epoch \\d+/"))).toEqual([0]);
    expect(filterLog(LINES, null, parseLogQuery("/(unclosed/"))).toEqual([]);
  });
});

describe("filterLog", () => {
  test("levels filter, unlevelled lines always pass", () => {
    expect(filterLog(LINES, ["warn", "error"], null)).toEqual([2, 3, 4]);
  });

  test("the source is searched too, and the global regex is reused safely", () => {
    const q = parseLogQuery("trainer");
    expect(filterLog(LINES, null, q)).toEqual([0, 2]);
    expect(filterLog(LINES, null, q)).toEqual([0, 2]);
  });
});

describe("formatLogTime", () => {
  test("pads to HH:MM:SS.mmm and passes strings through", () => {
    expect(formatLogTime(new Date(2026, 0, 2, 3, 4, 5, 6))).toBe("03:04:05.006");
    expect(formatLogTime("12:00")).toBe("12:00");
    expect(formatLogTime(undefined)).toBe("");
  });
});
