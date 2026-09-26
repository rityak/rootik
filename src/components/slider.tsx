import { type CSSProperties, type InputHTMLAttributes, type ReactNode, useId } from "react";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
import { useLabels } from "../lib/labels";
import { useField } from "./input";

export interface SliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "onChange" | "size"
  > {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: ReactNode;
  /** Value readout right of the label; `true` prints the number, a function formats it. */
  showValue?: boolean | ((value: number) => ReactNode);
  /** Tick values under the track. */
  marks?: ReadonlyArray<number>;
  /** `vertical`: min at the bottom; give the slider a height. */
  orientation?: "horizontal" | "vertical";
}

/** Native range input; filled part in accent, remainder hatched. */
export function Slider({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue,
  marks,
  orientation = "horizontal",
  className,
  style,
  ...rest
}: SliderProps) {
  const [current, set] = useControllable(value, defaultValue ?? min, onChange);
  const field = useField(rest);
  // outside a Field there is no id, and <label htmlFor={undefined}> names nothing
  const auto = useId();
  const id = field.id ?? auto;
  const pct = max > min ? ((current - min) / (max - min)) * 100 : 0;
  const readout = typeof showValue === "function" ? showValue(current) : showValue ? current : null;
  return (
    <div className={cx("rk-slider", className)} style={style} data-orientation={orientation}>
      {(label || readout !== null) && (
        <div className="rk-slider-head">
          {label && <label htmlFor={id}>{label}</label>}
          {readout !== null && <span className="rk-slider-value rk-num">{readout}</span>}
        </div>
      )}
      <input
        {...rest}
        {...field}
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(event) => set(Number(event.target.value))}
        aria-orientation={orientation === "vertical" ? "vertical" : undefined}
        className="rk-slider-input"
        // the thumb travels (width - thumb), so the fill edge follows its center
        style={
          {
            "--rk-fill": `calc(var(--rk-thumb) / 2 + (100% - var(--rk-thumb)) * ${pct / 100})`,
          } as CSSProperties
        }
      />
      {marks && (
        <div className="rk-slider-marks" aria-hidden="true">
          {marks.map((m) => (
            <span key={m} style={{ left: `${((m - min) / (max - min)) * 100}%` }}>
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export interface RangeSliderProps
  extends Omit<SliderProps, "value" | "defaultValue" | "onChange" | "showValue" | "orientation"> {
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  /** Smallest allowed gap between the thumbs. */
  minDistance?: number;
  /** Readout right of the label; `true` prints "lo – hi". */
  showValue?: boolean | ((value: [number, number]) => ReactNode);
}

/**
 * Two thumbs on one track (size range, date window, price band). Two overlaid native range inputs, so
 * keyboard and screen readers behave as usual; each is named "Minimum" / "Maximum".
 */
export function RangeSlider({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  minDistance = 0,
  label,
  showValue,
  marks,
  disabled,
  className,
  style,
  ...rest
}: RangeSliderProps) {
  const labels = useLabels();
  const [[lo, hi], set] = useControllable<[number, number]>(value, defaultValue ?? [min, max], onChange);
  const field = useField(rest);
  const auto = useId();
  const headId = `${auto}-label`;
  // each thumb is named "<label> Minimum" / "<label> Maximum"
  const thumbName = (part: string) => (label ? { "aria-labelledby": `${headId} ${auto}-${part}` } : {});
  const span = max - min || 1;
  const at = (v: number) => (v - min) / span;
  const readout = typeof showValue === "function" ? showValue([lo, hi]) : showValue ? `${lo} – ${hi}` : null;
  // with both thumbs at the top end, the upper one would cover the lower: lift the lower one there
  const lowOnTop = at(lo) > 0.5;
  const fill = (v: number) => `calc(var(--rk-thumb) / 2 + (100% - var(--rk-thumb)) * ${at(v)})`;
  return (
    <div className={cx("rk-slider rk-range", className)} style={style}>
      {(label || readout !== null) && (
        <div className="rk-slider-head">
          {label && (
            <label id={headId} htmlFor={field.id ?? `${auto}-lo`}>
              {label}
            </label>
          )}
          <span id={`${auto}-min`} hidden>
            {labels.minimum}
          </span>
          <span id={`${auto}-max`} hidden>
            {labels.maximum}
          </span>
          {readout !== null && <span className="rk-slider-value rk-num">{readout}</span>}
        </div>
      )}
      <div
        className="rk-range-body"
        style={{ "--rk-lo": fill(lo), "--rk-hi": fill(hi) } as CSSProperties}
        data-disabled={disabled || undefined}
      >
        <span className="rk-range-track" aria-hidden="true" />
        <input
          {...rest}
          {...field}
          type="range"
          min={min}
          max={max}
          step={step}
          id={field.id ?? `${auto}-lo`}
          value={lo}
          disabled={disabled}
          aria-label={labels.minimum}
          {...thumbName("min")}
          className="rk-slider-input rk-range-input"
          data-top={lowOnTop || undefined}
          onChange={(event) => set([Math.min(Number(event.target.value), hi - minDistance), hi])}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          disabled={disabled}
          aria-label={labels.maximum}
          {...thumbName("max")}
          className="rk-slider-input rk-range-input"
          onChange={(event) => set([lo, Math.max(Number(event.target.value), lo + minDistance)])}
        />
      </div>
      {marks && (
        <div className="rk-slider-marks" aria-hidden="true">
          {marks.map((m) => (
            <span key={m} style={{ left: `${at(m) * 100}%` }}>
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
