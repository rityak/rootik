import { type HTMLAttributes, type ReactNode, useState } from "react";
import { cx } from "../lib/cx";
import { useLabels } from "../lib/labels";
import {
  ChartTip,
  DataTableView,
  exact,
  formatCompact,
  Legend,
  niceTicks,
  seriesColor,
  TableToggle,
  useWidth,
} from "./chart-parts";

export interface ScatterPoint {
  x: number;
  y: number;
  /** Shown in the tooltip and the table (tag name, file). */
  label?: string;
}

export interface ScatterSeries {
  name: string;
  points: ReadonlyArray<ScatterPoint>;
  color?: string;
}

export type ScaleType = "linear" | "log";

export interface ScatterChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  series: ReadonlyArray<ScatterSeries>;
  xScale?: ScaleType;
  yScale?: ScaleType;
  xLabel?: ReactNode;
  yLabel?: ReactNode;
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
  height?: number;
  /** Legend (auto for ≥2 series). */
  legend?: boolean;
  tableView?: boolean;
  "aria-label"?: string;
}

/** Axis ticks: nice linear steps, or powers of ten on a log axis (non-positive values are dropped there). */
export function scaleTicks(min: number, max: number, type: ScaleType): number[] {
  if (type === "linear") return niceTicks(min, max, 4);
  const lo = Math.floor(Math.log10(min));
  const hi = Math.max(lo + 1, Math.ceil(Math.log10(max)));
  return Array.from({ length: hi - lo + 1 }, (_, i) => 10 ** (lo + i));
}

