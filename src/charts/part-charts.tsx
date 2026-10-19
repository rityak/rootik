import { type CSSProperties, type HTMLAttributes, type ReactNode, useId, useState } from "react";
import { cx } from "../lib/cx";
import { useLabels } from "../lib/labels";
import {
  barPath,
  ChartTip,
  DataTableView,
  exact,
  formatCompact,
  HatchDef,
  Legend,
  niceTicks,
  seriesColor,
  TableToggle,
  useWidth,
} from "./chart-parts";

export interface PartDatum {
  label: string;
  value: number;
  /** Defaults to the categorical slot by index; fold past 6 parts into "Other". */
  color?: string;
}

const colorOf = (d: { color?: string }, i: number) => d.color ?? seriesColor(i);
const sum = (values: ReadonlyArray<number>) => values.reduce((a, b) => a + b, 0);
const percent = (part: number, total: number) => `${Math.round((part / (total || 1)) * 100)}%`;

/** Chart with an optional table view: the frame every chart here shares. */
function Frame({
  legend,
  tableView,
  table,
  className,
  children,
}: {
  legend?: ReactNode;
  tableView?: boolean;
  table: () => ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const [asTable, setAsTable] = useState(false);
  return (
    <div className={cx("rk-chart-frame", className)}>
      {(legend || tableView) && (
        <div className="rk-chart-top">
          {legend}
          {tableView && <TableToggle table={asTable} onToggle={() => setAsTable(!asTable)} />}
        </div>
      )}
      {asTable ? table() : children}
    </div>
  );
}

/* ── StackedBarChart ───────────────────────────────────────────── */

export interface StackSeries {
  name: string;
  /** One value per category. */
  data: ReadonlyArray<number>;
  color?: string;
}

export interface StackedBarChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  categories: ReadonlyArray<string>;
  series: ReadonlyArray<StackSeries>;
  height?: number;
  format?: (value: number) => string;
  /** Every column scaled to 100% (composition instead of totals). */
  normalize?: boolean;
  tableView?: boolean;
  "aria-label"?: string;
}

