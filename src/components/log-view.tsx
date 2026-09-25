import { type CSSProperties, type HTMLAttributes, type ReactNode, useMemo, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
import { useLabels } from "../lib/labels";
import { useVirtual } from "../lib/virtual";
import { ChipGroup } from "./choice";
import { SearchInput } from "./input";
import { StickToBottom } from "./stick-to-bottom";

export type LogLevel = "trace" | "debug" | "info" | "warn" | "error";

export const LOG_LEVELS: readonly LogLevel[] = ["trace", "debug", "info", "warn", "error"];

const LEVEL_TAG: Record<LogLevel, string> = {
  trace: "TRACE",
  debug: "DEBUG",
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
};

export interface LogLine {
  message: string;
  level?: LogLevel;
  /** Epoch ms, Date or a preformatted string. */
  time?: number | Date | string;
  /** Logger / module / process name. */
  source?: string;
}

const REGEX_QUERY = /^\/(.+)\/([a-z]*)$/;
const SPECIAL = /[.*+?^${}()|[\]\\]/g;

/** A search query: `/regex/flags` when it parses, otherwise a case-insensitive substring. */
export function parseLogQuery(query: string): RegExp | null {
  const q = query.trim();
  if (!q) return null;
  const re = REGEX_QUERY.exec(q);
  if (re?.[1]) {
    try {
      const flags = re[2]?.includes("g") ? (re[2] ?? "") : `${re[2] ?? ""}g`;
      return new RegExp(re[1], flags);
    } catch {
      // an unfinished pattern searches literally until it parses
    }
  }
  return new RegExp(q.replace(SPECIAL, "\\$&"), "gi");
}

const matches = (re: RegExp, text: string) => {
  re.lastIndex = 0;
  return re.test(text);
};

/** Indices of the lines that pass the level set and the query (source is searched too). */
export function filterLog(
  lines: ReadonlyArray<LogLine>,
  levels: ReadonlyArray<LogLevel> | null,
  query: RegExp | null,
): number[] {
  const allowed = levels ? new Set(levels) : null;
  const out: number[] = [];
  lines.forEach((line, i) => {
    if (allowed && line.level && !allowed.has(line.level)) return;
    if (query && !matches(query, line.message) && !(line.source && matches(query, line.source))) return;
    out.push(i);
  });
  return out;
}

const pad = (n: number, w = 2) => String(n).padStart(w, "0");

/** HH:MM:SS.mmm in local time. */
export function formatLogTime(time: LogLine["time"]): string {
  if (time === undefined) return "";
  if (typeof time === "string") return time;
  const d = typeof time === "number" ? new Date(time) : time;
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
}

function highlight(text: string, query: RegExp | null): ReactNode {
  if (!query) return text;
  const parts: ReactNode[] = [];
  let last = 0;
  query.lastIndex = 0;
  for (const m of text.matchAll(query)) {
    const at = m.index ?? 0;
    if (!m[0]) continue;
    if (at > last) parts.push(text.slice(last, at));
    parts.push(<mark key={at}>{m[0]}</mark>);
    last = at + m[0].length;
  }
  if (last === 0) return text;
  parts.push(text.slice(last));
  return parts;
}

export interface LogViewProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  lines: ReadonlyArray<LogLine>;
  /** Visible levels (lines without a level always show). */
  levels?: LogLevel[];
  defaultLevels?: LogLevel[];
  onLevelsChange?: (levels: LogLevel[]) => void;
  /** Search text: substring, or `/regex/flags`. Matching lines only, matches highlighted. */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** Level chips with counts, the search field and `actions`; `false` hides the bar. */
  toolbar?: boolean;
  /** Toolbar-right slot: clear, download, pause. */
  actions?: ReactNode;
  showTime?: boolean;
  showSource?: boolean;
  lineNumbers?: boolean;
  /** Row height in px (rows are fixed-height for virtualization; long lines scroll sideways). */
  rowHeight?: number;
  timeFormat?: (time: NonNullable<LogLine["time"]>) => string;
  onLineClick?: (line: LogLine, index: number) => void;
  /** Accessible name of the log region. */
  label?: string;
}

/**
 * Log console: virtualized fixed-height rows, level filter with counts, text/regex search with
 * highlights, follow-tail (StickToBottom) with a "N new" jump button while scrolled up.
 */
