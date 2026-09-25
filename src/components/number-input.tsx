import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { mergeRefs, useControllable, useLatest } from "../lib/hooks";
import { ChevronDownIcon, ChevronUpIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { Input, type InputProps } from "./input";

export interface NumberBounds {
  min?: number;
  max?: number;
  step?: number;
  /** Decimal places kept; defaults to the step's. */
  precision?: number;
}

const decimals = (n: number) => (Number.isInteger(n) ? 0 : (String(n).split(".")[1]?.length ?? 0));

/** Clamp to [min, max] and round to `precision` (float noise like 0.1 + 0.2 disappears). */
export function clampNumber(
  value: number,
  { min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY, step = 1, precision }: NumberBounds,
) {
  const digits = precision ?? decimals(step);
  const clamped = Math.min(max, Math.max(min, value));
  return Number(clamped.toFixed(digits));
}

/** Lenient parse: "1,5" and " 1.5 " both give 1.5; anything else NaN. */
export const parseNumber = (text: string) => Number(text.trim().replace(/\s/g, "").replace(",", "."));

export interface NumberInputProps
  extends Omit<InputProps, "value" | "defaultValue" | "onChange" | "type" | "min" | "max" | "step" | "end">,
    NumberBounds {
  value?: number | null;
  defaultValue?: number | null;
  /** Committed value (on step, blur, Enter); `null` when cleared and `allowEmpty`. */
  onChange?: (value: number | null) => void;
  /** Unit after the number: "px", "ms", "%". */
  unit?: ReactNode;
  /** Clearing the field yields null instead of reverting. */
  allowEmpty?: boolean;
  /** Display text for a value (default: plain, no grouping). */
  format?: (value: number) => string;
  /** Hide the stepper buttons (arrows and wheel still work). */
  hideStepper?: boolean;
}

/**
 * Numeric field: type freely, commit on blur/Enter (clamped, rounded to the step), ↑/↓ step
 * (Shift ×10, PageUp/PageDown ×10, Home/End to the bounds), wheel steps while focused, stepper buttons
 * repeat while held. `role="spinbutton"` with value and bounds exposed.
 */
export function NumberInput({
  value,
  defaultValue = null,
  onChange,
  min,
  max,
  step = 1,
  precision,
  unit,
  allowEmpty,
  format,
  hideStepper,
  disabled,
  className,
  ref,
  onBlur,
  onKeyDown,
  ...rest
}: NumberInputProps) {
  const labels = useLabels();
  const [current, setCurrent] = useControllable(value, defaultValue, onChange);
  const [draft, setDraft] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const bounds = { min, max, step, precision };
  const digits = precision ?? decimals(step);
  const show = (n: number | null) =>
    n === null
      ? ""
      : format
        ? format(n)
        : n.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: digits });

  const commit = (text: string | null) => {
    setDraft(null);
    if (text === null) return;
    if (text.trim() === "") {
      if (allowEmpty && current !== null) setCurrent(null);
      return;
    }
    const n = parseNumber(text);
    if (Number.isNaN(n)) return;
    const next = clampNumber(n, bounds);
    if (next !== current) setCurrent(next);
  };

  const stepBy = (times: number) => {
    const base =
      draft !== null && !Number.isNaN(parseNumber(draft)) ? parseNumber(draft) : (current ?? min ?? 0);
    const next = clampNumber(base + times * step, bounds);
    setDraft(null);
    if (next !== current) setCurrent(next);
  };
  const stepRef = useLatest(stepBy);

  // wheel steps only while focused; React's wheel listener is passive, so preventDefault needs a native one
  useEffect(() => {
    const el = input.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (document.activeElement !== el || event.deltaY === 0) return;
      event.preventDefault();
      stepRef.current(event.deltaY < 0 ? 1 : -1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [stepRef]);

  const keys = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const big = event.shiftKey ? 10 : 1;
    switch (event.key) {
      case "ArrowUp":
        stepBy(big);
        break;
      case "ArrowDown":
        stepBy(-big);
        break;
      case "PageUp":
        stepBy(10);
        break;
      case "PageDown":
        stepBy(-10);
        break;
      case "Home":
        if (min === undefined) return;
        setDraft(null);
        setCurrent(min);
        break;
      case "End":
        if (max === undefined) return;
        setDraft(null);
        setCurrent(max);
        break;
      case "Enter":
        commit(draft);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  // press-and-hold on a stepper button repeats after a short delay
  const repeat = useRef<ReturnType<typeof setTimeout>>(undefined);
  const stopRepeat = () => clearTimeout(repeat.current);
  useEffect(() => () => clearTimeout(repeat.current), []);
  const hold = (times: number) => {
    stepBy(times);
    const loop = (delay: number) => {
      repeat.current = setTimeout(() => {
        stepRef.current(times);
        loop(60);
      }, delay);
    };
    loop(400);
  };
  const stepper = (times: 1 | -1) => (
    <button
      type="button"
      tabIndex={-1}
      className="rk-number-step"
      aria-label={times > 0 ? labels.increment : labels.decrement}
      disabled={
        disabled ||
        (times > 0
          ? max !== undefined && (current ?? Number.NEGATIVE_INFINITY) >= max
          : min !== undefined && (current ?? Number.POSITIVE_INFINITY) <= min)
      }
      onPointerDown={(event) => {
        event.preventDefault();
        input.current?.focus();
        hold(times);
      }}
      onPointerUp={stopRepeat}
      onPointerLeave={stopRepeat}
      onPointerCancel={stopRepeat}
    >
      {times > 0 ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </button>
  );

  return (
    <Input
      {...rest}
      ref={mergeRefs(input, ref)}
      className={cx("rk-number-input", className)}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      role="spinbutton"
      aria-valuenow={current ?? undefined}
      aria-valuemin={min}
      aria-valuemax={max}
      disabled={disabled}
      value={draft ?? show(current)}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={keys}
      onBlur={(event) => {
        commit(draft);
        onBlur?.(event);
      }}
      end={
        (unit !== undefined || !hideStepper) && (
          <>
            {unit !== undefined && <span className="rk-number-unit">{unit}</span>}
            {!hideStepper && (
              <span className="rk-number-stepper">
                {stepper(1)}
                {stepper(-1)}
              </span>
            )}
          </>
        )
      }
    />
  );
}
