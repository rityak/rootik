import { type HTMLAttributes, type ReactNode, useId } from "react";
import { Legend, seriesColor } from "../charts/chart-parts";
import { cx } from "../lib/cx";
import { finite } from "../lib/svg-geometry";
import { MotionLayer } from "../motion/layer";
import type { Tone } from "./progress";
import { type FeedbackDecoration, FeedbackTrack } from "./track";

export interface MeterThresholds {
  min?: number;
  max?: number;
  /** Upper bound of the low region. */
  low?: number;
  /** Lower bound of the high region. */
  high?: number;
  /** Best value: its region is good, the next one is a warning, the far one is bad. */
  optimum?: number;
}

/**
 * Tone of a value by the HTML `<meter>` rules: the region holding `optimum` is success, an adjacent
 * region warn, the opposite one danger. Without `low`/`high` it's the accent.
 */
export function meterTone(value: number, { min = 0, max = 100, low, high, optimum }: MeterThresholds): Tone {
  if (low === undefined && high === undefined) return "accent";
  const lo = Math.max(min, low ?? min);
  const hi = Math.min(max, high ?? max);
  const best = optimum ?? (min + max) / 2;
  const region = (v: number) => (v < lo ? 0 : v > hi ? 2 : 1);
  const distance = Math.abs(region(value) - region(best));
  return distance === 0 ? "success" : distance === 1 ? "warn" : "danger";
}

export interface MeterSection {
  value: number;
  label?: ReactNode;
  /** Defaults to the chart series colour of its index. */
  color?: string;
}

export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, "children">, MeterThresholds {
  decoration?: FeedbackDecoration;
  /** Single measurement; use `sections` for a stacked breakdown instead. */
  value?: number;
  /** Stacked parts (disk: system / apps / cache); the rest up to `max` is hatched. */
  sections?: ReadonlyArray<MeterSection>;
  /** Overrides the threshold tone. */
  tone?: Tone;
  label?: ReactNode;
  /** Text right of the label; `true` shows value / max in percent. */
  showValue?: boolean | ReactNode;
  /** Legend under a sectioned meter (default true when sections have labels). */
  legend?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * A measurement within a known range (disk, quota, CPU, battery) — not task progress. Thresholds colour
 * the bar like `<meter>`; sections stack a breakdown. The empty rest is hatched.
 */
export function Meter({
  value,
  decoration,
  sections,
  min = 0,
  max = 100,
  low,
  high,
  optimum,
  tone,
  label,
  showValue,
  legend,
  size = "md",
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": labelledBy,
  ...rest
}: MeterProps) {
  const labelId = useId();
  const valid = Number.isFinite(min) && Number.isFinite(max) && max > min && Number.isFinite(max - min);
  const lower = valid ? min : 0,
    upper = valid ? max : 100;
  const span = upper - lower;
  let remaining = span;
  const parts = sections?.map((section) => {
    const amount = finite(section.value, 0, 0, remaining);
    remaining -= amount;
    return { ...section, value: amount };
  });
  const total = parts ? upper - remaining : finite(value, lower, lower, upper);
  const pct = (v: number) => Math.min(100, Math.max(0, (v / span) * 100));
  const resolved = tone ?? meterTone(total, { min: lower, max: upper, low, high, optimum });
  const text = showValue === true ? `${Math.round(pct(total - lower))}%` : showValue || null;
  const showLegend = sections !== undefined && (legend ?? sections.some((s) => s.label !== undefined));

  return (
    <div {...rest} className={cx("rk-meter", className)} data-size={size} data-tone={resolved}>
      {(label || text) && (
        <div className="rk-meter-head">
          <span id={labelId}>{label}</span>
          <span className="rk-num">{text}</span>
        </div>
      )}
      {/* biome-ignore lint/a11y/useSemanticElements: native <meter> can't hold stacked sections or be styled consistently */}
      <div
        role="meter"
        aria-valuemin={lower}
        aria-valuemax={upper}
        aria-valuenow={total}
        aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
        aria-labelledby={labelledBy ?? (ariaLabel === undefined && label != null ? labelId : undefined)}
        className="rk-meter-track"
      >
        {parts ? (
          parts.map((s, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: sections are positional
              key={i}
              className="rk-meter-bar"
              data-section=""
              style={{ width: `${pct(s.value)}%`, background: s.color ?? seriesColor(i) }}
            />
          ))
        ) : (
          <div className="rk-meter-bar" style={{ width: `${pct(total - lower)}%` }}>
            <MotionLayer key={total} active />
          </div>
        )}
        <FeedbackTrack decoration={decoration} />
      </div>
      {showLegend && (
        <Legend
          items={sections.map((s, i) => ({
            label: s.label ?? "",
            color: s.color ?? seriesColor(i),
          }))}
        />
      )}
    </div>
  );
}