export function LogView({
  lines,
  levels,
  defaultLevels = [...LOG_LEVELS],
  onLevelsChange,
  query,
  defaultQuery = "",
  onQueryChange,
  toolbar = true,
  actions,
  showTime = true,
  showSource = true,
  lineNumbers,
  rowHeight = 20,
  timeFormat = formatLogTime,
  onLineClick,
  label,
  className,
  style,
  ...rest
}: LogViewProps) {
  const labels = useLabels();
  const [shownLevels, setLevels] = useControllable(levels, defaultLevels, onLevelsChange);
  const [text, setText] = useControllable(query, defaultQuery, onQueryChange);
  const scroller = useRef<HTMLDivElement>(null);

  const matcher = useMemo(() => parseLogQuery(text), [text]);
  const visible = useMemo(() => filterLog(lines, shownLevels, matcher), [lines, shownLevels, matcher]);
  const counts = useMemo(() => {
    const c: Record<LogLevel, number> = { trace: 0, debug: 0, info: 0, warn: 0, error: 0 };
    for (const l of lines) if (l.level) c[l.level]++;
    return c;
  }, [lines]);

  // lines that arrived (and pass the filter) while the user was scrolled up
  const [seenAt, setSeenAt] = useState<number | null>(null);
  let unseen = 0;
  if (seenAt !== null) for (let i = visible.length - 1; i >= 0 && (visible[i] ?? 0) >= seenAt; i--) unseen++;

  const win = useVirtual({ count: visible.length, size: rowHeight, scrollRef: scroller, overscan: 10 });
  const digits = String(lines.length).length;

  return (
    <div
      {...rest}
      className={cx("rk-log", className)}
      style={{ "--rk-log-row": `${rowHeight}px`, "--rk-log-digits": digits, ...style } as CSSProperties}
    >
      {toolbar && (
        <div className="rk-log-toolbar">
          <ChipGroup
            size="sm"
            aria-label={labels.logLevels}
            options={LOG_LEVELS.map((l) => ({
              value: l,
              label: LEVEL_TAG[l].toLowerCase(),
              count: counts[l],
            }))}
            value={shownLevels}
            onChange={setLevels}
          />
          <SearchInput
            size="sm"
            className="rk-log-search"
            placeholder={labels.filter}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onClear={() => setText("")}
          />
          {actions && <div className="rk-log-actions">{actions}</div>}
        </div>
      )}
      <StickToBottom
        className="rk-log-body"
        viewportRef={scroller}
        viewportProps={{
          role: "log",
          // a fast log would flood a screen reader; the region is read on demand
          "aria-live": "off",
          "aria-label": label,
          tabIndex: 0,
        }}
        unseen={unseen}
        onFollowChange={(following) => setSeenAt(following ? null : lines.length)}
      >
        {visible.length === 0 ? (
          <div className="rk-log-empty">{lines.length === 0 ? labels.noData : labels.noResults}</div>
        ) : (
          <div className="rk-log-spacer" style={{ height: win.total }}>
            {win.items.map(({ index, start }) => {
              const n = visible[index] ?? 0;
              const line = lines[n];
              if (!line) return null;
              return (
                // biome-ignore lint/a11y/noStaticElementInteractions: optional pointer shortcut (open details)
                // biome-ignore lint/a11y/useKeyWithClickEvents: same
                <div
                  key={n}
                  className="rk-log-row"
                  data-level={line.level}
                  data-clickable={onLineClick ? true : undefined}
                  style={{ translate: `0 ${start}px` }}
                  onClick={onLineClick ? () => onLineClick(line, n) : undefined}
                >
                  {lineNumbers && <span className="rk-log-no">{n + 1}</span>}
                  {showTime && (
                    <span className="rk-log-time">
                      {line.time === undefined ? "" : timeFormat(line.time)}
                    </span>
                  )}
                  {line.level && <span className="rk-log-level">{LEVEL_TAG[line.level]}</span>}
                  {showSource && line.source && (
                    <span className="rk-log-source">{highlight(line.source, matcher)}</span>
                  )}
                  <span className="rk-log-msg">{highlight(line.message, matcher)}</span>
                </div>
              );
            })}
          </div>
        )}
      </StickToBottom>
    </div>
  );
}
