import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { formatCompact } from "./charts";

export interface BarsListItem {
  name: string;
  value: number;
  icon?: ReactNode;
}

export interface BarsListProps extends Omit<HTMLAttributes<HTMLUListElement>, "children"> {
  data: ReadonlyArray<BarsListItem>;
  /** Bar scale; default the largest value (a total gives share-of-whole bars). */
  max?: number;
  /** Keep the order given instead of sorting by value, descending. */
  keepOrder?: boolean;
  /** Show the top N; the rest fold into one row named `otherLabel`. */
  limit?: number;
  otherLabel?: string;
  valueFormat?: (value: number) => string;
  /** Second value column, e.g. the share of the total. */
  showPercent?: boolean;
  /** Names drawn in the accent (the highlighted datum). */
  highlight?: ReadonlyArray<string>;
  onItemClick?: (item: BarsListItem) => void;
}

/** Top-N as rows: name on a bar sized by value (the remainder hatched), value on the right. */
export function BarsList({
  data,
  max,
  keepOrder,
  limit,
  otherLabel = "Other",
  valueFormat = formatCompact,
  showPercent,
  highlight,
  onItemClick,
  className,
  ...rest
}: BarsListProps) {
  let rows = keepOrder ? [...data] : [...data].sort((a, b) => b.value - a.value);
  if (limit !== undefined && rows.length > limit) {
    const folded = rows.slice(limit).reduce((n, r) => n + r.value, 0);
    rows = [...rows.slice(0, limit), { name: otherLabel, value: folded }];
  }
  const total = data.reduce((n, r) => n + r.value, 0);
  const scale = max ?? Math.max(0, ...rows.map((r) => r.value));
  const percent = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 });
  return (
    <ul {...rest} className={cx("rk-bars", className)} data-percent={showPercent || undefined}>
      {rows.map((row, i) => {
        const share = scale > 0 ? Math.max(0, Math.min(1, row.value / scale)) : 0;
        const content = (
          <>
            <span className="rk-bars-track">
              <span className="rk-bars-fill" style={{ "--rk-bar": share } as CSSProperties} />
              <span className="rk-bars-name">
                {row.icon && <span className="rk-icon">{row.icon}</span>}
                <span className="rk-truncate">{row.name}</span>
              </span>
            </span>
            <span className="rk-bars-value rk-num">{valueFormat(row.value)}</span>
            {showPercent && (
              <span className="rk-bars-pct rk-num">
                {total > 0 ? percent.format(row.value / total) : "—"}
              </span>
            )}
          </>
        );
        return (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: names may repeat ("Other"); order is the identity
            key={i}
            className="rk-bars-row"
            data-highlight={highlight?.includes(row.name) || undefined}
            data-other={
              limit !== undefined && i === rows.length - 1 && data.length > limit ? true : undefined
            }
          >
            {onItemClick ? (
              <button type="button" className="rk-bars-button" onClick={() => onItemClick(row)}>
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  );
}
