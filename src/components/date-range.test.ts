import { expect, test } from "bun:test";
import { resolveRange, toLocalInput } from "./date-range";

const presets = [{ id: "1h", label: "1h", ms: 3_600_000 }];

test("resolveRange rejects reversed, nonfinite and invalid preset bounds", () => {
  expect(resolveRange({ from: "2026-10-10T18:00", to: "2026-10-09T18:00" }, presets)).toBeNull();
  for (const ms of [-1, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_VALUE])
    expect(resolveRange({ preset: "bad" }, [{ id: "bad", label: "Bad", ms }])).toBeNull();
  expect(resolveRange({ preset: "1h" }, presets, Number.NaN)).toBeNull();
});

test("resolveRange: presets end at now, custom ranges parse, bad input is null", () => {
  expect(resolveRange({ preset: "1h" }, presets, 10_000_000)).toEqual({
    from: new Date(6_400_000),
    to: new Date(10_000_000),
  });
  const d = new Date(2026, 8, 25, 14, 30);
  expect(toLocalInput(d)).toBe("2026-09-25T14:30");
  expect(resolveRange({ from: toLocalInput(d), to: toLocalInput(d) }, presets)?.from.getTime()).toBe(
    d.getTime(),
  );
  expect(resolveRange({ from: "nope", to: "" }, presets)).toBeNull();
  expect(resolveRange({ preset: "missing" }, presets)).toBeNull();
});
