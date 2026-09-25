import { expect, test } from "bun:test";
import { acceptsFile } from "./file-drop";

const png = { name: "Cat.PNG", type: "image/png" };
const zip = { name: "set.zip", type: "application/zip" };

test("acceptsFile matches extensions, MIME wildcards and exact types", () => {
  expect(acceptsFile(png, undefined)).toBe(true);
  expect(acceptsFile(png, ".png")).toBe(true);
  expect(acceptsFile(png, "image/*")).toBe(true);
  expect(acceptsFile(zip, "image/*, .zip")).toBe(true);
  expect(acceptsFile(zip, "image/*")).toBe(false);
  expect(acceptsFile(zip, "application/zip")).toBe(true);
});
