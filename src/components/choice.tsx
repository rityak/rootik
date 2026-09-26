import { type InputHTMLAttributes, type ReactNode, type Ref, useEffect, useId, useRef } from "react";
import { cx } from "../lib/cx";
import { mergeRefs, useControllable } from "../lib/hooks";
import { CheckIcon } from "../lib/icons";
import { useIndicator } from "../lib/indicator";
import { useLabels } from "../lib/labels";
import type { Size } from "./button";
import { useField, useFieldLabel } from "./input";

type NativeInput = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size">;

export interface CheckboxProps extends NativeInput {
  label?: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function Checkbox({ label, description, indeterminate, className, ref, ...rest }: CheckboxProps) {
  const own = useRef<HTMLInputElement>(null);
  const field = useField(rest);
  useEffect(() => {
    if (own.current) own.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  const input = (
    <input {...rest} {...field} ref={mergeRefs(own, ref)} type="checkbox" className="rk-checkbox" />
  );
  if (!label && !description) return input;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the input is rendered via a variable
    <label className={cx("rk-check", className)} data-disabled={rest.disabled || undefined}>
      {input}
      <CheckText label={label} description={description} />
    </label>
  );
}

function CheckText({ label, description }: { label?: ReactNode; description?: ReactNode }) {
  return (
    <span className="rk-check-text">
      {label && <span className="rk-check-label">{label}</span>}
      {description && <span className="rk-check-desc">{description}</span>}
    </span>
  );
}

export interface SwitchProps extends NativeInput {
  label?: ReactNode;
  description?: ReactNode;
  /** Label before the switch, spread apart (settings rows). */
  labelPosition?: "start" | "end";
  size?: "sm" | "md";
  ref?: Ref<HTMLInputElement>;
}

export function Switch({
  label,
  description,
  labelPosition = "end",
  size = "md",
  className,
  ...rest
}: SwitchProps) {
  const field = useField(rest);
  const input = (
    // biome-ignore lint/a11y/useAriaPropsForRole: a native checkbox exposes its checked state to role=switch
    <input {...rest} {...field} type="checkbox" role="switch" className="rk-switch" data-size={size} />
  );
  if (!label && !description) return input;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the input is rendered via a variable
    <label
      className={cx("rk-check", className)}
      data-position={labelPosition}
      data-disabled={rest.disabled || undefined}
    >
      {input}
      <CheckText label={label} description={description} />
    </label>
  );
}

export interface RadioOption<T extends string = string> {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps<T extends string = string> {
  options: ReadonlyArray<RadioOption<T>>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  name?: string;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

export function RadioGroup<T extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  name,
  orientation = "vertical",
  disabled,
  className,
  ...rest
}: RadioGroupProps<T>) {
  const fieldLabel = useFieldLabel();
  const [current, set] = useControllable<T | undefined>(
    value,
    defaultValue,
    onChange as (v: T | undefined) => void,
  );
  const auto = useId();
  return (
    <div
      role="radiogroup"
      aria-label={rest["aria-label"]}
      aria-labelledby={rest["aria-label"] ? undefined : fieldLabel}
      className={cx("rk-radio-group", className)}
      data-orientation={orientation}
    >
      {options.map((o) => (
        <label key={o.value} className="rk-check" data-disabled={disabled || o.disabled || undefined}>
          <input
            type="radio"
            className="rk-radio"
            name={name ?? auto}
            value={o.value}
            checked={current === o.value}
            disabled={disabled || o.disabled}
            onChange={() => set(o.value)}
          />
          <CheckText label={o.label} description={o.description} />
        </label>
      ))}
    </div>
  );
}

/** A segment needs a name: a text `label`, or a `hint` (tooltip + accessible name) when it has none. */
export type SegmentOption<T extends string = string> = {
  value: T;
  icon?: ReactNode;
  disabled?: boolean;
} & ({ label: string; hint?: string } | { label?: ReactNode; hint: string });

export interface SegmentedControlProps<T extends string = string> {
  options: ReadonlyArray<SegmentOption<T>>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  size?: Size;
  /** Stretch segments to full width. */
  fill?: boolean;
  name?: string;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

/**
 * One-of-many switch with a sliding inverted pill. Native radios underneath: arrows, Tab and
 * "2 of 3" announcements come from the browser.
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  size = "md",
  fill,
  name,
  disabled,
  className,
  ...rest
}: SegmentedControlProps<T>) {
  const fieldLabel = useFieldLabel();
  const [current, set] = useControllable<T | undefined>(
    value,
    defaultValue ?? options[0]?.value,
    onChange as (v: T | undefined) => void,
  );
  const auto = useId();
  const track = useRef<HTMLDivElement>(null);
  const box = useIndicator(track, "[data-checked]", current);
  return (
    <div
      ref={track}
      role="radiogroup"
      aria-label={rest["aria-label"]}
      aria-labelledby={rest["aria-label"] ? undefined : fieldLabel}
      className={cx("rk-segmented", className)}
      data-size={size}
      data-fill={fill || undefined}
      data-disabled={disabled || undefined}
    >
      {box && (
        <span
          className="rk-indicator rk-segmented-thumb"
          data-dir={box.dir}
          style={{ left: box.left, right: box.right }}
        />
      )}
      {options.map((o) => (
        <label
          key={o.value}
          className="rk-segmented-item"
          title={o.hint}
          data-checked={o.value === current || undefined}
          data-disabled={disabled || o.disabled || undefined}
        >
          <input
            type="radio"
            className="rk-sr-only"
            name={name ?? auto}
            value={o.value}
            checked={o.value === current}
            disabled={disabled || o.disabled}
            aria-label={typeof o.label === "string" ? undefined : o.hint}
            onChange={() => set(o.value)}
          />
          {o.icon && <span className="rk-icon">{o.icon}</span>}
          {o.label}
        </label>
      ))}
    </div>
  );
}

export interface ChoiceCardOption<T extends string = string> {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Caveat line, rendered in warn tone. */
  note?: ReactNode;
  disabled?: boolean;
}

export interface ChoiceCardsProps<T extends string = string> {
  options: ReadonlyArray<ChoiceCardOption<T>>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  /** Min column width, px. */
  minWidth?: number;
  name?: string;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

/** Radio choices as cards with a description: modes, strategies, plans. */
export function ChoiceCards<T extends string = string>({
  value,
  defaultValue,
  onChange,
  ...rest
}: ChoiceCardsProps<T>) {
  const [current, set] = useControllable<T | undefined>(
    value,
    defaultValue,
    onChange as (v: T | undefined) => void,
  );
  return <Cards {...rest} type="radio" isChecked={(v) => v === current} toggle={set} />;
}

export interface CheckboxCardsProps<T extends string = string>
  extends Omit<ChoiceCardsProps<T>, "value" | "defaultValue" | "onChange"> {
  value?: ReadonlyArray<T>;
  defaultValue?: ReadonlyArray<T>;
  onChange?: (value: T[]) => void;
}

/** Many-of choices as cards (features to enable, datasets to include). Keeps the options' order. */
export function CheckboxCards<T extends string = string>({
  value,
  defaultValue = [],
  onChange,
  ...rest
}: CheckboxCardsProps<T>) {
  const [current, set] = useControllable<ReadonlyArray<T>>(
    value,
    defaultValue,
    onChange as (v: ReadonlyArray<T>) => void,
  );
  return (
    <Cards
      {...rest}
      type="checkbox"
      isChecked={(v) => current.includes(v)}
      toggle={(v) =>
        set(
          rest.options
            .map((o) => o.value)
            .filter((x) => (x === v ? !current.includes(v) : current.includes(x))),
        )
      }
    />
  );
}

function Cards<T extends string>({
  options,
  minWidth = 200,
  name,
  disabled,
  className,
  type,
  isChecked,
  toggle,
  ...rest
}: Omit<ChoiceCardsProps<T>, "value" | "defaultValue" | "onChange"> & {
  type: "radio" | "checkbox";
  isChecked: (value: T) => boolean;
  toggle: (value: T) => void;
}) {
  const fieldLabel = useFieldLabel();
  const auto = useId();
  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: both roles (radiogroup, group) take a label
    <div
      role={type === "radio" ? "radiogroup" : "group"}
      aria-label={rest["aria-label"]}
      aria-labelledby={rest["aria-label"] ? undefined : fieldLabel}
      className={cx("rk-choice-cards", className)}
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${minWidth}px, 100%), 1fr))` }}
    >
      {options.map((o) => (
        <label key={o.value} className="rk-choice-card" data-disabled={disabled || o.disabled || undefined}>
          <input
            type={type}
            className="rk-sr-only"
            name={name ?? auto}
            value={o.value}
            checked={isChecked(o.value)}
            disabled={disabled || o.disabled}
            onChange={() => toggle(o.value)}
          />
          <span className="rk-choice-card-head">
            {o.icon && <span className="rk-icon rk-choice-card-icon">{o.icon}</span>}
            <span className="rk-choice-card-label">{o.label}</span>
            <span className="rk-choice-card-dot" data-type={type} aria-hidden="true">
              {type === "checkbox" && <CheckIcon strokeWidth={3} />}
            </span>
          </span>
          {o.description && <span className="rk-choice-card-desc">{o.description}</span>}
          {o.note && <span className="rk-choice-card-note">{o.note}</span>}
        </label>
      ))}
    </div>
  );
}

export interface ChipOption<T extends string = string> {
  value: T;
  label?: ReactNode;
  icon?: ReactNode;
  count?: ReactNode;
  disabled?: boolean;
}

export interface ChipGroupProps<T extends string = string> {
  options: ReadonlyArray<ChipOption<T>>;
  /** Selected values. */
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
  /** Single selection (radio-like, can't deselect). */
  single?: boolean;
  size?: "sm" | "md";
  "aria-label"?: string;
  className?: string;
}

/** Toggle chips: filters, tag pickers, multi-select of a few options. Selected = inverted pill. */
export function ChipGroup<T extends string = string>({
  options,
  value,
  defaultValue = [],
  onChange,
  single,
  size = "md",
  className,
  ...rest
}: ChipGroupProps<T>) {
  const fieldLabel = useFieldLabel();
  const [selected, set] = useControllable(value, defaultValue, onChange);
  const toggle = (v: T) => {
    if (single) return set([v]);
    set(
      selected.includes(v)
        ? selected.filter((x) => x !== v)
        : options.filter((o) => o.value === v || selected.includes(o.value)).map((o) => o.value),
    );
  };
  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset would add a legend/border we don't want
    <div
      role="group"
      aria-label={rest["aria-label"]}
      aria-labelledby={rest["aria-label"] ? undefined : fieldLabel}
      className={cx("rk-chip-group", className)}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="rk-chip"
          data-size={size}
          aria-pressed={selected.includes(o.value)}
          disabled={o.disabled}
          onClick={() => toggle(o.value)}
        >
          {o.icon && <span className="rk-icon">{o.icon}</span>}
          {o.label ?? o.value}
          {o.count !== undefined && <span className="rk-chip-count rk-num">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export interface ColorSwatchesProps {
  /** CSS colors. */
  options: ReadonlyArray<{ value: string; label: string }>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Adds a native color picker as the last swatch. */
  custom?: boolean;
  name?: string;
  "aria-label"?: string;
  className?: string;
}

export function ColorSwatches({
  options,
  value,
  defaultValue,
  onChange,
  custom,
  name,
  className,
  ...rest
}: ColorSwatchesProps) {
  const fieldLabel = useFieldLabel();
  const strings = useLabels();
  const [current, set] = useControllable<string | undefined>(
    value,
    defaultValue,
    onChange as (v: string | undefined) => void,
  );
  const auto = useId();
  const isPreset = options.some((o) => o.value === current);
  return (
    <div
      role="radiogroup"
      aria-label={rest["aria-label"]}
      aria-labelledby={rest["aria-label"] ? undefined : fieldLabel}
      className={cx("rk-swatches", className)}
    >
      {options.map((o) => (
        <label
          key={o.value}
          className="rk-swatch"
          title={o.label}
          style={{ "--rk-swatch": o.value } as React.CSSProperties}
        >
          <input
            type="radio"
            className="rk-sr-only"
            name={name ?? auto}
            value={o.value}
            checked={o.value === current}
            aria-label={o.label}
            onChange={() => set(o.value)}
          />
        </label>
      ))}
      {custom && (
        <label
          className="rk-swatch"
          data-custom
          data-checked={(!isPreset && current !== undefined) || undefined}
          title={strings.customColor}
          style={{ "--rk-swatch": !isPreset && current ? current : undefined } as React.CSSProperties}
        >
          <input
            type="color"
            className="rk-sr-only"
            aria-label={strings.customColor}
            value={toHex(current)}
            onChange={(event) => set(event.target.value)}
          />
        </label>
      )}
    </div>
  );
}

const HEX6 = /^#[0-9a-f]{6}$/i;

/** Native color inputs only accept #rrggbb; resolve any CSS color via canvas. */
function toHex(color: string | undefined): string {
  if (!color) return "#000000";
  if (HEX6.test(color)) return color;
  try {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return "#000000";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r = 0, g = 0, b = 0] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  } catch {
    return "#000000";
  }
}
