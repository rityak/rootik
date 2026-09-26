// Shared internals of the chart modules; not exported from the package.
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { ChartIcon, TableIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { IconButton } from "./button";
import { Table } from "./data";

const SERIES = Array.from({ length: 6 }, (_, i) => `var(--rk-chart-${i + 1})`);
/** Categorical color by fixed slot (never cycled past 6 — fold extras into "Other"). */
export const seriesColor = (i: number) => SERIES[Math.min(i, SERIES.length - 1)] as string;

const compact = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
export const formatCompact = (n: number) => compact.format(n);
const plain = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
/** Tables show exact numbers unless the chart was given its own format. */
export const exact = (format: (n: number) => string) =>
  format === formatCompact ? (n: number) => plain.format(n) : format;

export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry?.contentRect.width ?? 0)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Round tick values covering [min, max]. */
export function niceTicks(min: number, max: number, count = 4): number[] {
  const hi = max === min ? min + 1 : max;
  const raw = (hi - min) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = ([1, 2, 2.5, 5, 10].find((s) => s * mag >= raw) ?? 10) * mag;
  const out: number[] = [];
  for (let v = Math.floor(min / step) * step; v <= hi + step * 1e-9; v += step)
    out.push(Number(v.toFixed(10)));
  const last = out.at(-1) ?? 0;
  if (last < hi) out.push(last + step);
  return out;
}

/** Path of a bar with a rounded data-end and a square baseline. */
export function barPath(x: number, y: number, w: number, h: number, radius: number, horizontal = false) {
  const r = Math.max(0, Math.min(radius, w / 2, h));
  if (h <= 0) return "";
  return horizontal
    ? `M${x},${y}h${w - r}a${r},${r} 0 0 1 ${r},${r}v${h - 2 * r}a${r},${r} 0 0 1 -${r},${r}h-${w - r}z`
    : `M${x},${y + h}v-${h - r}a${r},${r} 0 0 1 ${r},-${r}h${w - 2 * r}a${r},${r} 0 0 1 ${r},${r}v${h - r}z`;
}

export interface Tip {
  x: number;
  y: number;
  content: ReactNode;
}

export function ChartTip({ tip }: { tip: Tip | null }) {
  if (!tip) return null;
  return (
    <div className="rk-chart-tip" style={{ left: tip.x, top: tip.y }}>
      {tip.content}
    </div>
  );
}

export interface LegendItem {
  label: ReactNode;
  color: string;
  shape?: "rect" | "line" | "dot";
}

export function Legend({ items, className }: { items: ReadonlyArray<LegendItem>; className?: string }) {
  return (
    <ul className={cx("rk-legend", className)}>
      {items.map((item, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: legend order is the identity
        <li key={i}>
          <span
            className="rk-legend-key"
            data-shape={item.shape ?? "rect"}
            style={{ background: item.color }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

/** Chart ⇄ table switch in a chart's top row (the table view is the accessible reading of any chart). */
export function TableToggle({ table, onToggle }: { table: boolean; onToggle: () => void }) {
  const labels = useLabels();
  return (
    <IconButton
      size="sm"
      className="rk-chart-toggle"
      icon={table ? <ChartIcon /> : <TableIcon />}
      label={table ? labels.showChart : labels.showTable}
      onClick={onToggle}
    />
  );
}

export function DataTableView({
  head,
  rows,
  label,
}: {
  head: ReadonlyArray<ReactNode>;
  rows: ReadonlyArray<ReadonlyArray<ReactNode>>;
  label?: string;
}) {
  return (
    <Table framed density="compact" aria-label={label} className="rk-chart-table">
      {head.some((h) => h !== "") && (
        <thead>
          <tr>
            {head.map((h, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: columns are positional
              <th key={i} style={{ textAlign: i === 0 ? "start" : "end" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row, r) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: rows follow the data order
          <tr key={r}>
            {row.map((cell, c) =>
              c === 0 ? (
                // biome-ignore lint/suspicious/noArrayIndexKey: columns are positional
                <th key={c} scope="row">
                  {cell}
                </th>
              ) : (
                // biome-ignore lint/suspicious/noArrayIndexKey: columns are positional
                <td key={c} className="rk-num" style={{ textAlign: "end" }}>
                  {cell}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export function HatchDef({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill="var(--rk-chart-idle)" opacity="0.35" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="var(--rk-text-3)" strokeWidth="1.5" opacity="0.55" />
      </pattern>
    </defs>
  );
}
