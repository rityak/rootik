import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
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
  className,
  style,
  ...rest
}: SliderProps) {
  const [current, set] = useControllable(value, defaultValue ?? min, onChange);
  const field = useField(rest);
  const pct = max > min ? ((current - min) / (max - min)) * 100 : 0;
  const readout = typeof showValue === "function" ? showValue(current) : showValue ? current : null;
  return (
    <div className={cx("rk-slider", className)} style={style}>
      {(label || readout !== null) && (
        <div className="rk-slider-head">
          {label && <label htmlFor={field.id}>{label}</label>}
          {readout !== null && <span className="rk-slider-value rk-num">{readout}</span>}
        </div>
      )}
      <input
        {...rest}
        {...field}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(event) => set(Number(event.target.value))}
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
