import { type HTMLAttributes, type ReactNode, useId } from "react";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  ChevronRightIcon,
  ErrorIcon,
  InfoIcon,
  SuccessIcon,
  WarnIcon,
  XIcon,
} from "../lib/icons";
import { useLabels } from "../lib/labels";
import { CopyButton } from "./copy-button";
import type { Tone } from "./progress";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Header-right controls. */
  actions?: ReactNode;
  footer?: ReactNode;
  /**
   * default — surface; inverse — light spotlight card; glow — accent radial glow (featured);
   * outline — transparent with a line (nested groups); sunken — recessed well.
   */
  variant?: "default" | "inverse" | "glow" | "outline" | "sunken";
  padding?: "none" | "sm" | "md" | "lg";
  collapsible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hover lift for clickable cards. */
  interactive?: boolean;
}

export function Card({
  title,
  description,
  icon,
  actions,
  footer,
  variant = "default",
  padding = "md",
  collapsible,
  open,
  defaultOpen = true,
  onOpenChange,
  interactive,
  className,
  children,
  ...rest
}: CardProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const bodyId = useId();
  const hasHeader = title !== undefined || actions !== undefined;

  const heading = (
    <>
      {collapsible && <ChevronRightIcon className="rk-card-chevron" data-open={isOpen || undefined} />}
      {icon && <span className="rk-icon rk-card-icon">{icon}</span>}
      <span className="rk-card-titles">
        {title !== undefined && <span className="rk-card-title">{title}</span>}
        {description && <span className="rk-card-desc">{description}</span>}
      </span>
    </>
  );

  return (
    <section
      {...rest}
      className={cx("rk-card rk-surface", className)}
      data-variant={variant}
      data-padding={padding}
      data-interactive={interactive || undefined}
    >
      {hasHeader && (
        <header className="rk-card-header">
          {collapsible ? (
            <button
              type="button"
              className="rk-card-toggle"
              aria-expanded={isOpen}
              aria-controls={bodyId}
              onClick={() => setOpen(!isOpen)}
            >
              {heading}
            </button>
          ) : (
            <div className="rk-card-toggle">{heading}</div>
          )}
          {actions && <div className="rk-card-actions">{actions}</div>}
        </header>
      )}
      {collapsible ? (
        // stays mounted so it can animate (0fr ↔ 1fr) and keep its state; inert while closed
        <div id={bodyId} className="rk-card-collapse" data-open={isOpen || undefined} inert={!isOpen}>
          <div className="rk-card-collapse-inner">
            {children !== undefined && <div className="rk-card-body">{children}</div>}
            {footer && <footer className="rk-card-footer">{footer}</footer>}
          </div>
        </div>
      ) : (
        <>
          {children !== undefined && (
            <div id={bodyId} className="rk-card-body">
              {children}
            </div>
          )}
          {footer && <footer className="rk-card-footer">{footer}</footer>}
        </>
      )}
    </section>
  );
}

export interface StatProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  icon?: ReactNode;
  /** Relative change, e.g. 12.5 → "+12.5%". */
  delta?: number;
  deltaFormat?: (delta: number) => string;
  /** Lower is better (latency, errors): a drop is green. */
  invert?: boolean;
  /** Line under the value: context, comparison period. */
  hint?: ReactNode;
  /** Bottom slot: sparkline, progress. */
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

/** KPI: the number is the hero (large, light, tabular); label and unit stay small. */
export function Stat({
  label,
  value,
  unit,
  icon,
  delta,
  deltaFormat = (d) => `${d > 0 ? "+" : ""}${d}%`,
  invert,
  hint,
  size = "md",
  className,
  children,
  ...rest
}: StatProps) {
  const good = delta === undefined || delta === 0 ? undefined : delta > 0 !== Boolean(invert);
  return (
    <div {...rest} className={cx("rk-stat", className)} data-size={size}>
      <div className="rk-stat-head">
        {icon && <span className="rk-icon rk-stat-icon">{icon}</span>}
        <span className="rk-stat-label">{label}</span>
        {delta !== undefined && (
          <span
            className="rk-stat-delta rk-num"
            data-tone={good === undefined ? "neutral" : good ? "success" : "danger"}
          >
            {delta !== 0 && (delta > 0 ? <ArrowUpRightIcon /> : <ArrowDownRightIcon />)}
            {deltaFormat(delta)}
          </span>
        )}
      </div>
      <div className="rk-stat-value">
        <span className="rk-num">{value}</span>
        {unit && <span className="rk-stat-unit">{unit}</span>}
      </div>
      {hint && <div className="rk-stat-hint">{hint}</div>}
      {children}
    </div>
  );
}