/** Two measures per item (frequency vs score): each point a dot, the nearest one under the pointer gets a tip. */
export function ScatterChart({
  series,
  xScale = "linear",
  yScale = "linear",
  xLabel,
  yLabel,
  formatX = formatCompact,
  formatY = formatCompact,
  height = 260,
  legend,
  tableView,
  className,
  ...rest
}: ScatterChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [asTable, setAsTable] = useState(false);
  const [hover, setHover] = useState<{ s: number; p: number } | null>(null);
  const strings = useLabels();
  const valid = (v: number, type: ScaleType) => Number.isFinite(v) && (type === "linear" || v > 0);
  const points = series.map((s) => s.points.filter((p) => valid(p.x, xScale) && valid(p.y, yScale)));
  const xs = points.flat().map((p) => p.x);
  const ys = points.flat().map((p) => p.y);
  const xTicks = xs.length > 0 ? scaleTicks(Math.min(...xs), Math.max(...xs), xScale) : [0, 1];
  const yTicks = ys.length > 0 ? scaleTicks(Math.min(...ys), Math.max(...ys), yScale) : [0, 1];
  const padL = yLabel ? 58 : 44;
  const padR = 12;
  const padT = 10;
  const padB = xLabel ? 40 : 24;
  const plotW = Math.max(0, width - padL - padR);
  const plotH = height - padT - padB;
  const t = (v: number, type: ScaleType) => (type === "log" ? Math.log10(v) : v);
  const map = (v: number, ticks: number[], type: ScaleType) => {
    const a = t(ticks[0] ?? 0, type);
    const b = t(ticks.at(-1) ?? 1, type);
    return (t(v, type) - a) / (b - a || 1);
  };
  const px = (v: number) => padL + map(v, xTicks, xScale) * plotW;
  const py = (v: number) => padT + plotH - map(v, yTicks, yScale) * plotH;
  const colorOf = (s: ScatterSeries, i: number) => s.color ?? seriesColor(i);
  const showLegend = legend ?? series.length > 1;
  const hot = hover ? points[hover.s]?.[hover.p] : undefined;

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const r = event.currentTarget.getBoundingClientRect();
    const mx = event.clientX - r.left;
    const my = event.clientY - r.top;
    let best: { s: number; p: number } | null = null;
    let bestD = 16 * 16; // hit radius well beyond the 4px dot
    points.forEach((list, s) => {
      list.forEach((p, i) => {
        const d = (px(p.x) - mx) ** 2 + (py(p.y) - my) ** 2;
        if (d < bestD) {
          bestD = d;
          best = { s, p: i };
        }
      });
    });
    setHover(best);
  };

  return (
    <div className={cx("rk-chart-frame", className)}>
      {(showLegend || tableView) && (
        <div className="rk-chart-top">
          {showLegend && (
            <Legend items={series.map((s, i) => ({ label: s.name, color: colorOf(s, i), shape: "dot" }))} />
          )}
          {tableView && <TableToggle table={asTable} onToggle={() => setAsTable(!asTable)} />}
        </div>
      )}
      {asTable ? (
        <DataTableView
          label={rest["aria-label"]}
          head={["", typeof xLabel === "string" ? xLabel : "x", typeof yLabel === "string" ? yLabel : "y"]}
          rows={series.flatMap((s) =>
            s.points.map((p) => [p.label ?? s.name, exact(formatX)(p.x), exact(formatY)(p.y)]),
          )}
        />
      ) : (
        <div
          ref={ref}
          role="img"
          aria-label={
            rest["aria-label"] ??
            `${strings.scatterChart}: ${series.map((s) => `${s.name} (${s.points.length})`).join(", ")}`
          }
          {...rest}
          className="rk-chart rk-scatter"
          style={{ height, ...rest.style }}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setHover(null)}
        >
          {width > 0 && (
            <svg width={width} height={height} aria-hidden="true">
              {yTicks.map((v) => (
                <g key={`y${v}`}>
                  <line x1={padL} x2={width - padR} y1={py(v)} y2={py(v)} stroke="var(--rk-chart-grid)" />
                  <text x={padL - 8} y={py(v) + 3.5} textAnchor="end" className="rk-chart-tick">
                    {formatY(v)}
                  </text>
                </g>
              ))}
              {xTicks.map((v) => (
                <g key={`x${v}`}>
                  <line x1={px(v)} x2={px(v)} y1={padT} y2={padT + plotH} stroke="var(--rk-chart-grid)" />
                  <text x={px(v)} y={padT + plotH + 16} textAnchor="middle" className="rk-chart-tick">
                    {formatX(v)}
                  </text>
                </g>
              ))}
              {xLabel && (
                <text x={padL + plotW / 2} y={height - 4} textAnchor="middle" className="rk-chart-label">
                  {xLabel}
                </text>
              )}
              {yLabel && (
                <text
                  transform={`translate(10 ${padT + plotH / 2}) rotate(-90)`}
                  textAnchor="middle"
                  className="rk-chart-label"
                >
                  {yLabel}
                </text>
              )}
              {points.map((list, s) =>
                list.map((p, i) => (
                  <circle
                    // biome-ignore lint/suspicious/noArrayIndexKey: points are positional
                    key={`${s}-${i}`}
                    cx={px(p.x)}
                    cy={py(p.y)}
                    r={hover?.s === s && hover.p === i ? 6 : 4}
                    fill={colorOf(series[s] as ScatterSeries, s)}
                    // surface ring keeps overlapping dots apart
                    stroke="var(--rk-surface-1)"
                    strokeWidth={1.5}
                    opacity={hover && !(hover.s === s && hover.p === i) ? 0.55 : 0.9}
                  />
                )),
              )}
            </svg>
          )}
          {hot && hover && (
            <ChartTip
              tip={{
                x: px(hot.x),
                y: py(hot.y) - 4,
                content: (
                  <>
                    <span className="rk-chart-tip-head">{hot.label ?? series[hover.s]?.name}</span>
                    <span className="rk-chart-tip-row">
                      <strong className="rk-num">{formatX(hot.x)}</strong>
                      <span>{typeof xLabel === "string" ? xLabel : "x"}</span>
                    </span>
                    <span className="rk-chart-tip-row">
                      <strong className="rk-num">{formatY(hot.y)}</strong>
                      <span>{typeof yLabel === "string" ? yLabel : "y"}</span>
                    </span>
                  </>
                ),
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
