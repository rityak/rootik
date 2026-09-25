import {
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { Floating } from "../lib/floating";
import type { Tone } from "./progress";

export interface TrackerItem {
  /** `idle` (or omitted) = no data: drawn hatched. */
  tone?: Tone | "idle";
  /** Accessible name and default tooltip: "Jun 12 — 99.9% uptime". */
  label: string;
  /** Richer tooltip content. */
  tooltip?: ReactNode;
}

export interface TrackerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: ReadonlyArray<TrackerItem>;
  /** Heading left, e.g. the node name. */
  label?: ReactNode;
  /** Heading right, e.g. "99.8% uptime". */
  summary?: ReactNode;
  /** Captions under the ends: "90 days ago" / "Today". */
  start?: ReactNode;
  end?: ReactNode;
  size?: "sm" | "md" | "lg";
}

/**
 * Status history as a row of thin bars (uptime per day, latency per hour). Hover or arrow keys reveal
 * each bar's tooltip; one roving tab stop for the whole row.
 */
export function Tracker({
  items,
  label,
  summary,
  start,
  end,
  size = "md",
  className,
  "aria-label": ariaLabel,
  ...rest
}: TrackerProps) {
  const list = useRef<HTMLUListElement>(null);
  const [focus, setFocus] = useState(items.length - 1);
  const [shown, setShown] = useState<number | null>(null);
  const current = shown === null ? undefined : items[shown];
  const anchor = useCallback(
    () => (shown === null ? null : (list.current?.children[shown]?.getBoundingClientRect() ?? null)),
    [shown],
  );

  const move = (event: KeyboardEvent) => {
    const step: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      Home: -items.length,
      End: items.length,
    };
    const delta = step[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    const next = Math.max(0, Math.min(items.length - 1, focus + delta));
    setFocus(next);
    (list.current?.children[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <div {...rest} className={cx("rk-tracker", className)} data-size={size}>
      {(label || summary) && (
        <div className="rk-tracker-head">
          <span>{label}</span>
          <span className="rk-num">{summary}</span>
        </div>
      )}
      <ul
        ref={list}
        aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
        className="rk-tracker-bars"
        onKeyDown={move}
        onPointerLeave={() => setShown(null)}
      >
        {items.map((item, i) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: bars are positional (time buckets)
            key={i}
            aria-label={item.label}
            tabIndex={i === focus ? 0 : -1}
            className="rk-tracker-bar"
            data-tone={item.tone === "idle" || item.tone === undefined ? undefined : item.tone}
            data-idle={item.tone === "idle" || item.tone === undefined || undefined}
            data-shown={shown === i || undefined}
            onPointerEnter={() => setShown(i)}
            onFocus={() => {
              setFocus(i);
              setShown(i);
            }}
            onBlur={() => setShown(null)}
          />
        ))}
      </ul>
      {(start || end) && (
        <div className="rk-tracker-foot">
          <span>{start}</span>
          <span>{end}</span>
        </div>
      )}
      {current && (
        <Floating open manual anchor={anchor} placement="top" aria-hidden="true" className="rk-tooltip">
          {current.tooltip ?? current.label}
        </Floating>
      )}
    </div>
  );
}
