import { type CSSProperties, type HTMLAttributes, type ReactNode, useId } from "react";
import { cx } from "../lib/cx";
import { useLabels } from "../lib/labels";
import { finite } from "../lib/svg-geometry";
import { MotionLayer } from "../motion/layer";
import { useAppearanceValue } from "../theme/provider";
import { type FeedbackAnimation, type FeedbackDecoration, FeedbackTrack } from "./track";

export type Tone = "neutral" | "accent" | "success" | "warn" | "danger" | "info";

export function Spinner({
  size = 16,
  className,
  label,
  variant = "default",
  animation = "loop",
}: {
  size?: number | string;
  className?: string;
  label?: string;
  variant?: "default" | "orbit";
  animation?: FeedbackAnimation;
}) {
  const labels = useLabels();
  const svg = useAppearanceValue("svgShapes");
  const appearanceStyle = useAppearanceValue("style");
  return (
    <span
      role="status"
      aria-label={label ?? labels.loading}
      className={cx("rk-spinner", className)}
      data-variant={
        variant === "orbit" && svg !== false && appearanceStyle !== "fluent" ? "orbit" : undefined
      }
      data-animation={animation}
      style={{ "--rk-size": typeof size === "number" ? `${size}px` : size } as CSSProperties}
    >
      {variant === "orbit" && svg !== false && appearanceStyle !== "fluent" && (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="9" stroke="currentColor" opacity=".2" strokeWidth="2" />
          <path d="M12 3a9 9 0 0 1 9 9M12 21a9 9 0 0 1-9-9" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
    </span>
  );
}

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  decoration?: FeedbackDecoration;
  animation?: FeedbackAnimation;
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
  decoration,
  animation = "loop",
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
  const labelId = useId();
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current = value === undefined ? undefined : finite(value, 0, 0, limit);
  const pct = current === undefined ? undefined : (current / limit) * 100;
  const text = showValue === true && pct !== undefined ? `${Math.round(pct)}%` : showValue || null;
  return (
    <div
      {...rest}
      className={cx("rk-progress", className)}
      data-size={size}
      data-tone={tone}
      data-variant={variant === "edge" ? "edge" : undefined}
      data-animation={animation}
    >
      {(label || text) && variant !== "edge" && (
        <div className="rk-progress-head">
          <span id={labelId}>{label}</span>
          <span className="rk-num">{text}</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={current}
        aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
        aria-labelledby={labelledBy ?? (ariaLabel === undefined && label != null ? labelId : undefined)}
        className="rk-progress-track"
        data-indeterminate={pct === undefined || undefined}
      >
        <div className="rk-progress-bar" style={pct === undefined ? undefined : { width: `${pct}%` }}>
          {pct !== undefined && <MotionLayer key={pct} active />}
        </div>
        <FeedbackTrack decoration={decoration} />
      </div>
    </div>
  );
}

export interface ProgressRingProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  variant?: "continuous" | "segmented";
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
  variant = "continuous",
  max = 100,
  size = 48,
  thickness = 4,
  tone = "accent",
  className,
  children,
  ...rest
}: ProgressRingProps) {
  const id = `rk-ring-${useId().replaceAll(":", "")}`;
  const svg = useAppearanceValue("svgShapes");
  const appearanceStyle = useAppearanceValue("style");
  const segmented = variant === "segmented" && svg !== false && appearanceStyle !== "fluent";
  size = finite(size, 48, 8, 4096);
  thickness = finite(thickness, 4, 0.5, size / 2);
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current = finite(value, 0, 0, limit);
  const pct = current / limit;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      {...rest}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={limit}
      aria-valuenow={current}
      className={cx("rk-ring", className)}
      data-tone={tone}
      style={{ width: size, height: size, ...rest.style }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false">
        {segmented && (
          <defs>
            <mask id={id}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="white"
                strokeWidth={thickness + 1}
                strokeDasharray={`${(c / 24) * 0.72} ${(c / 24) * 0.28}`}
              />
            </mask>
          </defs>
        )}
        <g mask={segmented ? `url(#${id})` : undefined}>
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
        </g>
      </svg>
      <span className="rk-ring-label rk-num">{children ?? `${Math.round(pct * 100)}`}</span>
    </div>
  );
}

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  animation?: FeedbackAnimation;
  width?: number | string;
  height?: number | string;
  /** Rounded like a pill / circle. */
  round?: boolean;
  /** Render N text lines. */
  lines?: number;
}

export function Skeleton({
  width,
  height,
  round,
  lines,
  animation = "loop",
  className,
  style,
  ...rest
}: SkeletonProps) {
  if (lines)
    return (
      <div
        {...rest}
        className={cx("rk-skeleton-lines", className)}
        data-animation={animation}
        style={style}
        aria-hidden="true"
      >
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
      data-animation={animation}
      data-round={round || undefined}
      style={{ width, height, ...style }}
    />
  );
}
