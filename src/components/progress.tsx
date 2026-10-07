import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { useLabels } from "../lib/labels";

export type Tone = "neutral" | "accent" | "success" | "warn" | "danger" | "info";

export function Spinner({
  size = 16,
  className,
  label,
}: {
  size?: number | string;
  className?: string;
  label?: string;
}) {
  const labels = useLabels();
  return (
    <span
      role="status"
      aria-label={label ?? labels.loading}
      className={cx("rk-spinner", className)}
      style={{ "--rk-size": typeof size === "number" ? `${size}px` : size } as CSSProperties}
    />
  );
}

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Omit for indeterminate. */
  value?: number;
  max?: number;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  /** Caption above the bar (left). */
  label?: ReactNode;
  /** Value text above the bar (right). `true` shows a percentage. */
  showValue?: boolean | ReactNode;
  /**
   * edge — a thin bar along the bottom edge of the nearest positioned parent (a card, a tile), clipped to its
   * corners, no hatch, no caption. Name it with `aria-label`.
   */
  variant?: "default" | "edge";
}

/** Linear progress. The remainder is hatched — "the rest" in Rootik's visual language. */
export function Progress({
  value,
  max = 100,
  tone = "accent",
  size = "md",
  label,
  showValue,
  variant = "default",
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": labelledBy,
  ...rest
}: ProgressProps) {
  const pct = value === undefined ? undefined : max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const text = showValue === true && pct !== undefined ? `${Math.round(pct)}%` : showValue || null;
  return (
    <div
      {...rest}
      className={cx("rk-progress", className)}
      data-size={size}
      data-tone={tone}
      data-variant={variant === "edge" ? "edge" : undefined}
    >
      {(label || text) && variant !== "edge" && (
        <div className="rk-progress-head">
          <span>{label}</span>
          <span className="rk-num">{text}</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
        aria-labelledby={labelledBy}
        className="rk-progress-track"
        data-indeterminate={pct === undefined || undefined}
      >
        <div className="rk-progress-bar" style={pct === undefined ? undefined : { width: `${pct}%` }} />
      </div>
    </div>
  );
}

export interface ProgressRingProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  tone?: Tone;
  /** Center content; defaults to the percentage. */
  children?: ReactNode;
}

export function ProgressRing({
  value,
  max = 100,
  size = 48,
  thickness = 4,
  tone = "accent",
  className,
  children,
  ...rest
}: ProgressRingProps) {
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      {...rest}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cx("rk-ring", className)}
      data-tone={tone}
      style={{ width: size, height: size, ...rest.style }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="rk-ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={thickness} />
        <circle
          className="rk-ring-bar"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={thickness}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <span className="rk-ring-label rk-num">{children ?? `${Math.round(pct * 100)}`}</span>
    </div>
  );
}

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  /** Rounded like a pill / circle. */
  round?: boolean;
  /** Render N text lines. */
  lines?: number;
}

export function Skeleton({ width, height, round, lines, className, style, ...rest }: SkeletonProps) {
  if (lines)
    return (
      <div {...rest} className={cx("rk-skeleton-lines", className)} style={style} aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
          <div key={i} className="rk-skeleton" style={{ width: i === lines - 1 ? "60%" : "100%" }} />
        ))}
      </div>
    );
  return (
    <div
      {...rest}
      aria-hidden="true"
      className={cx("rk-skeleton", className)}
      data-round={round || undefined}
      style={{ width, height, ...style }}
    />
  );
}
