import { type HTMLAttributes, useEffect, useState } from "react";
import { cx } from "../lib/cx";
import { formatDuration } from "../lib/format";
import { useLatest } from "../lib/hooks";
import { Tooltip } from "./tooltip";

type DateInput = Date | number | string;

const toMs = (date: DateInput) => (date instanceof Date ? date.getTime() : new Date(date).getTime());

const UNITS: ReadonlyArray<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 365 * 86_400_000],
  ["month", 30 * 86_400_000],
  ["week", 7 * 86_400_000],
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
  ["second", 1000],
];

export interface RelativeTimeOptions {
  now?: number;
  locale?: string | string[];
  /** `long` "5 minutes ago", `short` "5 min. ago", `narrow` "5m ago". */
  style?: Intl.RelativeTimeFormatStyle;
}

/** "just now", "5 minutes ago", "in 2 days", "yesterday" — the largest unit that fits. */
export function formatRelativeTime(
  date: DateInput,
  { now = Date.now(), locale, style = "long" }: RelativeTimeOptions = {},
) {
  const diff = toMs(date) - now;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style });
  if (Math.abs(diff) < 10_000) return rtf.format(0, "second");
  for (const [unit, size] of UNITS) {
    if (Math.abs(diff) >= size || unit === "second") return rtf.format(Math.round(diff / size), unit);
  }
  return rtf.format(0, "second");
}

/** Delay until the relative text can change: every second for seconds, then per minute/hour/day. */
const tickFor = (diff: number) => {
  const abs = Math.abs(diff);
  if (abs < 60_000) return 1000;
  if (abs < 3_600_000) return 60_000;
  if (abs < 86_400_000) return 3_600_000;
  return 86_400_000;
};

/** Current time, re-read after `delay(now)` ms (`null` stops); `key` restarts it (unpause, new target). */
function useNow(delay: (now: number) => number | null, key: unknown) {
  const [now, setNow] = useState(() => Date.now());
  const next = useLatest(delay);
  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` is the restart trigger
  useEffect(() => {
    const ms = next.current(Date.now());
    if (ms === null) return;
    const id = setTimeout(() => setNow(Date.now()), ms);
    return () => clearTimeout(id);
  }, [now, next, key]);
  return now;
}

export interface RelativeTimeProps extends Omit<HTMLAttributes<HTMLTimeElement>, "children"> {
  date: DateInput;
  locale?: string | string[];
  /** `long` "5 minutes ago", `short` "5 min. ago", `narrow` "5m ago". */
  length?: Intl.RelativeTimeFormatStyle;
  /** Absolute date in a tooltip (default true). */
  tooltip?: boolean;
}

/**
 * Relative timestamp that keeps itself current ("updated 5 s ago" → "1 minute ago"), re-rendering only
 * when the text can change. The absolute date is in the tooltip and in `<time datetime>`.
 */
export function RelativeTime({
  date,
  locale,
  length,
  tooltip = true,
  className,
  ...rest
}: RelativeTimeProps) {
  const ms = toMs(date);
  const now = useNow((n) => tickFor(ms - n), ms);
  const absolute = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(ms);
  const node = (
    <time {...rest} dateTime={new Date(ms).toISOString()} className={cx("rk-relative-time", className)}>
      {formatRelativeTime(ms, { now, locale, style: length })}
    </time>
  );
  return tooltip ? <Tooltip content={absolute}>{node}</Tooltip> : node;
}

/** ISO 8601 duration for `<time datetime>`: PT1H2M3S. */
const isoDuration = (ms: number) => {
  const s = Math.floor(Math.abs(ms) / 1000);
  return `PT${Math.floor(s / 3600)}H${Math.floor((s % 3600) / 60)}M${s % 60}S`;
};

export interface TimerProps extends Omit<HTMLAttributes<HTMLTimeElement>, "children"> {
  /** Count up from this moment (session uptime). */
  since?: DateInput;
  /** Count down to this moment; stops at zero and calls `onEnd`. */
  until?: DateInput;
  /** `clock` 1:02:03 (default) or `units` 1h 2m. */
  format?: "clock" | "units";
  onEnd?: () => void;
  /** Frozen display (paused session). */
  paused?: boolean;
}

/** Ticking elapsed time or countdown, tabular so the digits don't jitter. */
export function Timer({ since, until, format = "clock", onEnd, paused, className, ...rest }: TimerProps) {
  const target = until !== undefined ? toMs(until) : since !== undefined ? toMs(since) : Date.now();
  const countdown = until !== undefined;
  const now = useNow(
    (n) => (paused || (countdown && n >= target) ? null : 1000 - (n % 1000)),
    `${paused}${target}`,
  );
  const ms = Math.max(0, countdown ? target - now : now - target);
  const ended = countdown && ms === 0;
  const onEndRef = useLatest(onEnd);
  useEffect(() => {
    if (ended) onEndRef.current?.();
  }, [ended, onEndRef]);
  return (
    <time
      role="timer"
      {...rest}
      dateTime={isoDuration(ms)}
      className={cx("rk-timer rk-num", className)}
      data-ended={ended || undefined}
    >
      {formatDuration(ms, { style: format }).text}
    </time>
  );
}
