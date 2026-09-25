import { type HTMLAttributes, type ReactNode, useId, useLayoutEffect, useRef, useState } from "react";
import { cx } from "../lib/cx";

const SERIES = Array.from({ length: 6 }, (_, i) => `var(--rk-chart-${i + 1})`);
/** Categorical color by fixed slot (never cycled past 6 — fold extras into "Other"). */
export const seriesColor = (i: number) => SERIES[Math.min(i, SERIES.length - 1)] as string;

const compact = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
export const formatCompact = (n: number) => compact.format(n);

function useWidth<T extends HTMLElement>() {
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
function barPath(x: number, y: number, w: number, h: number, radius: number, horizontal = false) {
  const r = Math.max(0, Math.min(radius, w / 2, h));
  if (h <= 0) return "";
  return horizontal
    ? `M${x},${y}h${w - r}a${r},${r} 0 0 1 ${r},${r}v${h - 2 * r}a${r},${r} 0 0 1 -${r},${r}h-${w - r}z`
    : `M${x},${y + h}v-${h - r}a${r},${r} 0 0 1 ${r},-${r}h${w - 2 * r}a${r},${r} 0 0 1 ${r},${r}v${h - r}z`;
}

interface Tip {
  x: number;
  y: number;
  content: ReactNode;
}

function ChartTip({ tip }: { tip: Tip | null }) {
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
  className,
  ...rest
}: BarChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
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
    const barW = Math.min(24, band * 0.6);
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
              {variant === "hatch" && (
                <path d={barPath(cx0 - barW / 2, padT, barW, plotH, barW / 2)} fill="var(--rk-hover)" />
              )}
              <path
                d={barPath(cx0 - barW / 2, y(d.value), barW, h, variant === "hatch" ? barW / 2 : 4)}
                fill={fill(i, d)}
              />
              {showLabel(d) && (
                <text x={cx0} y={y(d.value) - 6} textAnchor="middle" className="rk-chart-value">
                  {format(d.value)}
                </text>
              )}
              <text
                x={cx0}
                y={height - 6}
                textAnchor="middle"
                className="rk-chart-tick"
                data-hot={d.label === highlight || undefined}
              >
                {d.label}
              </text>
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

  return (
    <div
      ref={ref}
      role="img"
      aria-label={
        rest["aria-label"] ?? `Bar chart: ${data.map((d) => `${d.label} ${format(d.value)}`).join(", ")}`
      }
      {...rest}
      className={cx("rk-chart", className)}
      style={{ minHeight: horizontal ? undefined : height, ...rest.style }}
    >
      {svg}
      <ChartTip tip={tip} />
    </div>
  );
}

function HatchDef({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill="var(--rk-chart-idle)" opacity="0.35" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="var(--rk-text-3)" strokeWidth="1.5" opacity="0.55" />
      </pattern>
    </defs>
  );
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
  "aria-label"?: string;
}

/** Lines over time with a snapping crosshair; tooltip lists every series at that x. */
export function LineChart({
  series,
  labels,
  height = 220,
  area,
  format = formatCompact,
  zero = true,
  legend,
  className,
  ...rest
}: LineChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const len = Math.max(0, ...series.map((s) => s.data.length));
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

  const path = (data: ReadonlyArray<number | null>) => {
    let d = "";
    let pen = false;
    data.forEach((v, i) => {
      if (v === null) {
        pen = false;
        return;
      }
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      pen = true;
    });
    return d;
  };

  const labelEvery = labels ? Math.ceil(labels.length / Math.max(1, Math.floor(plotW / 64))) : 1;
  const showLegend = legend ?? series.length > 1;

  return (
    <div className={cx("rk-chart-frame", className)}>
      {showLegend && (
        <Legend items={series.map((s, i) => ({ label: s.name, color: colorOf(s, i), shape: "line" }))} />
      )}
      <div
        ref={ref}
        role="img"
        aria-label={rest["aria-label"] ?? `Line chart: ${series.map((s) => s.name).join(", ")}`}
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
                    d={`${path(s.data)}L${x(lastIdx)},${y(bottom)}L${x(first)},${y(bottom)}Z`}
                    fill={colorOf(s, i)}
                    opacity={0.1}
                  />
                );
              })}
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