/** Columns split by series: totals and their composition per category. */
export function StackedBarChart({
  categories,
  series,
  height = 220,
  format = formatCompact,
  normalize,
  tableView,
  className,
  ...rest
}: StackedBarChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const strings = useLabels();
  const totals = categories.map((_, c) => sum(series.map((s) => s.data[c] ?? 0)));
  const ticks = normalize ? [0, 0.25, 0.5, 0.75, 1] : niceTicks(0, Math.max(0, ...totals), 4);
  const top = ticks.at(-1) || 1;
  const fmtTick = normalize ? (n: number) => `${Math.round(n * 100)}%` : format;
  const padL = 40;
  const padB = 22;
  const padT = 10;
  const plotW = Math.max(0, width - padL);
  const plotH = height - padB - padT;
  const band = plotW / Math.max(1, categories.length);
  const barW = Math.min(28, band * 0.6);
  const y = (v: number) => padT + plotH - (v / top) * plotH;
  const labelEvery = Math.ceil(categories.length / Math.max(1, Math.floor(plotW / 56)));

  return (
    <Frame
      className={className}
      tableView={tableView}
      legend={<Legend items={series.map((s, i) => ({ label: s.name, color: colorOf(s, i) }))} />}
      table={() => (
        <DataTableView
          label={rest["aria-label"]}
          head={["", ...series.map((s) => s.name), strings.total]}
          rows={categories.map((c, i) => [
            c,
            ...series.map((s) => exact(format)(s.data[i] ?? 0)),
            exact(format)(totals[i] ?? 0),
          ])}
        />
      )}
    >
      <div
        ref={ref}
        role="img"
        aria-label={
          rest["aria-label"] ??
          `${strings.stackedBarChart}: ${categories.map((c, i) => `${c} ${format(totals[i] ?? 0)}`).join(", ")}`
        }
        {...rest}
        className="rk-chart"
        style={{ height, ...rest.style }}
      >
        {width > 0 && (
          <svg width={width} height={height} aria-hidden="true">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={padL} x2={width} y1={y(t)} y2={y(t)} stroke="var(--rk-chart-grid)" />
                <text x={padL - 8} y={y(t) + 3.5} textAnchor="end" className="rk-chart-tick">
                  {fmtTick(t)}
                </text>
              </g>
            ))}
            {categories.map((c, ci) => {
              const cx0 = padL + band * ci + band / 2;
              const total = totals[ci] ?? 0;
              let acc = 0;
              const last = series.findLastIndex((s) => (s.data[ci] ?? 0) > 0);
              return (
                <g
                  key={c}
                  className="rk-chart-bar"
                  data-hot={hover === ci || undefined}
                  onPointerEnter={() => setHover(ci)}
                  onPointerLeave={() => setHover(null)}
                >
                  <rect x={cx0 - band / 2} y={padT} width={band} height={plotH} fill="transparent" />
                  {series.map((s, si) => {
                    const raw = s.data[ci] ?? 0;
                    const v = normalize ? raw / (total || 1) : raw;
                    const y0 = y(acc);
                    acc += v;
                    // 2px surface gap between stacked fills
                    const h = Math.max(0, y0 - y(acc) - (si === last ? 0 : 2));
                    return (
                      <path
                        key={s.name}
                        d={barPath(cx0 - barW / 2, y(acc), barW, h, si === last ? 4 : 0)}
                        fill={colorOf(s, si)}
                      />
                    );
                  })}
                  {ci % labelEvery === 0 && (
                    <text x={cx0} y={height - 6} textAnchor="middle" className="rk-chart-tick">
                      {c}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}
        {hover !== null && (
          <ChartTip
            tip={{
              x: padL + band * hover + band / 2,
              y: y(normalize ? 1 : (totals[hover] ?? 0)),
              content: (
                <>
                  <span className="rk-chart-tip-head">
                    {categories[hover]} · {format(totals[hover] ?? 0)}
                  </span>
                  {series.map((s, i) => (
                    <span key={s.name} className="rk-chart-tip-row">
                      <span className="rk-legend-key" style={{ background: colorOf(s, i) }} />
                      <strong className="rk-num">{format(s.data[hover] ?? 0)}</strong>
                      <span>{s.name}</span>
                    </span>
                  ))}
                </>
              ),
            }}
          />
        )}
      </div>
    </Frame>
  );
}

/* ── DonutChart ────────────────────────────────────────────────── */

export interface DonutChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  data: ReadonlyArray<PartDatum>;
  size?: number;
  thickness?: number;
  format?: (value: number) => string;
  /** Caption under the total in the hole. */
  label?: ReactNode;
  /** Legend with values and shares beside the ring. */
  legend?: boolean;
  tableView?: boolean;
  "aria-label"?: string;
}

function arc(ox: number, oy: number, R: number, r: number, a0: number, a1: number) {
  const at = (rad: number, a: number) =>
    `${(ox + rad * Math.sin(a)).toFixed(2)},${(oy - rad * Math.cos(a)).toFixed(2)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${at(R, a0)}A${R},${R} 0 ${large} 1 ${at(R, a1)}L${at(r, a1)}A${r},${r} 0 ${large} 0 ${at(r, a0)}Z`;
}

/** Part of a whole with the total in the hole. Hovering a part (or its legend row) shows it in the center. */
export function DonutChart({
  data,
  size = 168,
  thickness = 18,
  format = formatCompact,
  label,
  legend = true,
  tableView,
  className,
  ...rest
}: DonutChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const strings = useLabels();
  const total = sum(data.map((d) => d.value));
  const R = size / 2;
  const r = R - thickness;
  const gap = data.filter((d) => d.value > 0).length > 1 ? 2 / R : 0;
  let acc = 0;
  const arcs = data.map((d) => {
    const a0 = (acc / (total || 1)) * Math.PI * 2;
    acc += d.value;
    const a1 = Math.min((acc / (total || 1)) * Math.PI * 2, Math.PI * 2 - 1e-4);
    return a1 - a0 > gap ? arc(R, R, R, r, a0 + gap / 2, a1 - gap / 2) : "";
  });
  const hot = hover === null ? undefined : data[hover];

  return (
    <Frame
      className={className}
      tableView={tableView}
      table={() => (
        <DataTableView
          label={rest["aria-label"]}
          head={["", "", ""]}
          rows={data.map((d) => [d.label, exact(format)(d.value), percent(d.value, total)])}
        />
      )}
    >
      <div
        role="img"
        aria-label={
          rest["aria-label"] ??
          `${strings.donutChart}: ${data.map((d) => `${d.label} ${format(d.value)} (${percent(d.value, total)})`).join(", ")}`
        }
        {...rest}
        className="rk-donut"
      >
        <div className="rk-donut-ring" style={{ width: size, height: size }}>
          <svg width={size} height={size} aria-hidden="true">
            {total === 0 && (
              <circle
                cx={R}
                cy={R}
                r={R - thickness / 2}
                fill="none"
                stroke="var(--rk-chart-idle)"
                strokeWidth={thickness}
              />
            )}
            {arcs.map((d, i) => (
              <path
                // biome-ignore lint/suspicious/noArrayIndexKey: parts are positional
                key={i}
                d={d}
                fill={colorOf(data[i] ?? {}, i)}
                opacity={hover === null || hover === i ? 1 : 0.35}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
              />
            ))}
          </svg>
          <div className="rk-donut-center" aria-hidden="true">
            <span className="rk-donut-value rk-num">{format(hot ? hot.value : total)}</span>
            <span className="rk-donut-label">{hot ? hot.label : label}</span>
          </div>
        </div>
        {legend && (
          <ul className="rk-donut-legend">
            {data.map((d, i) => (
              <li
                key={d.label}
                data-dim={(hover !== null && hover !== i) || undefined}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
              >
                <span className="rk-legend-key" style={{ background: colorOf(d, i) }} />
                <span className="rk-donut-legend-label">{d.label}</span>
                <span className="rk-num">{format(d.value)}</span>
                <span className="rk-donut-share rk-num">{percent(d.value, total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Frame>
  );
}

/* ── WaffleChart ───────────────────────────────────────────────── */

/** Cells per part out of `cells`, by largest remainder so shares round to the right total. */
export function waffleCells(values: ReadonlyArray<number>, total: number, cells = 100): number[] {
  const exactCells = values.map((v) => (v / (total || 1)) * cells);
  const out = exactCells.map(Math.floor);
  const target = Math.min(cells, Math.round(sum(exactCells)));
  const order = exactCells.map((v, i) => [v - Math.floor(v), i] as const).sort((a, b) => b[0] - a[0]);
  for (let k = 0; sum(out) < target && k < order.length; k++) {
    const i = order[k]?.[1] as number;
    out[i] = (out[i] ?? 0) + 1;
  }
  return out;
}

export interface WaffleChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  data: ReadonlyArray<PartDatum>;
  /** Whole the parts are out of; defaults to their sum. The unfilled rest is hatched. */
  total?: number;
  /** Grid side: 10 → 100 cells, each one percent. */
  side?: number;
  format?: (value: number) => string;
  legend?: boolean;
  "aria-label"?: string;
}

/** Part of a whole as a grid of cells; countable, and the hatched rest reads as "not yet". */
export function WaffleChart({
  data,
  total: totalProp,
  side = 10,
  format = formatCompact,
  legend = true,
  className,
  ...rest
}: WaffleChartProps) {
  const strings = useLabels();
  const total = totalProp ?? sum(data.map((d) => d.value));
  const counts = waffleCells(
    data.map((d) => d.value),
    total,
    side * side,
  );
  const cells = counts.flatMap((n, i) => Array.from({ length: n }, () => i));
  return (
    <div className={cx("rk-chart-frame", className)}>
      <div
        role="img"
        aria-label={
          rest["aria-label"] ??
          `${strings.waffleChart}: ${data.map((d) => `${d.label} ${format(d.value)} (${percent(d.value, total)})`).join(", ")}`
        }
        {...rest}
        className="rk-waffle"
        style={{ "--rk-waffle-side": side, ...rest.style } as CSSProperties}
      >
        {Array.from({ length: side * side }, (_, k) => {
          const part = cells[k];
          return (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional
              key={k}
              className="rk-waffle-cell"
              data-rest={part === undefined || undefined}
              style={part === undefined ? undefined : { background: colorOf(data[part] ?? {}, part) }}
            />
          );
        })}
      </div>
      {legend && (
        <Legend
          items={data.map((d, i) => ({
            label: `${d.label} · ${percent(d.value, total)}`,
            color: colorOf(d, i),
          }))}
        />
      )}
    </div>
  );
}

/* ── Treemap ───────────────────────────────────────────────────── */

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Squarified treemap (Bruls et al.): rects in input order, laid out largest first. */
export function treemapLayout(values: ReadonlyArray<number>, width: number, height: number): Rect[] {
  const total = sum(values);
  const out: Rect[] = values.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));
  if (total <= 0 || width <= 0 || height <= 0) return out;
  const scale = (width * height) / total;
  const order = values
    .map((v, i) => [Math.max(0, v) * scale, i] as const)
    .filter(([a]) => a > 0)
    .sort((a, b) => b[0] - a[0]);
  let x = 0;
  let y = 0;
  let w = width;
  let h = height;
  const worst = (areas: ReadonlyArray<number>, side: number) => {
    const s = sum(areas);
    return Math.max(
      (side * side * Math.max(...areas)) / (s * s),
      (s * s) / (side * side * Math.min(...areas)),
    );
  };
  const place = (items: ReadonlyArray<readonly [number, number]>) => {
    const s = sum(items.map(([a]) => a));
    if (w >= h) {
      const colW = s / h;
      let yy = y;
      for (const [a, i] of items) {
        out[i] = { x, y: yy, w: colW, h: a / colW };
        yy += a / colW;
      }
      x += colW;
      w -= colW;
    } else {
      const rowH = s / w;
      let xx = x;
      for (const [a, i] of items) {
        out[i] = { x: xx, y, w: a / rowH, h: rowH };
        xx += a / rowH;
      }
      y += rowH;
      h -= rowH;
    }
  };
  let row: Array<readonly [number, number]> = [];
  for (const item of order) {
    const side = Math.min(w, h);
    const areas = row.map(([a]) => a);
    if (row.length === 0 || worst([...areas, item[0]], side) <= worst(areas, side)) row.push(item);
    else {
      place(row);
      row = [item];
    }
  }
  if (row.length > 0) place(row);
  return out;
}

export interface TreemapProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  data: ReadonlyArray<PartDatum>;
  height?: number;
  format?: (value: number) => string;
  tableView?: boolean;
  "aria-label"?: string;
}

/** Composition by area (dataset classes, disk usage). Parts past the 6 categorical slots share one grey. */
export function Treemap({
  data,
  height = 240,
  format = formatCompact,
  tableView,
  className,
  ...rest
}: TreemapProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const strings = useLabels();
  const total = sum(data.map((d) => d.value));
  const rects = treemapLayout(
    data.map((d) => d.value),
    width,
    height,
  );
  const fill = (d: PartDatum, i: number) => d.color ?? (i < 6 ? seriesColor(i) : "var(--rk-chart-idle)");
  const hot = hover === null ? undefined : rects[hover];
  const hotDatum = hover === null ? undefined : data[hover];
  return (
    <Frame
      className={className}
      tableView={tableView}
      table={() => (
        <DataTableView
          label={rest["aria-label"]}
          head={["", "", ""]}
          rows={data.map((d) => [d.label, exact(format)(d.value), percent(d.value, total)])}
        />
      )}
    >
      <div
        ref={ref}
        role="img"
        aria-label={
          rest["aria-label"] ??
          `${strings.treemap}: ${data.map((d) => `${d.label} ${format(d.value)} (${percent(d.value, total)})`).join(", ")}`
        }
        {...rest}
        className="rk-chart rk-treemap"
        style={{ height, ...rest.style }}
      >
        {width > 0 && (
          <svg width={width} height={height} aria-hidden="true">
            {rects.map((r, i) => {
              const d = data[i];
              if (!d || r.w <= 0) return null;
              // 1px inset on every side → a 2px surface gap between neighbours
              const w = Math.max(0, r.w - 2);
              const h = Math.max(0, r.h - 2);
              const fits = w > 56 && h > 34;
              return (
                <g
                  key={d.label}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  data-dim={(hover !== null && hover !== i) || undefined}
                  data-idle={(!d.color && i >= 6) || undefined}
                >
                  <rect
                    x={r.x + 1}
                    y={r.y + 1}
                    width={w}
                    height={h}
                    rx={Math.min(6, w / 2, h / 2)}
                    fill={fill(d, i)}
                  />
                  {fits && (
                    <>
                      <text x={r.x + 9} y={r.y + 19} className="rk-treemap-label">
                        {d.label.length * 7 > w - 16
                          ? `${d.label.slice(0, Math.max(1, Math.floor((w - 16) / 7) - 1))}…`
                          : d.label}
                      </text>
                      <text x={r.x + 9} y={r.y + 34} className="rk-treemap-value">
                        {format(d.value)}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        )}
        {hot && hotDatum && (
          <ChartTip
            tip={{
              x: hot.x + hot.w / 2,
              y: hot.y + 4,
              content: (
                <>
                  <strong className="rk-num">{format(hotDatum.value)}</strong>
                  <span>
                    {hotDatum.label} · {percent(hotDatum.value, total)}
                  </span>
                </>
              ),
            }}
          />
        )}
      </div>
    </Frame>
  );
}

/* ── BulletChart ───────────────────────────────────────────────── */

export interface BulletChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: ReactNode;
  value: number;
  target?: number;
  /** Upper edges of qualitative bands (poor / ok / good), ascending; the last one is the scale max. */
  ranges?: ReadonlyArray<number>;
  max?: number;
  format?: (value: number) => string;
  /** Text after the value (unit, "of 10k"). */
  hint?: ReactNode;
}

/** Value against a target over qualitative bands, in one line: KPI rows that need context. */
export function BulletChart({
  label,
  value,
  target,
  ranges = [],
  max: maxProp,
  format = formatCompact,
  hint,
  className,
  ...rest
}: BulletChartProps) {
  const strings = useLabels();
  const hatchId = useId();
  const max = maxProp ?? Math.max(value, target ?? 0, ...ranges) * (ranges.length > 0 ? 1 : 1.1);
  const pct = (v: number) => `${Math.min(100, Math.max(0, (v / (max || 1)) * 100))}%`;
  const spoken = `${typeof label === "string" ? label : ""} ${format(value)}${target !== undefined ? `, ${strings.target} ${format(target)}` : ""}`;
  return (
    <div {...rest} className={cx("rk-bullet", className)}>
      <div className="rk-bullet-head">
        <span className="rk-bullet-label">{label}</span>
        <span className="rk-bullet-value rk-num">
          {format(value)}
          {hint && <span className="rk-bullet-hint"> {hint}</span>}
        </span>
      </div>
      <div className="rk-bullet-track" role="img" aria-label={spoken.trim()}>
        <svg width="100%" height="100%" aria-hidden="true" preserveAspectRatio="none">
          <HatchDef id={hatchId} />
          {/* beyond the last band (or with no bands): hatched rest */}
          <rect x={pct(ranges.at(-1) ?? 0)} width="100%" height="100%" fill={`url(#${hatchId})`} />
          {ranges.map((edge, i) => {
            const from = i === 0 ? 0 : (ranges[i - 1] ?? 0);
            return (
              // poor → good: the lowest band is the most visible
              <rect
                key={edge}
                x={pct(from)}
                width={`${Math.max(0, (Math.min(edge, max) - from) / (max || 1)) * 100}%`}
                height="100%"
                fill="var(--rk-text-3)"
                opacity={Math.max(0.1, 0.46 - i * 0.16)}
              />
            );
          })}
        </svg>
        <span className="rk-bullet-bar" style={{ width: pct(value) }} />
        {target !== undefined && <span className="rk-bullet-target" style={{ left: pct(target) }} />}
      </div>
    </div>
  );
}
