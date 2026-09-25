import { expect, test } from "bun:test";
import { formatBitrate, formatBytes, formatDuration, formatNumber, formatPercent } from "./format";

const en = { locale: "en-US" };

test("formatBytes scales by 1024 and keeps one digit below 10", () => {
  expect(formatBytes(0, en)).toMatchObject({ value: "0", unit: "B" });
  expect(formatBytes(512, en)).toMatchObject({ value: "512", unit: "B" });
  expect(formatBytes(1536, en)).toMatchObject({ value: "1.5", unit: "KB" });
  expect(formatBytes(250 * 1024 ** 2, en)).toMatchObject({ value: "250", unit: "MB" });
  expect(formatBytes(1.2e9, { ...en, base: 1000, per: "s" }).text).toBe("1.2 GB/s");
});

test("formatBitrate uses decimal network units", () => {
  expect(formatBitrate(940e6, en)).toMatchObject({ value: "940", unit: "Mbps" });
  expect(formatBitrate(1500, en)).toMatchObject({ value: "1.5", unit: "Kbps" });
});

test("formatNumber splits the compact suffix", () => {
  expect(formatNumber(1284, en)).toMatchObject({ value: "1,284", unit: "" });
  expect(formatNumber(1234, { ...en, compact: true })).toMatchObject({
    value: "1.2",
    unit: "K",
    text: "1.2K",
  });
});

test("formatPercent", () => {
  expect(formatPercent(0.425, en).text).toBe("43%");
  expect(formatPercent(0.0425, en).text).toBe("4.3%");
  expect(formatPercent(0.425, { ...en, digits: 1 }).text).toBe("42.5%");
});

test("formatDuration styles", () => {
  expect(formatDuration(320, en).text).toBe("320 ms");
  expect(formatDuration(45_000, en).text).toBe("45s");
  expect(formatDuration(3_723_000, en).text).toBe("1h 2m");
  expect(formatDuration(3_600_000, en).text).toBe("1h");
  expect(formatDuration(3_723_000, { ...en, style: "clock" }).text).toBe("1:02:03");
  expect(formatDuration(123_000, { ...en, style: "clock" }).text).toBe("2:03");
  expect(formatDuration(5_400_000, { ...en, style: "compact" })).toMatchObject({ value: "1.5", unit: "h" });
});
