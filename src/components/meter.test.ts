import { expect, test } from "bun:test";
import { meterTone } from "./meter";

test("meterTone follows the <meter> optimum regions", () => {
  // disk: lower is better, warn above 70, danger above 90
  const disk = { low: 70, high: 90, optimum: 0 };
  expect(meterTone(40, disk)).toBe("success");
  expect(meterTone(80, disk)).toBe("warn");
  expect(meterTone(95, disk)).toBe("danger");
  // battery: higher is better
  const battery = { low: 20, high: 60, optimum: 100 };
  expect(meterTone(80, battery)).toBe("success");
  expect(meterTone(40, battery)).toBe("warn");
  expect(meterTone(10, battery)).toBe("danger");
  // optimum in the middle: both sides warn
  expect(meterTone(50, { low: 30, high: 70 })).toBe("success");
  expect(meterTone(90, { low: 30, high: 70 })).toBe("warn");
  // no thresholds
  expect(meterTone(50, {})).toBe("accent");
});
