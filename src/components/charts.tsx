import { type HTMLAttributes, type ReactNode, useId, useState } from "react";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
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
  type Tip,
  useWidth,
} from "./chart-parts";
import { RangeSlider } from "./slider";

export { formatCompact, Legend, type LegendItem, niceTicks, seriesColor } from "./chart-parts";

export interface SparklineProps extends HTMLAttributes<HTMLDivElement> {
  data: ReadonlyArray<number>;
  height?: number;
  color?: string;
  /** Soft area under the line. */
  area?: boolean;
  /** Dot on the last point. */
  endDot?: boolean;
}

/** Inline trend, no axes: pairs with Stat. */
export function Sparkline({
  data,
  height = 36,
  color = "var(--rk-accent)",
  area = true,
  endDot = true,
  className,
  ...rest
}: SparklineProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pad = 4;
  const x = (i: number) => pad + (i / Math.max(1, data.length - 1)) * (width - pad * 2);
  const y = (v: number) => pad + (1 - (v - min) / (max - min || 1)) * (height - pad * 2);
  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  const last = data.length - 1;
  return (
    <div
      ref={ref}
      {...rest}
      className={cx("rk-sparkline", className)}
      style={{ height, ...rest.style }}
      aria-hidden="true"
    >
      {width > 0 && data.length > 1 && (
        <svg width={width} height={height} aria-hidden="true">
          {area && <path d={`${line}L${x(last)},${height}L${x(0)},${height}Z`} fill={color} opacity={0.12} />}
          <path
            d={line}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {endDot && (
            <circle
              cx={x(last)}
              cy={y(data[last] ?? 0)}
              r={4}
              fill={color}
              stroke="var(--rk-surface-1)"
              strokeWidth={2}
            />
          )}
        </svg>
      )}
    </div>
  );
}

export interface BarDatum {
  label: string;
  value: number;
}

export interface BarChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  data: ReadonlyArray<BarDatum>;
  height?: number;
  /** Label of the datum to emphasize in accent. */
  highlight?: string;
  /** solid — all bars in `color`; hatch — idle bars hatched, highlight/hover solid (Rootik signature). */
  variant?: "solid" | "hatch";
  color?: string;
  orientation?: "vertical" | "horizontal";
  format?: (value: number) => string;
  /** Dashed target line with a chip. */
  reference?: { value: number; label?: string };
  /** Value labels: at the highlighted bar only, all, or none. */
  labels?: "highlight" | "all" | "none";
  max?: number;
  /** Chart ⇄ table toggle in a top row. */
  tableView?: boolean;
  /** Bars fill their band with a 2px gap (histograms, many bars). */
  dense?: boolean;
  "aria-label"?: string;
}

