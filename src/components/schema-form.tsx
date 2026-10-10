import {
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { LABELS, type Labels, useLabels } from "../lib/labels";
import type { Size } from "./button";
import { Nest } from "./card";
import { ChipGroup, type ChipOption, ColorSwatches, SegmentedControl, Switch } from "./choice";
import { Field, Input, Textarea } from "./input";
import { NumberInput } from "./number-input";
import { Select, type SelectOption } from "./select";
import { SettingsGroup } from "./settings-list";
import { Slider } from "./slider";

export type SchemaValue = string | number | boolean | string[] | null;
export type SchemaValues = Record<string, SchemaValue | undefined>;

interface SchemaFieldBase {
  /** Key in the values record. */
  key: string;
  label: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  disabled?: boolean | ((values: SchemaValues) => boolean);
  /** Hide the field (and skip its validation) unless this returns true. */
  visible?: (values: SchemaValues) => boolean;
  /** Runs after the built-in checks; return a message to fail. */
  validate?: (value: SchemaValue, values: SchemaValues) => string | undefined;
  /** Per-field override of the form layout (`text` fields default to stack). */
  layout?: "inline" | "stack";
  /** Sub-fields indented under this one, shown (and validated) while its value is truthy. */
  children?: ReadonlyArray<SchemaField>;
}

export type SchemaField =
  | (SchemaFieldBase & {
      type: "string" | "text";
      default?: string;
      placeholder?: string;
      mono?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      /** Message when `pattern` fails (default: labels.invalidFormat). */
      patternMessage?: string;
    })
  | (SchemaFieldBase & {
      type: "number";
      default?: number | null;
      min?: number;
      max?: number;
      step?: number;
      precision?: number;
      unit?: ReactNode;
      placeholder?: string;
    })
  | (SchemaFieldBase & {
      type: "slider";
      default?: number;
      min: number;
      max: number;
      step?: number;
      format?: (value: number) => ReactNode;
    })
  | (SchemaFieldBase & {
      type: "select";
      default?: string;
      options: ReadonlyArray<SelectOption>;
      /** `segmented` for two to four short options. */
      display?: "select" | "segmented";
      placeholder?: string;
    })
  | (SchemaFieldBase & {
      type: "multi";
      default?: string[];
      options: ReadonlyArray<ChipOption>;
      /** Selection count bounds. */
      min?: number;
      max?: number;
    })
  | (SchemaFieldBase & {
      type: "color";
      default?: string;
      swatches: ReadonlyArray<{ value: string; label: string }>;
    })
  | (SchemaFieldBase & { type: "boolean"; default?: boolean })
  | (SchemaFieldBase & {
      type: "custom";
      default?: SchemaValue;
      render: (props: SchemaControlProps) => ReactNode;
    });

export interface SchemaControlProps {
  value: SchemaValue;
  set: (value: SchemaValue) => void;
  values: SchemaValues;
  invalid: boolean;
  disabled: boolean;
  size: Size;
}

export interface SchemaSection {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  fields: ReadonlyArray<SchemaField>;
  tone?: "danger";
}

export type Schema = ReadonlyArray<SchemaSection> | ReadonlyArray<SchemaField>;

const sectionsOf = (schema: Schema): ReadonlyArray<SchemaSection> =>
  schema.length > 0 && "fields" in (schema[0] as object)
    ? (schema as ReadonlyArray<SchemaSection>)
    : [{ id: "", fields: schema as ReadonlyArray<SchemaField> }];

function emptyValue(field: SchemaField): SchemaValue {
  switch (field.type) {
    case "number":
    case "custom":
      return null;
    case "slider":
      return field.min;
    case "multi":
      return [];
    case "boolean":
      return false;
    default:
      return "";
  }
}

/** `null` is a value (a cleared number), only a missing key falls back to the default. */
const fieldValue = (field: SchemaField, values: SchemaValues): SchemaValue => {
  const value = values[field.key];
  return value === undefined ? (field.default ?? emptyValue(field)) : value;
};

const isOn = (value: SchemaValue) => (Array.isArray(value) ? value.length > 0 : Boolean(value));

const isEmpty = (value: SchemaValue) =>
  value === null ||
  value === false ||
  (typeof value === "string" && value.trim() === "") ||
  (Array.isArray(value) && value.length === 0);

const isDisabled = (field: SchemaField, values: SchemaValues) =>
  typeof field.disabled === "function" ? field.disabled(values) : Boolean(field.disabled);

/** Every field's default (or its type's empty value), nested fields included. */
export function defaultSchemaValues(schema: Schema): Record<string, SchemaValue> {
  const out: Record<string, SchemaValue> = {};
  const walk = (fields: ReadonlyArray<SchemaField>) => {
    for (const f of fields) {
      out[f.key] = f.default ?? emptyValue(f);
      if (f.children) walk(f.children);
    }
  };
  for (const s of sectionsOf(schema)) walk(s.fields);
  return out;
}

function checkField(field: SchemaField, value: SchemaValue, values: SchemaValues, labels: Labels) {
  if (value !== null && field.type !== "custom") {
    const expected =
      field.type === "number" || field.type === "slider"
        ? "number"
        : field.type === "boolean"
          ? "boolean"
          : field.type === "multi"
            ? "object"
            : "string";
    if (
      typeof value !== expected ||
      (field.type === "multi" && (!Array.isArray(value) || value.some((item) => typeof item !== "string")))
    )
      return labels.invalidFormat;
  }
  if (isEmpty(value)) {
    if (field.required) return labels.required;
    // a lower bound on picks still applies to an empty selection
    return field.type === "multi" && field.min ? labels.minCount(field.min) : undefined;
  }
  switch (field.type) {
    case "string":
    case "text": {
      if (typeof value !== "string") return labels.invalidFormat;
      const text = value;
      if (field.minLength !== undefined && text.length < field.minLength)
        return labels.minLength(field.minLength);
      if (field.maxLength !== undefined && text.length > field.maxLength)
        return labels.maxLength(field.maxLength);
      if (field.pattern) {
        // Stateful /g and /y expressions must not mutate the schema between validations.
        const pattern = new RegExp(field.pattern.source, field.pattern.flags);
        if (!pattern.test(text)) return field.patternMessage ?? labels.invalidFormat;
      }
      break;
    }
    case "number":
    case "slider":
      if (typeof value !== "number" || !Number.isFinite(value)) return labels.invalidFormat;
      if (field.min !== undefined && value < field.min) return labels.minValue(field.min);
      if (field.max !== undefined && value > field.max) return labels.maxValue(field.max);
      break;
    case "multi": {
      const count = Array.isArray(value) ? value.length : 0;
      if (field.min !== undefined && count < field.min) return labels.minCount(field.min);
      if (field.max !== undefined && count > field.max) return labels.maxCount(field.max);
      break;
    }
    default:
  }
  return field.validate?.(value, values);
}

/**
 * Errors by key, in schema order. Only fields a user can see and edit are checked: hidden (`visible`),
 * disabled and collapsed children (parent off) are skipped. Pure — use it to gate a Run button.
 */
export function validateSchema(
  schema: Schema,
  values: SchemaValues,
  labels: Labels = LABELS,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const walk = (fields: ReadonlyArray<SchemaField>) => {
    for (const f of fields) {
      if ((f.visible && !f.visible(values)) || isDisabled(f, values)) continue;
      const value = fieldValue(f, values);
      const error = checkField(f, value, values, labels);
      if (error) errors[f.key] = error;
      if (f.children && isOn(value)) walk(f.children);
    }
  };
  for (const s of sectionsOf(schema)) walk(s.fields);
  return errors;
}

export interface SchemaFormProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange" | "onSubmit" | "defaultValue"> {
  /** Sections (`{ id, title, fields }`) or a flat list of fields. */
  schema: Schema;
  values?: SchemaValues;
  /** Merged over the schema defaults. */
  defaultValues?: SchemaValues;
  onChange?: (values: SchemaValues) => void;
  /**
   * Makes the root a `<form>`: submit validates everything, shows all errors and focuses the first
   * invalid field, or calls this with the values. Without it the form embeds in an outer one.
   */
  onSubmit?: (values: SchemaValues) => void;
  /** External errors by key (server-side checks); shown right away, over the built-in ones. */
  errors?: Readonly<Record<string, string | undefined>>;
  /** inline — label left, control right (settings); stack — label above (dialogs, wide inputs). */
  layout?: "inline" | "stack";
  /** card — a card per section; plain — divided sections (dialogs, side panels). */
  variant?: "card" | "plain";
  /** Control size; default sm for inline, md for stack. */
  size?: Size;
  disabled?: boolean;
  /** Footer row: submit / reset buttons. A `type="reset"` button restores the defaults. */
  actions?: ReactNode;
}

