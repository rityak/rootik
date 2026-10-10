import { expect, test } from "bun:test";
import { mergeRefs } from "./hooks";

test("merged React 19 refs run cleanup instead of null for cleanup refs", () => {
  const events: string[] = [];
  const object = { current: null as string | null };
  const merged = mergeRefs<string>(
    (node) => {
      events.push(`cleanup-ref:${node}`);
      return () => {
        events.push("disconnect");
      };
    },
    (node) => {
      events.push(`legacy-ref:${node}`);
    },
    object,
  );
  const cleanup = merged("mounted");
  expect(object.current).toBe("mounted");
  if (typeof cleanup !== "function") throw new Error("Expected composed ref cleanup");
  cleanup();
  expect(object.current).toBeNull();
  expect(events).toEqual(["cleanup-ref:mounted", "legacy-ref:mounted", "disconnect", "legacy-ref:null"]);
  const second = merged("remounted");
  if (typeof second === "function") second();
  expect(events.filter((event) => event === "disconnect")).toHaveLength(2);
});