export function BarChart({
  data,
  height = 200,
  highlight,
  variant = "solid",
  color = "var(--rk-chart-1)",
  orientation = "vertical",
  format = formatCompact,
  reference,
  labels = "highlight",
  max: maxProp,
  tableView,
  dense,
  className,
  ...rest
}: BarChartProps) {
  const [asTable, setAsTable] = useState(false);
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const strings = useLabels();
  const hatchId = useId();
  const horizontal = orientation === "horizontal";
  const dataMax = Math.max(0, ...data.map((d) => d.value), reference?.value ?? 0);
  const ticks = niceTicks(0, maxProp ?? dataMax, horizontal ? 4 : 4);
  const top = ticks.at(-1) ?? 1;

  const fill = (i: number, d: BarDatum) => {
    const hot = d.label === highlight || i === hover;
    if (variant === "hatch") return hot ? "var(--rk-accent)" : `url(#${hatchId})`;
    if (d.label === highlight) return "var(--rk-accent)";
    // with a highlight, the rest steps back so the accent isn't competing with a near hue
    return highlight === undefined ? color : `color-mix(in oklab, ${color} 40%, transparent)`;
  };
  const showLabel = (d: BarDatum) => labels === "all" || (labels === "highlight" && d.label === highlight);

  const tipFor = (d: BarDatum, x: number, y: number): Tip => ({
    x,
    y,
    content: (
      <>
        <strong className="rk-num">{format(d.value)}</strong>
        <span>{d.label}</span>
      </>
    ),
  });

  let svg: ReactNode = null;
  if (width > 0 && !horizontal) {
    const padL = 36;
    const padB = 22;
    const padT = 18;
    const plotW = width - padL;
    const plotH = height - padB - padT;
    const band = plotW / Math.max(1, data.length);
    const barW = dense ? Math.max(1, band - 2) : Math.min(24, band * 0.6);
    const labelEvery = Math.ceil(data.length / Math.max(1, Math.floor(plotW / 56)));
    const y = (v: number) => padT + plotH - (v / top) * plotH;
    svg = (
      <svg width={width} height={height} aria-hidden="true">
        <HatchDef id={hatchId} />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={width} y1={y(t)} y2={y(t)} stroke="var(--rk-chart-grid)" />
            <text x={padL - 8} y={y(t) + 3.5} textAnchor="end" className="rk-chart-tick">
              {format(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx0 = padL + band * i + band / 2;
          const h = Math.max(0, y(0) - y(d.value));
          return (
            <g
              key={d.label}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              className="rk-chart-bar"
              data-hot={i === hover || undefined}
            >
              <rect x={cx0 - band / 2} y={padT} width={band} height={plotH} fill="transparent" />
              {variant === "hatch" && !dense && (
                <path d={barPath(cx0 - barW / 2, padT, barW, plotH, barW / 2)} fill="var(--rk-hover)" />
              )}
              <path
                d={barPath(cx0 - barW / 2, y(d.value), barW, h, variant === "hatch" && !dense ? barW / 2 : 4)}
                fill={fill(i, d)}
              />
              {showLabel(d) && (
                <text x={cx0} y={y(d.value) - 6} textAnchor="middle" className="rk-chart-value">
                  {format(d.value)}
                </text>
              )}
              {(i % labelEvery === 0 || d.label === highlight) && (
                <text
                  x={dense ? cx0 - band / 2 : cx0}
                  y={height - 6}
                  textAnchor={dense ? "start" : "middle"}
                  className="rk-chart-tick"
                  data-hot={d.label === highlight || undefined}
                >
                  {dense ? d.label.split("–")[0] : d.label}
                </text>
              )}
            </g>
          );
        })}
        {reference && (
          <g className="rk-chart-ref">
            <line x1={padL} x2={width} y1={y(reference.value)} y2={y(reference.value)} />
            <text x={width - 4} y={y(reference.value) - 5} textAnchor="end">
              {reference.label ?? format(reference.value)}
            </text>
          </g>
        )}
      </svg>
    );
  } else if (width > 0) {
    const labelW = Math.min(160, width * 0.35);
    const valueW = 48;
    const rowH = 26;
    const barH = 12;
    const plotW = width - labelW - valueW;
    const h = data.length * rowH;
    svg = (
      <svg width={width} height={h} aria-hidden="true">
        <HatchDef id={hatchId} />
        {data.map((d, i) => {
          const w = (d.value / top) * plotW;
          const cy = i * rowH + rowH / 2;
          return (
            <g
              key={d.label}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              className="rk-chart-bar"
              data-hot={i === hover || undefined}
            >
              <rect x={0} y={i * rowH} width={width} height={rowH} fill="transparent" />
              <text x={labelW - 10} y={cy + 4} textAnchor="end" className="rk-chart-label">
                {d.label.length > 24 ? `${d.label.slice(0, 23)}…` : d.label}
              </text>
              {variant === "hatch" && (
                <path
                  d={barPath(labelW, cy - barH / 2, plotW, barH, barH / 2, true)}
                  fill="var(--rk-hover)"
                />
              )}
              <path d={barPath(labelW, cy - barH / 2, w, barH, 4, true)} fill={fill(i, d)} />
              <text x={labelW + w + 6} y={cy + 4} className="rk-chart-value">
                {format(d.value)}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  const hovered = hover !== null ? data[hover] : undefined;
  let tip: Tip | null = null;
  if (hovered && hover !== null && width > 0 && !horizontal) {
    const band = (width - 36) / Math.max(1, data.length);
    tip = tipFor(hovered, 36 + band * hover + band / 2, 18 + (height - 40) * (1 - hovered.value / top));
  }

  const chart = (
    <div
      ref={ref}
      role="img"
      aria-label={
        rest["aria-label"] ??
        `${strings.barChart}: ${data.map((d) => `${d.label} ${format(d.value)}`).join(", ")}`
      }
      {...rest}
      className={cx("rk-chart", !tableView && className)}
      style={{ minHeight: horizontal ? undefined : height, ...rest.style }}
    >
      {svg}
      <ChartTip tip={tip} />
    </div>
  );
  if (!tableView) return chart;
  return (
    <div className={cx("rk-chart-frame", className)}>
      <div className="rk-chart-top">
        <TableToggle table={asTable} onToggle={() => setAsTable(!asTable)} />
      </div>
      {asTable ? (
        <DataTableView
          label={rest["aria-label"]}
          head={["", ""]}
          rows={data.map((d) => [d.label, exact(format)(d.value)])}
        />
      ) : (
        chart
      )}
    </div>
  );
}

export interface Bin extends BarDatum {
  /** Bin edges: [x0, x1), the last bin includes its upper edge. */
  x0: number;
  x1: number;
}

/**
 * Equal-width bins over `values` (nice edges from `niceTicks`). Labels read "x0–x1"; a dense BarChart
 * shows the lower edge on the axis.
 */
export function bin(
  values: ReadonlyArray<number>,
  {
    count,
    domain,
    format = formatCompact,
  }: { count?: number; domain?: [number, number]; format?: (n: number) => string } = {},
): Bin[] {
  if (values.length === 0) return [];
  const lo = domain?.[0] ?? Math.min(...values);
  const hi = domain?.[1] ?? Math.max(...values);
  // Sturges' rule: fine for the few-thousand-sample distributions dashboards show
  const edges = niceTicks(lo, hi, count ?? Math.ceil(Math.log2(values.length) + 1));
  const bins: Bin[] = edges.slice(0, -1).map((x0, i) => {
    const x1 = edges[i + 1] as number;
    return { x0, x1, value: 0, label: `${format(x0)}–${format(x1)}` };
  });
  const first = edges[0] as number;
  const step = (edges[1] ?? first + 1) - first;
  for (const v of values) {
    if (v < lo || v > hi) continue;
    const b = bins[Math.min(bins.length - 1, Math.floor((v - first) / step))];
    if (b) b.value++;
  }
  return bins;
}

export interface HistogramProps extends Omit<BarChartProps, "data" | "dense" | "orientation"> {
  values: ReadonlyArray<number>;
  bins?: number;
  domain?: [number, number];
  /** Formats bin edges; `format` formats counts. */
  formatEdge?: (n: number) => string;
}

/** Distribution of raw values: `bin()` + a dense BarChart. */
export function Histogram({ values, bins, domain, formatEdge, ...rest }: HistogramProps) {
  return <BarChart {...rest} dense data={bin(values, { count: bins, domain, format: formatEdge })} />;
}

export interface LineSeries {
  name: string;
  data: ReadonlyArray<number | null>;
  /** Defaults to the categorical slot by index. */
  color?: string;
}

export interface LineChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  series: ReadonlyArray<LineSeries>;
  /** X labels (same length as data). */
  labels?: ReadonlyArray<string>;
  height?: number;
  /** Wash under each line. */
  area?: boolean;
  format?: (value: number) => string;
  /** Start the y-axis at zero (default) or fit to data. */
  zero?: boolean;
  /** Show legend (auto for ≥2 series). */
  legend?: boolean;
  /** Chart ⇄ table toggle next to the legend. */
  tableView?: boolean;
  /** Overview strip with a range slider below the chart: zoom into long series (training runs). */
  brush?: boolean;
  /** Visible index window [from, to] when `brush` is on. */
  range?: [number, number];
  defaultRange?: [number, number];
  onRangeChange?: (range: [number, number]) => void;
  "aria-label"?: string;
}

/** Lines over time with a snapping crosshair; tooltip lists every series at that x. */
export function LineChart({ brush, range, defaultRange, onRangeChange, ...rest }: LineChartProps) {
  return brush ? (
    <BrushedLineChart {...rest} range={range} defaultRange={defaultRange} onRangeChange={onRangeChange} />
  ) : (
    <LinePlot {...rest} />
  );
}

function BrushedLineChart({ range, defaultRange, onRangeChange, className, ...rest }: LineChartProps) {
  const strings = useLabels();
  const [ref, width] = useWidth<HTMLDivElement>();
  const len = Math.max(0, ...rest.series.map((s) => s.data.length));
  const [[from, to], setRange] = useControllable<[number, number]>(
    range,
    defaultRange ?? [0, Math.max(0, len - 1)],
    onRangeChange,
  );
  const h = 32;
  const values = rest.series.flatMap((s) => s.data.filter((v): v is number => v !== null));
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const x = (i: number) => (i / Math.max(1, len - 1)) * width;
  const y = (v: number) => 2 + (1 - (v - lo) / (hi - lo || 1)) * (h - 4);
  const label = (i: number) => rest.labels?.[i] ?? String(i + 1);
  return (
    <div className={cx("rk-chart-frame", className)}>
      <LinePlot
        {...rest}
        series={rest.series.map((s) => ({ ...s, data: s.data.slice(from, to + 1) }))}
        labels={rest.labels?.slice(from, to + 1)}
      />
      <div className="rk-chart-brush">
        <RangeSlider
          label={strings.visibleRange}
          min={0}
          max={Math.max(1, len - 1)}
          minDistance={1}
          value={[from, to]}
          onChange={setRange}
          showValue={([a, b]) => `${label(a)} – ${label(b)}`}
        />
        <div ref={ref} className="rk-chart-brush-overview" aria-hidden="true">
          {width > 0 && (
            <svg width={width} height={h} aria-hidden="true">
              {rest.series.map((s, i) => (
                <path
                  key={s.name}
                  d={s.data
                    .map((v, j) =>
                      v === null
                        ? ""
                        : `${j && s.data[j - 1] != null ? "L" : "M"}${x(j).toFixed(1)},${y(v).toFixed(1)}`,
                    )
                    .join("")}
                  fill="none"
                  stroke={s.color ?? seriesColor(i)}
                  strokeWidth={1.25}
                />
              ))}
              <rect x={0} width={x(from)} height={h} className="rk-chart-brush-shade" />
              <rect
                x={x(to)}
                width={Math.max(0, width - x(to))}
                height={h}
                className="rk-chart-brush-shade"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

function LinePlot({
  series,
  labels,
  height = 220,
  area,
  format = formatCompact,
  zero = true,
  legend,
  tableView,
  className,
  ...rest
}: LineChartProps) {
  const [asTable, setAsTable] = useState(false);
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const strings = useLabels();
  const len = Math.max(0, ...series.map((s) => s.data.length));
  // spoken summary, language-neutral: "loss 0.9→0.35 (0.35–0.9)"; the table view has every value
  const summary = (line: LineSeries) => {
    const nums = line.data.filter((n): n is number => n !== null);
    const first = nums[0];
    const last = nums.at(-1);
    if (first === undefined || last === undefined) return line.name;
    return `${line.name} ${format(first)}→${format(last)} (${format(Math.min(...nums))}–${format(Math.max(...nums))})`;
  };
  const values = series.flatMap((s) => s.data.filter((v): v is number => v !== null));
  const lo = zero ? Math.min(0, ...values) : Math.min(...values);
  const ticks = niceTicks(lo, Math.max(...values), 4);
  const bottom = ticks[0] ?? 0;
  const top = ticks.at(-1) ?? 1;
  const padL = 40;
  const padR = 8;
  const padT = 10;
  const padB = labels ? 22 : 8;
  const plotW = Math.max(0, width - padL - padR);
  const plotH = height - padT - padB;
  const x = (i: number) => padL + (i / Math.max(1, len - 1)) * plotW;
  const y = (v: number) => padT + plotH - ((v - bottom) / (top - bottom || 1)) * plotH;
  const colorOf = (s: LineSeries, i: number) => s.color ?? seriesColor(i);

  /** `connect` joins across nulls (area fill stays one closed shape). */
  const path = (data: ReadonlyArray<number | null>, connect = false) => {
    let d = "";
    let pen = false;
    data.forEach((v, i) => {
      if (v === null) {
        if (!connect) pen = false;
        return;
      }
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      pen = true;
    });
    return d;
  };
  // missing points: a faint dashed bridge over each gap, so it reads as "no data" rather than a broken chart
  const bridges = (data: ReadonlyArray<number | null>) => {
    let d = "";
    let prev = -1;
    data.forEach((v, i) => {
      if (v === null) return;
      const p = data[prev];
      if (prev >= 0 && i - prev > 1 && p != null)
        d += `M${x(prev).toFixed(1)},${y(p).toFixed(1)}L${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      prev = i;
    });
    return d;
  };

  const labelEvery = labels ? Math.ceil(labels.length / Math.max(1, Math.floor(plotW / 64))) : 1;
  const showLegend = legend ?? series.length > 1;

  return (
    <div className={cx("rk-chart-frame", className)}>
      {(showLegend || tableView) && (
        <div className="rk-chart-top">
          {showLegend && (
            <Legend items={series.map((s, i) => ({ label: s.name, color: colorOf(s, i), shape: "line" }))} />
          )}
          {tableView && <TableToggle table={asTable} onToggle={() => setAsTable(!asTable)} />}
        </div>
      )}
      {asTable && (
        <DataTableView
          label={rest["aria-label"]}
          head={["", ...series.map((s) => s.name)]}
          rows={Array.from({ length: len }, (_, i) => [
            labels?.[i] ?? String(i + 1),
            ...series.map((s) => {
              const v = s.data[i];
              return v === null || v === undefined ? "—" : exact(format)(v);
            }),
          ])}
        />
      )}
      <div
        hidden={asTable}
        ref={ref}
        role="img"
        aria-label={rest["aria-label"] ?? `${strings.lineChart}: ${series.map(summary).join("; ")}`}
        {...rest}
        className="rk-chart"
        style={{ height }}
        onPointerMove={(event) => {
          const r = event.currentTarget.getBoundingClientRect();
          const i = Math.round(((event.clientX - r.left - padL) / (plotW || 1)) * (len - 1));
          setHover(i >= 0 && i < len ? i : null);
        }}
        onPointerLeave={() => setHover(null)}
      >
        {width > 0 && len > 0 && (
          <svg width={width} height={height} aria-hidden="true">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={padL} x2={width - padR} y1={y(t)} y2={y(t)} stroke="var(--rk-chart-grid)" />
                <text x={padL - 8} y={y(t) + 3.5} textAnchor="end" className="rk-chart-tick">
                  {format(t)}
                </text>
              </g>
            ))}
            {labels?.map((l, i) =>
              i % labelEvery === 0 ? (
                // biome-ignore lint/suspicious/noArrayIndexKey: x position is the identity of an axis label
                <text key={`${l}-${i}`} x={x(i)} y={height - 6} textAnchor="middle" className="rk-chart-tick">
                  {l}
                </text>
              ) : null,
            )}
            {area &&
              series.map((s, i) => {
                const first = s.data.findIndex((v) => v !== null);
                const lastIdx = s.data.length - 1 - [...s.data].reverse().findIndex((v) => v !== null);
                return (
                  <path
                    key={`a-${s.name}`}
                    d={`${path(s.data, true)}L${x(lastIdx)},${y(bottom)}L${x(first)},${y(bottom)}Z`}
                    fill={colorOf(s, i)}
                    opacity={0.1}
                  />
                );
              })}
            {series.map((s, i) => (
              <path
                key={`g-${s.name}`}
                d={bridges(s.data)}
                fill="none"
                stroke={colorOf(s, i)}
                strokeWidth={1.5}
                strokeDasharray="2 5"
                strokeLinecap="round"
                opacity={0.5}
              />
            ))}
            {series.map((s, i) => (
              <path
                key={s.name}
                d={path(s.data)}
                fill="none"
                stroke={colorOf(s, i)}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
            {hover !== null && (
              <g>
                <line
                  x1={x(hover)}
                  x2={x(hover)}
                  y1={padT}
                  y2={padT + plotH}
                  stroke="var(--rk-line-strong)"
                />
                {series.map((s, i) => {
                  const v = s.data[hover];
                  return v == null ? null : (
                    <circle
                      key={s.name}
                      cx={x(hover)}
                      cy={y(v)}
                      r={4}
                      fill={colorOf(s, i)}
                      stroke="var(--rk-surface-1)"
                      strokeWidth={2}
                    />
                  );
                })}
              </g>
            )}
          </svg>
        )}
        {hover !== null && (
          <ChartTip
            tip={{
              x: x(hover),
              y: padT,
              content: (
                <>
                  {labels?.[hover] && <span className="rk-chart-tip-head">{labels[hover]}</span>}
                  {series.map((s, i) => (
                    <span key={s.name} className="rk-chart-tip-row">
                      <span
                        className="rk-legend-key"
                        data-shape="line"
                        style={{ background: colorOf(s, i) }}
                      />
                      <strong className="rk-num">
                        {s.data[hover] == null ? "—" : format(s.data[hover] as number)}
                      </strong>
                      <span>{s.name}</span>
                    </span>
                  ))}
                </>
              ),
            }}
          />
        )}
      </div>
    </div>
  );
}

export interface GaugeProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value: number;
  min?: number;
  max?: number;
  label?: ReactNode;
  /** Center value text; defaults to the value. */
  display?: ReactNode;
  unit?: ReactNode;
  /** Number of tick segments. */
  segments?: number;
  size?: number;
  /** Color of the active ticks. */
  color?: string;
}

/** Segmented arc gauge: active ticks in accent, the rest idle — a single headline number. */
export function Gauge({
  value,
  min = 0,
  max = 100,
  label,
  display,
  unit,
  segments = 36,
  size = 220,
  color = "var(--rk-accent)",
  className,
  ...rest
}: GaugeProps) {
  const pct = Math.min(1, Math.max(0, (value - min) / (max - min || 1)));
  const active = Math.round(pct * segments);
  const sweep = 240;
  const start = 90 + (360 - sweep) / 2;
  const r = size / 2 - 4;
  const len = size * 0.1;
  return (
    // biome-ignore lint/a11y/useSemanticElements: native <meter> cannot render a segmented arc
    <div
      role="meter"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={typeof label === "string" ? label : undefined}
      {...rest}
      className={cx("rk-gauge", className)}
      style={{ width: size, height: size * 0.82, ...rest.style }}
    >
      <svg width={size} height={size * 0.82} aria-hidden="true">
        {Array.from({ length: segments }, (_, i) => {
          const a = ((start + (i / (segments - 1)) * sweep) * Math.PI) / 180;
          const cx0 = size / 2;
          const cy0 = size / 2;
          const on = i < active;
          return (
            <line
              key={a}
              x1={cx0 + Math.cos(a) * (r - len)}
              y1={cy0 + Math.sin(a) * (r - len)}
              x2={cx0 + Math.cos(a) * r}
              y2={cy0 + Math.sin(a) * r}
              stroke={on ? color : "var(--rk-chart-idle)"}
              strokeWidth={Math.max(3, size * 0.028)}
              strokeLinecap="round"
              style={
                on
                  ? { filter: `drop-shadow(0 0 4px color-mix(in oklab, ${color} 45%, transparent))` }
                  : undefined
              }
            />
          );
        })}
      </svg>
      <div className="rk-gauge-center">
        <span className="rk-gauge-value" style={{ fontSize: size * 0.2 }}>
          {display ?? value}
          {unit && <span className="rk-gauge-unit">{unit}</span>}
        </span>
        {label && <span className="rk-gauge-label">{label}</span>}
      </div>
    </div>
  );
}
