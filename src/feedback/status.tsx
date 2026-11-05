import type { HTMLAttributes, ReactNode } from "react";
import { SvgControlFrame, useSvgControlBorder } from "../components/svg-control-frame";
import { cx } from "../lib/cx";
import { XIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import type { SvgControlBorder } from "../lib/svg-geometry";
import type { Tone } from "./progress";
import type { FeedbackAnimation } from "./track";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  svgBorder?: SvgControlBorder;
  tone?: Tone;
  variant?: "soft" | "solid" | "outline";
  size?: "sm" | "md";
  icon?: ReactNode;
  /** Raw leading media instead of the square icon slot. */
  media?: ReactNode;
  /** Leading status dot. */
  dot?: boolean;
  /** Makes it a removable tag. */
  onRemove?: () => void;
  removeLabel?: string;
}

export function Badge({
  tone = "neutral",
  svgBorder,
  variant = "soft",
  size = "md",
  icon,
  media,
  dot,
  onRemove,
  removeLabel,
  className,
  children,
  ...rest
}: BadgeProps) {
  const strings = useLabels();
  const border = useSvgControlBorder(svgBorder);
  return (
    <span
      {...rest}
      className={cx("rk-badge", className)}
      data-tone={tone}
      data-variant={variant}
      data-size={size}
      data-svg-border={border}
    >
      {border && <SvgControlFrame border={border} />}
      {dot && <span className="rk-badge-dot" />}
      {media ? (
        <span className="rk-badge-media">{media}</span>
      ) : (
        icon && <span className="rk-icon">{icon}</span>
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          className="rk-badge-remove"
          aria-label={removeLabel ?? strings.remove}
          onClick={onRemove}
        >
          <XIcon />
        </button>
      )}
    </span>
  );
}

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  animation?: FeedbackAnimation;
  tone?: Tone;
  /** Animated halo: live / connecting. */
  pulse?: boolean;
  /** What the dot means ("Online", "Running"). Required: a dot alone is color only. */
  label: ReactNode;
  /** Label for screen readers only (plus a hover title), for dense rows and nav badges. */
  hideLabel?: boolean;
}

export function StatusDot({
  tone = "success",
  pulse,
  animation = "loop",
  label,
  hideLabel,
  className,
  ...rest
}: StatusDotProps) {
  return (
    <span
      title={hideLabel && typeof label === "string" ? label : undefined}
      {...rest}
      className={cx("rk-status", className)}
      data-tone={tone}
      data-animation={animation}
    >
      <span className="rk-status-dot" data-pulse={pulse || undefined} aria-hidden="true" />
      <span className={hideLabel ? "rk-sr-only" : undefined}>{label}</span>
    </span>
  );
}