const FOCUSABLE = "input:not([type=hidden]), textarea, button, [tabindex]:not([tabindex='-1'])";

/**
 * Form rendered from a schema: text, numbers, sliders, selects, chips, colors and switches with nested
 * sub-fields, conditional visibility and validation. Errors appear once a field is left or on submit.
 */
export function SchemaForm({
  schema,
  values,
  defaultValues,
  onChange,
  onSubmit,
  errors: external,
  layout = "inline",
  variant = "card",
  size,
  disabled,
  actions,
  className,
  ...rest
}: SchemaFormProps) {
  const labels = useLabels();
  const [inner, setInner] = useState<SchemaValues>(() => ({
    ...defaultSchemaValues(schema),
    ...defaultValues,
  }));
  const current = values ?? inner;
  const [touched, setTouched] = useState<ReadonlySet<string>>(() => new Set());
  const [submitted, setSubmitted] = useState(false);
  const root = useRef<HTMLElement>(null);

  const own = validateSchema(schema, current, labels);
  const errorOf = (key: string) => external?.[key] ?? (submitted || touched.has(key) ? own[key] : undefined);

  const update = (next: SchemaValues) => {
    if (values === undefined) setInner(next);
    onChange?.(next);
  };
  const touch = (key: string) => {
    if (!touched.has(key)) setTouched(new Set(touched).add(key));
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const first = Object.keys({ ...own, ...external }).find((k) => own[k] ?? external?.[k]);
    if (first === undefined) return onSubmit?.(current);
    root.current
      ?.querySelector(`[data-key="${CSS.escape(first)}"] .rk-field-control`)
      ?.querySelector<HTMLElement>(FOCUSABLE)
      ?.focus();
  };
  const handleReset = (e: SyntheticEvent) => {
    e.preventDefault();
    setTouched(new Set());
    setSubmitted(false);
    update({ ...defaultSchemaValues(schema), ...defaultValues });
  };

  const renderFields = (fields: ReadonlyArray<SchemaField>, lockedAbove: boolean): ReactNode =>
    fields
      .filter((f) => !f.visible || f.visible(current))
      .map((f) => {
        const value = fieldValue(f, current);
        const locked = lockedAbove || isDisabled(f, current);
        const error = errorOf(f.key);
        const fieldLayout = f.layout ?? (f.type === "text" ? "stack" : layout);
        const ctl: SchemaControlProps = {
          value,
          set: (next) => update({ ...current, [f.key]: next }),
          values: current,
          invalid: Boolean(error),
          disabled: locked,
          size: size ?? (fieldLayout === "inline" ? "sm" : "md"),
        };
        return (
          <div key={f.key} className="rk-settings-row rk-schema-row" data-key={f.key} data-type={f.type}>
            <Field layout={fieldLayout} label={f.label} hint={f.hint} error={error} required={f.required}>
              {/* a disabled fieldset also locks controls without their own `disabled` (chips, swatches) */}
              <fieldset className="rk-schema-control" disabled={locked} onBlur={() => touch(f.key)}>
                {control(f, ctl)}
              </fieldset>
            </Field>
            {f.children && isOn(value) && <Nest>{renderFields(f.children, locked)}</Nest>}
          </div>
        );
      });

  const body = (
    <>
      {sectionsOf(schema).map((s) => (
        <SettingsGroup key={s.id} variant={variant} title={s.title} description={s.description} tone={s.tone}>
          {renderFields(s.fields, Boolean(disabled))}
        </SettingsGroup>
      ))}
      {actions && <div className="rk-schema-actions">{actions}</div>}
    </>
  );
  const shared = {
    ...rest,
    className: cx("rk-schema-form", className),
    "data-variant": variant,
    "data-layout": layout,
  };
  return onSubmit ? (
    <form
      {...shared}
      ref={root as RefObject<HTMLFormElement>}
      noValidate
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      {body}
    </form>
  ) : (
    <div {...shared} ref={root as RefObject<HTMLDivElement>}>
      {body}
    </div>
  );
}

