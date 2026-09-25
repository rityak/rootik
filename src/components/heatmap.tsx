// biome-ignore-all lint/a11y/useSemanticElements: ARIA grid on a CSS subgrid; display on table elements drops their semantics in some engines
// biome-ignore-all lint/a11y/useFocusableInteractive: APG grid pattern — only cells take focus (roving tabindex), rows and headers don't
import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { Floating } from "../lib/floating";
import { ChartIcon, TableIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { IconButton } from "./button";
import { Table } from "./data";

export interface HeatmapProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  rows: readonly string[];
  columns: readonly string[];
  /** `values[row][column]`; `null` = no data (hatched). */
  values: ReadonlyArray<ReadonlyArray<number | null>>;
  /** Ramp domain; defaults to the data's extent. */
  min?: number;
  max?: number;
  format?: (value: number) => string;
  /** Numbers inside the cells (fine for small matrices). */
  showValues?: boolean;
  /** Tooltip content; default "row × column: value". */
  tooltip?: (row: string, column: string, value: number | null) => ReactNode;
  /** Accessible name of the grid and table. */
  label?: string;
  /** Gradient legend + table toggle above the grid (default true). */
  legend?: boolean;
}

const plain = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

/**
 * Matrix of magnitudes on a one-hue sequential ramp (`--rk-chart-seq-lo` → `--rk-chart-seq-hi`, dark to
 * light on the dark canvas): co-occurrence, confusion, activity by hour. Each cell has a tooltip and is
 * reachable with arrow keys; the legend carries the scale and a table view.
 */
export function Heatmap({
  rows,
  columns,
  values,
  min,
  max,
  format = (v) => plain.format(v),
  showValues,
  tooltip,
  label,
  legend = true,
  className,
  ...rest
}: HeatmapProps) {
  const labels = useLabels();
  const grid = useRef<HTMLDivElement>(null);
  const [asTable, setAsTable] = useState(false);
  const [focus, setFocus] = useState<[number, number]>([0, 0]);
  const [hot, setHot] = useState<[number, number] | null>(null);

  const flat = values.flat().filter((v): v is number => v !== null);
  const lo = min ?? Math.min(...flat, 0);
  const hi = max ?? Math.max(...flat, lo + 1);
  const t = (v: number) => Math.min(1, Math.max(0, (v - lo) / (hi - lo || 1)));
  const hasNull = values.some((r) => r.some((v) => v === null));
  const text = (v: number | null) => (v === null ? labels.noData : format(v));

  const cellAt = (r: number, c: number) =>
    grid.current?.querySelector<HTMLElement>(`[data-cell="${r}:${c}"]`) ?? null;
  const anchor = useCallback(
    () =>
      hot
        ? (grid.current?.querySelector(`[data-cell="${hot[0]}:${hot[1]}"]`)?.getBoundingClientRect() ?? null)
        : null,
    [hot],
  );

  const move = (event: KeyboardEvent) => {
    const [r, c] = focus;
    const next: Record<string, [number, number]> = {
      ArrowRight: [r, Math.min(columns.length - 1, c + 1)],
      ArrowLeft: [r, Math.max(0, c - 1)],
      ArrowDown: [Math.min(rows.length - 1, r + 1), c],
      ArrowUp: [Math.max(0, r - 1), c],
      Home: [r, 0],
      End: [r, columns.length - 1],
    };
    const to = next[event.key];
    if (!to) return;
    event.preventDefault();
    setFocus(to);
    cellAt(to[0], to[1])?.focus();
  };

  const current = hot
    ? { row: rows[hot[0]] ?? "", col: columns[hot[1]] ?? "", v: values[hot[0]]?.[hot[1]] ?? null }
    : null;

  return (
    <div {...rest} className={cx("rk-heatmap", className)}>
      {legend && (
        <div className="rk-heatmap-bar">
          <span className="rk-heatmap-scale">
            <span className="rk-num">{format(lo)}</span>
            <span className="rk-heatmap-ramp" aria-hidden="true" />
            <span className="rk-num">{format(hi)}</span>
            {hasNull && (
              <>
                <span className="rk-heatmap-swatch" aria-hidden="true" />
                <span>{labels.noData}</span>
              </>
            )}
          </span>
          <IconButton
            size="sm"
            icon={asTable ? <ChartIcon /> : <TableIcon />}
            label={asTable ? labels.showChart : labels.showTable}
            onClick={() => setAsTable(!asTable)}
          />
        </div>
      )}
      {asTable ? (
        <Table framed density="compact" aria-label={label ?? labels.heatmap}>
          <thead>
            <tr>
              <th />
              {columns.map((c) => (
                <th key={c} style={{ textAlign: "end" }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r}>
                <th scope="row">{r}</th>
                {columns.map((c, ci) => (
                  <td key={c} className="rk-num" style={{ textAlign: "end" }}>
                    {text(values[ri]?.[ci] ?? null)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div
          ref={grid}
          role="grid"
          aria-label={label ?? labels.heatmap}
          className="rk-heatmap-grid"
          style={{ "--rk-cols": columns.length } as CSSProperties}
          onKeyDown={move}
          onPointerLeave={() => setHot(null)}
        >
          <div role="row" className="rk-heatmap-row">
            <span role="columnheader" className="rk-heatmap-corner" />
            {columns.map((c, ci) => (
              <span
                key={c}
                role="columnheader"
                className="rk-heatmap-col"
                data-hot={hot?.[1] === ci || undefined}
              >
                <span>{c}</span>
              </span>
            ))}
          </div>
          {rows.map((r, ri) => (
            <div key={r} role="row" className="rk-heatmap-row">
              <span role="rowheader" className="rk-heatmap-rowhead" data-hot={hot?.[0] === ri || undefined}>
                {r}
              </span>
              {columns.map((c, ci) => {
                const v = values[ri]?.[ci] ?? null;
                const share = v === null ? 0 : t(v);
                return (
                  <span
                    key={c}
                    role="gridcell"
                    data-cell={`${ri}:${ci}`}
                    tabIndex={focus[0] === ri && focus[1] === ci ? 0 : -1}
                    aria-label={`${r} × ${c}: ${text(v)}`}
                    className="rk-heatmap-cell"
                    data-empty={v === null || undefined}
                    data-bright={share > 0.55 || undefined}
                    style={
                      v === null
                        ? undefined
                        : {
                            background: `color-mix(in oklch, var(--rk-chart-seq-hi) ${(share * 100).toFixed(1)}%, var(--rk-chart-seq-lo))`,
                          }
                    }
                    onPointerEnter={() => setHot([ri, ci])}
                    onFocus={() => {
                      setFocus([ri, ci]);
                      setHot([ri, ci]);
                    }}
                    onBlur={() => setHot(null)}
                  >
                    {showValues && v !== null && <span className="rk-num">{format(v)}</span>}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {current && !asTable && (
        <Floating open manual anchor={anchor} placement="top" aria-hidden="true" className="rk-tooltip">
          {tooltip ? (
            tooltip(current.row, current.col, current.v)
          ) : (
            <>
              {current.row} × {current.col}
              <strong className="rk-num">{text(current.v)}</strong>
            </>
          )}
        </Floating>
      )}
    </div>
  );
}
