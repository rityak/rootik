import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { ErrorIcon, InfoIcon, SuccessIcon, WarnIcon, XIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { OverlayDecoration, type OverlaySurfaceOptions, overlaySurfaceStyle } from "../overlays/surface";
import type { Tone } from "./progress";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  surface?: OverlaySurfaceOptions;
  icon?: ReactNode;
  title: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
  size?: "sm" | "md";
  /**
   * Result states (done, failed, no access, offline): tints the icon well and, without an `icon`,
   * picks the tone's own. Default is the neutral hatched "nothing here yet".
   */
  tone?: Tone;
}

export function EmptyState({
  icon,
  title,
  hint,
  action,
  size = "md",
  tone,
  surface,
  style,
  className,
  ...rest
}: EmptyStateProps) {
  const glyph = icon ?? (tone && tone !== "neutral" && tone !== "accent" ? CALLOUT_ICON[tone] : undefined);
  return (
    <div
      {...rest}
      className={cx("rk-empty rk-feedback-surface rk-overlay", className)}
      data-size={size}
      data-tone={tone}
      data-surface={surface ? "" : undefined}
      style={{ ...overlaySurfaceStyle(surface), ...style }}
    >
      <OverlayDecoration surface={surface} />
      {glyph && <span className="rk-empty-icon rk-icon">{glyph}</span>}
      <div className="rk-empty-title">{title}</div>
      {hint && <div className="rk-empty-hint">{hint}</div>}
      {action && <div className="rk-empty-action">{action}</div>}
    </div>
  );
}

const CALLOUT_ICON: Partial<Record<Tone, ReactNode>> = {
  info: <InfoIcon />,
  accent: <InfoIcon />,
  neutral: <InfoIcon />,
  success: <SuccessIcon />,
  warn: <WarnIcon />,
  danger: <ErrorIcon />,
};

export interface CalloutProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  surface?: OverlaySurfaceOptions;
  tone?: Tone;
  title?: ReactNode;
  /** `false` hides the icon; a node replaces it. */
  icon?: ReactNode | false;
  actions?: ReactNode;
  onDismiss?: () => void;
  /**
   * Announce it: set when the callout appears in response to something (a failed save). Static callouts
   * stay silent, otherwise every warning on a page interrupts the screen reader when it loads.
   */
  live?: boolean;
}

export function Callout({
  tone = "info",
  surface,
  style,
  title,
  icon,
  actions,
  onDismiss,
  live,
  className,
  children,
  ...rest
}: CalloutProps) {
  const strings = useLabels();
  return (
    <div
      role={live ? (tone === "danger" ? "alert" : "status") : undefined}
      {...rest}
      className={cx("rk-callout rk-feedback-surface rk-overlay", className)}
      data-tone={tone}
      data-surface={surface ? "" : undefined}
      style={{ ...overlaySurfaceStyle(surface), ...style }}
    >
      <OverlayDecoration surface={surface} />
      {icon !== false && <span className="rk-icon rk-callout-icon">{icon ?? CALLOUT_ICON[tone]}</span>}
      <div className="rk-callout-body">
        {title && <div className="rk-callout-title">{title}</div>}
        {children && <div className="rk-callout-text">{children}</div>}
        {actions && <div className="rk-callout-actions">{actions}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="rk-callout-close" aria-label={strings.dismiss} onClick={onDismiss}>
          <XIcon />
        </button>
      )}
    </div>
  );
}
