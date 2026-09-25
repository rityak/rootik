import { expect, test } from "bun:test";
import { formatRelativeTime } from "./relative-time";

const now = Date.UTC(2026, 8, 25, 12, 0, 0);
const en = { now, locale: "en-US" };

test("formatRelativeTime picks the largest fitting unit", () => {
  expect(formatRelativeTime(now - 3000, en)).toBe("now");
  expect(formatRelativeTime(now - 42_000, en)).toBe("42 seconds ago");
  expect(formatRelativeTime(now - 5 * 60_000, en)).toBe("5 minutes ago");
  expect(formatRelativeTime(now + 2 * 3_600_000, en)).toBe("in 2 hours");
  expect(formatRelativeTime(now - 86_400_000, en)).toBe("yesterday");
  expect(formatRelativeTime(now - 90 * 86_400_000, { ...en, style: "short" })).toBe("3 mo. ago");
});
