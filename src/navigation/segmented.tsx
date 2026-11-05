import { type ReactNode, useId, useRef } from "react";
import type { Size } from "../components/button";
import { useFieldLabel } from "../components/input";
import { SvgControlFrame, useSvgControlBorder } from "../components/svg-control-frame";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
import { useIndicator } from "../lib/indicator";
import type { SvgControlBorder } from "../lib/svg-geometry";
import { MotionLayer } from "../motion/layer";

/** A segment needs a name: a text `label`, or a `hint` (tooltip + accessible name) when it has none. */
export type SegmentOption<T extends string = string> = {
  value: T;
  icon?: ReactNode;
  disabled?: boolean;
} & ({ label: string; hint?: string } | { label?: ReactNode; hint: string });

export interface SegmentedControlProps<T extends string = string> {
  svgBorder?: SvgControlBorder;
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
  svgBorder,
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
  const border = useSvgControlBorder(svgBorder);
  const fieldLabel = useFieldLabel();
  const [current, set] = useControllable<T | undefined>(
    value,
    defaultValue ?? options.find((option) => !option.disabled)?.value,
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
      data-svg-border={border}
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
          data-svg-border={border}
        >
          {border ? <SvgControlFrame border={border} /> : <MotionLayer />}
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
