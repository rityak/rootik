import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { useLabels } from "../lib/labels";
import type { Tone } from "./progress";

export interface IndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** Number in the mark; omit for a plain dot. */
  count?: number;
  /** Counts above this show as "99+". */
  max?: number;
  /** Hide the mark (default: hidden when `count` is 0). */
  show?: boolean;
  tone?: Tone;
  position?: "top-end" | "top-start" | "bottom-end" | "bottom-start";
  /** Round target (avatar, round icon button): the mark sits on the circle's edge, not the box corner. */
  round?: boolean;
  /** Gentle pulse for "live" / needs attention. */
  pulse?: boolean;
  /** Screen-reader text, e.g. "3 unread"; defaults to the count, or labels.newItems for a dot. */
  label?: string;
  /** The element the mark is pinned to. */
  children: ReactNode;
}

/** A dot or count pinned to the corner of any element: avatars, icon buttons, nav items. */
export function Indicator({
  count,
  max = 99,
  show,
  tone = "danger",
  position = "top-end",
  round,
  pulse,
  label,
  className,
  children,
  ...rest
}: IndicatorProps) {
  const labels = useLabels();
  const visible = show ?? (count === undefined || count > 0);
  const text = count === undefined ? undefined : count > max ? `${max}+` : String(count);
  return (
    <span {...rest} className={cx("rk-indicator-anchor", className)}>
      {children}
      {visible && (
        <span
          className="rk-indicator-mark"
          data-tone={tone}
          data-position={position}
          data-round={round || undefined}
          data-count={text === undefined ? undefined : true}
          data-pulse={pulse || undefined}
        >
          <span aria-hidden="true">{text}</span>
          <span className="rk-sr-only">{label ?? text ?? labels.newItems}</span>
        </span>
      )}
    </span>
  );
}
