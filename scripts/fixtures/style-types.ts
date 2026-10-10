import type { GlobalStyleRule } from "@vanilla-extract/css";
import type { AppearanceValues } from "../../src/theme/schema";
import { defineColumns } from "../../src/components/data";
import type { ComboboxProps } from "../../src/components/combobox";
import { tokens } from "../../styles/tokens.css";

const valid: AppearanceValues = { radius: 16, "glow.gradient": "clouds", "app.enabled": true };
// @ts-expect-error Built-in keys cannot accept the extension union.
const radius: AppearanceValues = { radius: "sixteen" };
// @ts-expect-error Gradient modes are a closed union.
const gradient: AppearanceValues = { "glow.gradient": "stripe" };
// @ts-expect-error Unknown semantic token references are rejected.
const token: GlobalStyleRule = { color: tokens.nonexistent };
// @ts-expect-error CSS properties are checked by VE's installed csstype version.
const property: GlobalStyleRule = { backgroun: "red" };
void [valid, radius, gradient, token, property];

interface Row { name: string; meta: { count: number } }
const columns = defineColumns<Row>();
columns([{ key: "name", header: "Name" }, { key: "computed", header: "Count", cell: (row) => row.meta.count }]);
// @ts-expect-error Missing scalar accessor keys are rejected.
columns([{ key: "naem", header: "Name" }]);
// @ts-expect-error Object accessors require a renderer/value.
columns([{ key: "meta", header: "Meta" }]);

// @ts-expect-error Arbitrary custom text cannot be reported as a finite union.
const narrowCustom: ComboboxProps<"one" | "two"> = { allowCustom: true, onChange: (_value: "one" | "two" | null) => {} };
void narrowCustom;
