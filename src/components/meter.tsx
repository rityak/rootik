import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { Legend, seriesColor } from "./charts";
import type { Tone } from "./progress";

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
  ...rest
}: MeterProps) {
  const total = sections ? sections.reduce((sum, s) => sum + s.value, 0) : (value ?? min);
  const span = max - min || 1;
  const pct = (v: number) => Math.min(100, Math.max(0, (v / span) * 100));
  const resolved = tone ?? meterTone(total, { min, max, low, high, optimum });
  const text = showValue === true ? `${Math.round(pct(total - min))}%` : showValue || null;
  const showLegend = sections !== undefined && (legend ?? sections.some((s) => s.label !== undefined));

  return (
    <div {...rest} className={cx("rk-meter", className)} data-size={size} data-tone={resolved}>
      {(label || text) && (
        <div className="rk-meter-head">
          <span>{label}</span>
          <span className="rk-num">{text}</span>
        </div>
      )}
      {/* biome-ignore lint/a11y/useSemanticElements: native <meter> can't hold stacked sections or be styled consistently */}
      <div
        role="meter"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={total}
        aria-label={typeof label === "string" ? label : undefined}
        className="rk-meter-track"
      >
        {sections ? (
          sections.map((s, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: sections are positional
              key={i}
              className="rk-meter-bar"
              data-section=""
              style={{ width: `${pct(s.value)}%`, background: s.color ?? seriesColor(i) }}
            />
          ))
        ) : (
          <div className="rk-meter-bar" style={{ width: `${pct(total - min)}%` }} />
        )}
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