export function SectionLabel({
  children,
  action,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { action?: ReactNode }) {
  return (
    <div {...rest} className={cx("rk-section-label", className)}>
      <span className="rk-truncate">{children}</span>
      {action}
    </div>
  );
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
  size?: "sm" | "md";
}

export function EmptyState({ icon, title, hint, action, size = "md", className, ...rest }: EmptyStateProps) {
  return (
    <div {...rest} className={cx("rk-empty", className)} data-size={size}>
      {icon && <span className="rk-empty-icon rk-icon">{icon}</span>}
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
  tone?: Tone;
  title?: ReactNode;
  /** `false` hides the icon; a node replaces it. */
  icon?: ReactNode | false;
  actions?: ReactNode;
  onDismiss?: () => void;
}

export function Callout({
  tone = "info",
  title,
  icon,
  actions,
  onDismiss,
  className,
  children,
  ...rest
}: CalloutProps) {
  return (
    <div
      role={tone === "danger" || tone === "warn" ? "alert" : "status"}
      {...rest}
      className={cx("rk-callout", className)}
      data-tone={tone}
    >
      {icon !== false && <span className="rk-icon rk-callout-icon">{icon ?? CALLOUT_ICON[tone]}</span>}
      <div className="rk-callout-body">
        {title && <div className="rk-callout-title">{title}</div>}
        {children && <div className="rk-callout-text">{children}</div>}
        {actions && <div className="rk-callout-actions">{actions}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="rk-callout-close" aria-label="Dismiss" onClick={onDismiss}>
          <XIcon />
        </button>
      )}
    </div>
  );
}

/** Indented group with a guide line: nested settings, sub-options of a toggle. */
export function Nest({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={cx("rk-nest", className)} />;
}

export function Divider({
  label,
  vertical,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { label?: ReactNode; vertical?: boolean }) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: <hr> cannot hold a label
    <div
      role="separator"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      {...rest}
      className={cx("rk-divider", className)}
      data-vertical={vertical || undefined}
    >
      {label && <span>{label}</span>}
    </div>
  );
}

export interface KeyValueItem {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  /** Copy button next to the value (IDs, hashes, IPs): the text to copy, or `true` for a string value. */
  copy?: string | boolean;
}

export interface KeyValueProps extends HTMLAttributes<HTMLDListElement> {
  items: ReadonlyArray<KeyValueItem>;
  /** rows — label left, value right (detail panels); grid — label above value in columns. */
  layout?: "rows" | "grid";
}

export function KeyValue({ items, layout = "rows", className, ...rest }: KeyValueProps) {
  const labels = useLabels();
  return (
    <dl {...rest} className={cx("rk-kv", className)} data-layout={layout}>
      {items.map((item, i) => {
        const text =
          item.copy === true
            ? typeof item.value === "string"
              ? item.value
              : undefined
            : item.copy || undefined;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: order is the identity of a static list
          <div key={i} className="rk-kv-item">
            <dt>
              {item.icon && <span className="rk-icon">{item.icon}</span>}
              {item.label}
            </dt>
            <dd>
              {text === undefined ? (
                item.value
              ) : (
                <span className="rk-kv-copyable">
                  <span className="rk-kv-value">{item.value}</span>
                  <CopyButton
                    size="sm"
                    value={text}
                    label={typeof item.label === "string" ? `${labels.copy}: ${item.label}` : undefined}
                    className="rk-kv-copy"
                  />
                </span>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