function control(f: SchemaField, ctl: SchemaControlProps): ReactNode {
  const { value, set, invalid, disabled, size } = ctl;
  // group controls have no single element for <label for>, so they take the label as their name
  const name = typeof f.label === "string" ? f.label : undefined;
  switch (f.type) {
    case "string":
      return (
        <Input
          size={size}
          value={String(value)}
          placeholder={f.placeholder}
          mono={f.mono}
          disabled={disabled}
          aria-required={f.required}
          onChange={(e) => set(e.target.value)}
        />
      );
    case "text":
      return (
        <Textarea
          autoSize
          value={String(value)}
          placeholder={f.placeholder}
          mono={f.mono}
          disabled={disabled}
          invalid={invalid}
          aria-required={f.required}
          onChange={(e) => set(e.target.value)}
        />
      );
    case "number":
      return (
        <NumberInput
          size={size}
          value={typeof value === "number" ? value : null}
          min={f.min}
          max={f.max}
          step={f.step}
          precision={f.precision}
          unit={f.unit}
          placeholder={f.placeholder}
          allowEmpty
          disabled={disabled}
          aria-required={f.required}
          onChange={set}
        />
      );
    case "slider":
      return (
        <Slider
          min={f.min}
          max={f.max}
          step={f.step}
          value={Number(value)}
          showValue={f.format ?? true}
          disabled={disabled}
          onChange={set}
        />
      );
    case "select":
      return f.display === "segmented" ? (
        <SegmentedControl
          size={size}
          options={f.options.map((o) => ({
            value: o.value,
            icon: o.icon,
            disabled: o.disabled,
            // a non-text label still needs a name: the option's text, else its value
            ...(typeof o.label === "string"
              ? { label: o.label }
              : { label: o.label, hint: o.text ?? o.value }),
          }))}
          value={String(value)}
          disabled={disabled}
          aria-label={name}
          onChange={set}
        />
      ) : (
        <Select
          size={size}
          options={f.options}
          value={String(value)}
          placeholder={f.placeholder}
          disabled={disabled}
          invalid={invalid}
          onChange={set}
        />
      );
    case "multi":
      return (
        <ChipGroup
          size={size === "lg" ? "md" : size}
          options={f.options}
          value={Array.isArray(value) ? value : []}
          aria-label={name}
          onChange={set}
        />
      );
    case "color":
      return (
        // an empty value leaves the swatches uncontrolled: remount so a reset clears the pick
        <ColorSwatches
          key={value ? "picked" : "empty"}
          options={f.swatches}
          value={String(value) || undefined}
          aria-label={name}
          custom
          onChange={set}
        />
      );
    case "boolean":
      return (
        <Switch
          size={size === "sm" ? "sm" : "md"}
          checked={value === true}
          disabled={disabled}
          onChange={(e) => set(e.target.checked)}
        />
      );
    case "custom":
      return f.render(ctl);
  }
}
