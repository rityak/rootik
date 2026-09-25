import { describe, expect, test } from "bun:test";
import { jsonPath } from "./json-view";

describe("jsonPath", () => {
  test("identifiers use dots, indices and odd keys use brackets", () => {
    expect(jsonPath([])).toBe("$");
    expect(jsonPath(["config", "layers", 2, "dropout rate"])).toBe('$.config.layers[2]["dropout rate"]');
    expect(jsonPath(["$ref", "_id", "2d"])).toBe('$.$ref._id["2d"]');
  });
});
