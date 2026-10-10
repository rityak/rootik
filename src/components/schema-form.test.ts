import { describe, expect, test } from "bun:test";
import { LABELS } from "../lib/labels";
import { defaultSchemaValues, type Schema, validateSchema } from "./schema-form";

const SCHEMA: Schema = [
  {
    id: "a",
    fields: [
      { key: "name", type: "string", label: "Name", required: true, pattern: /^[a-z]+$/, maxLength: 5 },
      { key: "count", type: "number", label: "Count", default: 2, min: 1, max: 10 },
      {
        key: "on",
        type: "boolean",
        label: "On",
        children: [{ key: "level", type: "slider", label: "Level", min: 0, max: 10, default: 3 }],
      },
    ],
  },
  {
    id: "b",
    fields: [
      { key: "tags", type: "multi", label: "Tags", options: [], min: 1, max: 2 },
      { key: "kind", type: "select", label: "Kind", options: [], required: true },
      { key: "extra", type: "string", label: "Extra", required: true, visible: (v) => v.kind === "x" },
      { key: "locked", type: "string", label: "Locked", required: true, disabled: true },
    ],
  },
];

describe("defaultSchemaValues", () => {
  test("uses defaults and per-type empty values, nested fields included", () => {
    expect(defaultSchemaValues(SCHEMA)).toEqual({
      name: "",
      count: 2,
      on: false,
      level: 3,
      tags: [],
      kind: "",
      extra: "",
      locked: "",
    });
  });

  test("accepts a flat field list", () => {
    expect(defaultSchemaValues([{ key: "x", type: "color", label: "X", swatches: [] }])).toEqual({ x: "" });
  });
});

describe("validateSchema", () => {
  const valid = { ...defaultSchemaValues(SCHEMA), name: "abc", tags: ["t"], kind: "k" };

  test("passes valid values", () => {
    expect(validateSchema(SCHEMA, valid)).toEqual({});
  });

  test("reports in schema order; hidden and disabled fields are skipped", () => {
    const errors = validateSchema(SCHEMA, defaultSchemaValues(SCHEMA));
    expect(Object.keys(errors)).toEqual(["name", "tags", "kind"]);
    expect(errors.name).toBe(LABELS.required);
    expect(errors.tags).toBe(LABELS.minCount(1));
  });

  test("conditional field is validated once visible", () => {
    expect(validateSchema(SCHEMA, { ...valid, kind: "x" })).toEqual({ extra: LABELS.required });
  });

  test("string length and pattern", () => {
    expect(validateSchema(SCHEMA, { ...valid, name: "abcdef" }).name).toBe(LABELS.maxLength(5));
    expect(validateSchema(SCHEMA, { ...valid, name: "ab1" }).name).toBe(LABELS.invalidFormat);
  });

  test("number bounds; a cleared optional number is fine", () => {
    expect(validateSchema(SCHEMA, { ...valid, count: 11 }).count).toBe(LABELS.maxValue(10));
    expect(validateSchema(SCHEMA, { ...valid, count: null })).toEqual({});
  });

  test("children are checked only while the parent is on", () => {
    expect(validateSchema(SCHEMA, { ...valid, level: 20 })).toEqual({});
    expect(validateSchema(SCHEMA, { ...valid, on: true, level: 20 })).toEqual({ level: LABELS.maxValue(10) });
  });

  test("custom validate runs after the built-in checks", () => {
    const schema: Schema = [
      {
        key: "a",
        type: "string",
        label: "A",
        validate: (v, all) => (v === all.b ? "Must differ" : undefined),
      },
      { key: "b", type: "string", label: "B" },
    ];
    expect(validateSchema(schema, { a: "x", b: "x" })).toEqual({ a: "Must differ" });
    expect(validateSchema(schema, { a: "", b: "" })).toEqual({});
  });
});

test("validation is repeatable for stateful regex and rejects malformed numeric values", () => {
  for (const pattern of [/^[a-z]+$/g, /^[a-z]+$/y]) {
    pattern.lastIndex = 2;
    const schema: Schema = [{ key: "name", type: "string", label: "Name", pattern }];
    expect(validateSchema(schema, { name: "valid" })).toEqual({});
    expect(validateSchema(schema, { name: "valid" })).toEqual({});
    expect(pattern.lastIndex).toBe(2);
  }
  const schema: Schema = [{ key: "count", type: "number", label: "Count", min: 0 }];
  for (const value of [Number.NaN, Number.POSITIVE_INFINITY, "5", false, []])
    expect(validateSchema(schema, { count: value })).toEqual({ count: LABELS.invalidFormat });
  expect(validateSchema(schema, { count: null })).toEqual({});
  expect(validateSchema(schema, { count: 0 })).toEqual({});
});
