import { describe, expect, test } from "bun:test";
import { dataStatus } from "./data-state";

describe("dataStatus", () => {
  test("loading wins over error, error over empty", () => {
    expect(dataStatus({ loading: true, error: new Error("x"), empty: true })).toBe("loading");
    expect(dataStatus({ error: "boom", empty: true })).toBe("error");
    expect(dataStatus({ empty: true })).toBe("empty");
    expect(dataStatus({})).toBe("ready");
  });

  test("null / false errors don't count", () => {
    expect(dataStatus({ error: null })).toBe("ready");
    expect(dataStatus({ error: false, empty: true })).toBe("empty");
  });
});
