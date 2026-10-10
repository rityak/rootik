import {
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
  type TableHTMLAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { useControllable, useLatest } from "../lib/hooks";
import { ArrowDownIcon, ArrowUpIcon, ChevronRightIcon, ChevronsUpDownIcon, icon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { useSelection } from "../lib/selection";
import { useVirtual } from "../lib/virtual";
import { IconButton } from "./button";
import { Checkbox } from "./choice";
import { Editable } from "./editable";
import { Menu, MenuCheckboxItem, MenuLabel } from "./menu";

const ColumnsIcon = icon(
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16" />
    <path d="M15 4v16" />
  </>,
);

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  density?: "compact" | "default" | "comfortable";
  /** Sticky header inside a scrolling wrapper (set maxHeight). */
  sticky?: boolean;
  zebra?: boolean;
  /** Scroll container max height. */
  maxHeight?: number | string;
  /** Outline + radius around the table. */
  framed?: boolean;
  /** The scrolling wrapper (e.g. for `useVirtual`). */
  wrapRef?: RefObject<HTMLDivElement | null>;
}

/**
 * Styled native table: write thead/tbody/tr/td as usual. When it overflows its wrapper (maxHeight, narrow
 * container) the wrapper becomes a focusable, labelled region so keyboard users can scroll it.
 */
export function Table({
  density = "default",
  sticky,
  zebra,
  maxHeight,
  framed,
  wrapRef,
  className,
  ...rest
}: TableProps) {
  const [scrolls, setScrolls] = useState(false);
  const observe = useCallback(
    (wrap: HTMLDivElement | null) => {
      if (!wrap) return;
      if (wrapRef) wrapRef.current = wrap;
      const measure = () =>
        setScrolls(wrap.scrollHeight > wrap.clientHeight + 1 || wrap.scrollWidth > wrap.clientWidth + 1);
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(wrap);
      if (wrap.firstElementChild) observer.observe(wrap.firstElementChild);
      return () => {
        observer.disconnect();
        if (wrapRef) wrapRef.current = null;
      };
    },
    [wrapRef],
  );
  const name = rest["aria-label"];
  return (
    <div
      ref={observe}
      className="rk-table-wrap"
      data-framed={framed || undefined}
      style={{ maxHeight }}
      {...(scrolls ? { tabIndex: 0, role: "region", "aria-label": name } : {})}
    >
      <table
        {...rest}
        className={cx("rk-table", className)}
        data-density={density}
        data-sticky={sticky || undefined}
        data-zebra={zebra || undefined}
      />
    </div>
  );
}

export type SortDir = "asc" | "desc";
export interface SortState {
  key: string;
  dir: SortDir;
}

export interface Column<T> {
  key: string;
  header: ReactNode;
  /** Cell renderer; defaults to the sort value / row[key]. */
  cell?: (row: T, index: number) => ReactNode;
  /** Value for sorting (and default cell). */
  value?: (row: T) => string | number | null | undefined;
  sortable?: boolean;
  align?: "start" | "center" | "end";
  width?: number | string;
  mono?: boolean;
  /** Drag handle on the header's right edge (default: the table's `resizable`). */
  resizable?: boolean;
  /** Resize bounds in px (default 48 – 1200). */
  minWidth?: number;
  maxWidth?: number;
  /** Inline edit: the cell text becomes an Editable; called with the committed text. */
  onEdit?: (row: T, value: string) => void;
  /** Can be hidden from a ColumnsMenu (default true). */
  hideable?: boolean;
}

type DisplayKey<T> = {
  [K in Extract<keyof T, string>]: T[K] extends string | number | boolean | bigint | null | undefined
    ? K
    : never;
}[Extract<keyof T, string>];

/** Checked accessors; computed/object columns require an explicit renderer or sort value. */
export type StrictColumn<T> = Omit<Column<T>, "key"> &
  (
    | { key: DisplayKey<T> }
    | { key: string; cell: NonNullable<Column<T>["cell"]> }
    | { key: string; value: NonNullable<Column<T>["value"]> }
  );

/** Additive strict path; existing Column<T> arrays remain supported. */
export const defineColumns =
  <T,>() =>
  <C extends ReadonlyArray<StrictColumn<T>>>(columns: C): C =>
    columns;

/** Column widths in px by column key; `null` = automatic layout. */
export type ColumnWidths = Record<string, number>;

export interface DataTableProps<T> extends Omit<TableProps, "children"> {
  columns: ReadonlyArray<Column<T>>;
  rows: ReadonlyArray<T>;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  /** Native attributes for each rendered row (data-*, aria-*, className, context-menu handlers). */
  rowProps?: (row: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
  selectedKey?: string | null;
  /**
   * Row selection with a checkbox column: select-all (indeterminate when partial), Shift ranges. Without
   * `onRowClick` a row click selects like a file manager (click / Ctrl-⌘ / Shift).
   */
  selection?: "single" | "multiple";
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (keys: string[]) => void;
  /** Controlled sort (server-side); omit for client sort. */
  sort?: SortState | null;
  defaultSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  empty?: ReactNode;
  /**
   * Column resize handles (drag, ←/→ with Shift for bigger steps, double-click to fit the content).
   * The first resize freezes every column at its current width and switches to a fixed layout.
   */
  resizable?: boolean;
  columnWidths?: ColumnWidths | null;
  defaultColumnWidths?: ColumnWidths | null;
  onColumnWidthsChange?: (widths: ColumnWidths | null) => void;
  /** Remember widths in localStorage under this key (uncontrolled widths only). */
  persistWidths?: string;
  /**
   * Tree rows (a treegrid): a row's children, shown indented under it while expanded. Siblings sort
   * among themselves. ←/→ collapse/expand, ↑/↓ move between rows.
   */
  getChildren?: (row: T) => ReadonlyArray<T> | undefined;
  /** Row has children that aren't loaded yet: shows the toggle (load them in onExpandedChange). */
  hasChildren?: (row: T) => boolean;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (keys: string[]) => void;
  /** Column carrying the toggle and indent (default: the first). */
  treeColumn?: string;
  /** Keys of columns not shown (pair with ColumnsMenu). */
  hiddenColumns?: ReadonlyArray<string>;
  /** The first column (and the checkbox column) stays put while the table scrolls sideways. */
  pinFirstColumn?: boolean;
  /**
   * Only mount the rows in view (tens of thousands of rows). Needs `maxHeight`; the header sticks and
   * cells stay on one line, since every row is measured once and assumed the same height.
   */
  virtual?: boolean;
}

interface FlatRow<T> {
  row: T;
  key: string;
  depth: number;
  parent: string | null;
  pos: number;
  size: number;
  expandable: boolean;
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

/** Checkbox column width in a fixed (resized) layout. */
const SELECT_COL = 40;

const storageKey = (key: string) => `rootik:table-widths:${key}`;

function readWidths(key: string | undefined): ColumnWidths | null {
  if (!key) return null;
  try {
    const raw = localStorage.getItem(storageKey(key));
    return raw ? (JSON.parse(raw) as ColumnWidths) : null;
  } catch {
    return null;
  }
}

function writeWidths(key: string, widths: ColumnWidths | null) {
  try {
    if (widths) localStorage.setItem(storageKey(key), JSON.stringify(widths));
    else localStorage.removeItem(storageKey(key));
  } catch {
    // storage full or blocked: widths just aren't remembered
  }
}

/** Content width of a cell, overflowing text included (for double-click fit). */
function contentWidth(cell: HTMLElement) {
  const target = cell.querySelector<HTMLElement>(".rk-th-content") ?? cell;
  const range = document.createRange();
  range.selectNodeContents(target);
  const css = getComputedStyle(cell);
  return (
    range.getBoundingClientRect().width +
    Number.parseFloat(css.paddingLeft) +
    Number.parseFloat(css.paddingRight) +
    1
  );
}

interface ResizeHandleProps {
  label: string;
  width: number | undefined;
  min: number;
  max: number;
  /** Current width in px; freezes the layout on the first resize. */
  start: () => number;
  onResize: (width: number) => void;
  onFit: () => void;
}

/** Header-edge splitter: a focusable separator with its width as the value (APG window splitter). */
function ResizeHandle({ label, width, min, max, start, onResize, onFit }: ResizeHandleProps) {
  const drag = useRef<{ x: number; width: number } | null>(null);
  const clamp = (w: number) => Math.round(Math.min(max, Math.max(min, w)));
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 50 : 10;
    const now = start();
    if (event.key === "ArrowLeft") onResize(clamp(now - step));
    else if (event.key === "ArrowRight") onResize(clamp(now + step));
    else if (event.key === "Home") onResize(min);
    else if (event.key === "End") onResize(max);
    else if (event.key === "Enter") onFit();
    else return;
    event.preventDefault();
  };
  return (
    // biome-ignore lint/a11y/useSemanticElements: a focusable splitter; <hr> can't take focus or a value
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={width === undefined ? undefined : Math.round(width)}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      className="rk-th-resize"
      onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { x: event.clientX, width: start() };
      }}
      onPointerMove={(event) => {
        const d = drag.current;
        if (d) onResize(clamp(d.width + event.clientX - d.x));
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onDoubleClick={onFit}
      onKeyDown={onKeyDown}
    />
  );
}

function cellValue<T>(col: Column<T>, row: T) {
  const value: unknown = col.value ? col.value(row) : (row as Record<string, unknown>)[col.key];
  if (typeof value === "string" || (typeof value === "number" && Number.isFinite(value))) return value;
  if (typeof value === "boolean" || typeof value === "bigint") return String(value);
  return null;
}

export function DataTable<T>({
  columns: allColumns,
  rows,
  rowKey,
  onRowClick,
  rowProps,
  selectedKey,
  selection,
  selected,
  defaultSelected,
  onSelectedChange,
  sort,
  defaultSort = null,
  onSortChange,
  empty,
  resizable,
  columnWidths,
  defaultColumnWidths = null,
  onColumnWidthsChange,
  persistWidths,
  getChildren,
  hasChildren,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  treeColumn,
  hiddenColumns,
  pinFirstColumn,
  virtual,
  style,
  ...rest
}: DataTableProps<T>) {
  const labels = useLabels();
  const columns = useMemo(
    () => (hiddenColumns?.length ? allColumns.filter((c) => !hiddenColumns.includes(c.key)) : allColumns),
    [allColumns, hiddenColumns],
  );
  const firstKey = columns[0]?.key;
  // pinned cells: sticky on the start edge; the first data column sits after the checkbox column
  const pin = (key: string | null) =>
    pinFirstColumn && (key === null || key === firstKey)
      ? {
          className: "rk-table-pin",
          style: { left: key === null || !selection ? 0 : SELECT_COL } as React.CSSProperties,
          "data-pin-edge": key === firstKey || undefined,
        }
      : null;
  const head = useRef<HTMLTableSectionElement>(null);
  const [widths, setWidthsState] = useControllable<ColumnWidths | null>(
    columnWidths,
    // read once: later renders keep the state
    useMemo(() => readWidths(persistWidths) ?? defaultColumnWidths, [persistWidths, defaultColumnWidths]),
    onColumnWidthsChange,
  );
  const latestWidths = useLatest(widths);
  const setWidths = (next: ColumnWidths | null) => {
    latestWidths.current = next;
    setWidthsState(next);
  };
  useEffect(() => {
    if (persistWidths && columnWidths === undefined) writeWidths(persistWidths, widths);
  }, [persistWidths, columnWidths, widths]);

  const canResize = (col: Column<T>) => col.resizable ?? Boolean(resizable);
  const anyResizable = columns.some(canResize);
  // fixed layout once every column has a width (after the first resize or from storage)
  const fixed = anyResizable && widths !== null && columns.every((c) => widths[c.key] !== undefined);
  const total = fixed
    ? columns.reduce((sum, c) => sum + (widths?.[c.key] ?? 0), 0) + (selection ? SELECT_COL : 0)
    : undefined;

  const headerCell = (key: string) =>
    head.current?.querySelector<HTMLTableCellElement>(`th[data-col="${CSS.escape(key)}"]`) ?? null;
  const freeze = (): ColumnWidths => {
    const current = latestWidths.current;
    if (current && columns.every((c) => current[c.key] !== undefined)) return current;
    const measured: ColumnWidths = {};
    for (const c of columns)
      measured[c.key] = Math.round(headerCell(c.key)?.getBoundingClientRect().width ?? 120);
    setWidths(measured);
    return measured;
  };
  const resizeTo = (key: string, width: number) => setWidths({ ...freeze(), [key]: width });
  const fit = (col: Column<T>) => {
    const th = headerCell(col.key);
    const table = th?.closest("table");
    if (!th || !table) return;
    const index = th.cellIndex;
    let width = contentWidth(th);
    for (const row of Array.from(table.tBodies[0]?.rows ?? [])) {
      const cell = row.cells[index];
      if (cell && cell.colSpan === 1) width = Math.max(width, contentWidth(cell));
    }
    resizeTo(col.key, Math.round(Math.min(col.maxWidth ?? 1200, Math.max(col.minWidth ?? 48, width))));
  };
  const [current, setSort] = useControllable(sort, defaultSort, onSortChange);
  const compare = useMemo(() => {
    const col = current && columns.find((c) => c.key === current.key);
    // controlled sort = rows arrive sorted from the server
    if (!col || !current || sort !== undefined) return null;
    const sign = current.dir === "asc" ? 1 : -1;
    return (a: T, b: T) => {
      const x = cellValue(col, a);
      const y = cellValue(col, b);
      if (x == null || y == null) return x == null ? 1 : -1;
      return (
        sign *
        (typeof x === "number" && typeof y === "number" ? x - y : collator.compare(String(x), String(y)))
      );
    };
  }, [columns, current, sort]);

  const tree = getChildren !== undefined || hasChildren !== undefined;
  const [open, setOpen] = useControllable(expanded, defaultExpanded, onExpandedChange);
  const openSet = useMemo(() => new Set(open), [open]);
  // visible rows in display order: siblings sorted, children under expanded parents
  const flat = useMemo(() => {
    const out: FlatRow<T>[] = [];
    const walk = (list: ReadonlyArray<T>, depth: number, parent: string | null) => {
      const level = compare ? [...list].sort(compare) : list;
      level.forEach((row, i) => {
        const key = rowKey(row);
        const kids = getChildren?.(row);
        const expandable = Boolean(kids?.length) || Boolean(hasChildren?.(row));
        out.push({ row, key, depth, parent, pos: i + 1, size: level.length, expandable });
        if (kids && openSet.has(key)) walk(kids, depth + 1, key);
      });
    };
    walk(rows, 0, null);
    return out;
  }, [rows, compare, rowKey, getChildren, hasChildren, openSet]);

  const keys = useMemo(() => flat.map((f) => f.key), [flat]);
  const toggleRow = (key: string, to = !openSet.has(key)) =>
    setOpen(to ? [...open, key] : open.filter((k) => k !== key));
  const treeKey = treeColumn ?? columns[0]?.key;
  const body = useRef<HTMLTableSectionElement>(null);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const tabStop = focusedKey !== null && keys.includes(focusedKey) ? focusedKey : keys[0];

  // virtualization: the table wrapper scrolls; row and header heights are measured from the DOM
  const wrap = useRef<HTMLDivElement | null>(null);
  const [rowHeight, setRowHeight] = useState(0);
  const [headHeight, setHeadHeight] = useState(0);
  useLayoutEffect(() => {
    if (!virtual) return;
    const measured = body.current?.querySelector<HTMLElement>("tr[data-key]")?.offsetHeight ?? 0;
    if (measured && measured !== rowHeight) setRowHeight(measured);
    const header = head.current?.offsetHeight ?? 0;
    if (header !== headHeight) setHeadHeight(header);
  });
  const estimate = { compact: 29, default: 37, comfortable: 45 }[rest.density ?? "default"];
  const win = useVirtual({
    count: virtual ? flat.length : 0,
    size: rowHeight || estimate,
    scrollRef: wrap,
    overscan: 8,
    scrollMargin: headHeight,
  });
  const shown = virtual
    ? win.items.flatMap((item) => {
        const f = flat[item.index];
        return f ? [{ f, i: item.index }] : [];
      })
    : flat.map((f, i) => ({ f, i }));

  const rowEl = (key: string) =>
    body.current?.querySelector<HTMLElement>(`tr[data-key="${CSS.escape(key)}"]`) ?? null;
  /** Focus a row and scroll it clear of the sticky header (native focus scrolling ignores what covers it). */
  const reveal = (el: HTMLElement) => {
    el.focus({ preventScroll: true });
    const scroller = wrap.current;
    if (!scroller) return;
    const box = scroller.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const top =
      box.top + scroller.clientTop + (virtual || rest.sticky ? (head.current?.offsetHeight ?? 0) : 0);
    const bottom = box.top + scroller.clientTop + scroller.clientHeight;
    if (r.top < top) scroller.scrollTop -= top - r.top;
    else if (r.bottom > bottom) scroller.scrollTop += r.bottom - bottom;
  };
  // a row outside the window is scrolled in first and focused once it mounts
  const pendingFocus = useRef<string | null>(null);
  useEffect(() => {
    const key = pendingFocus.current;
    const el = key ? rowEl(key) : null;
    if (el) {
      pendingFocus.current = null;
      reveal(el);
    }
  });
  const focusRow = (key: string | null | undefined) => {
    if (!key) return;
    setFocusedKey(key);
    const el = rowEl(key);
    if (el) reveal(el);
    else if (virtual && wrap.current) {
      pendingFocus.current = key;
      // bring the row in view below the sticky header (the scroll margin alone would leave it under it)
      const scroller = wrap.current;
      const size = rowHeight || estimate;
      const top = headHeight + keys.indexOf(key) * size;
      if (top - headHeight < scroller.scrollTop) scroller.scrollTop = top - headHeight;
      else if (top + size > scroller.scrollTop + scroller.clientHeight)
        scroller.scrollTop = top + size - scroller.clientHeight;
    }
  };
  /** treegrid row keys (APG): ↑/↓/Home/End move, → expands or enters, ← collapses or goes up. */
  const onTreeKey = (event: KeyboardEvent<HTMLTableRowElement>, f: FlatRow<T>, index: number) => {
    const isOpen = openSet.has(f.key);
    switch (event.key) {
      case "ArrowDown":
        focusRow(keys[index + 1]);
        break;
      case "ArrowUp":
        focusRow(keys[index - 1]);
        break;
      case "Home":
        focusRow(keys[0]);
        break;
      case "End":
        focusRow(keys.at(-1));
        break;
      case "ArrowRight":
        if (f.expandable && !isOpen) toggleRow(f.key, true);
        else if (isOpen) focusRow(keys[index + 1]);
        break;
      case "ArrowLeft":
        if (isOpen) toggleRow(f.key, false);
        else focusRow(f.parent);
        break;
      default:
        return false;
    }
    event.preventDefault();
    return true;
  };
  const sel = useSelection({
    keys,
    mode: selection ?? "multiple",
    value: selected,
    defaultValue: defaultSelected,
    onChange: onSelectedChange,
  });

  const cycle = (key: string) =>
    setSort(current?.key !== key ? { key, dir: "asc" } : current.dir === "asc" ? { key, dir: "desc" } : null);

  const headerContent = (col: Column<T>, dir: SortDir | undefined) =>
    col.sortable ? (
      <button
        type="button"
        className="rk-th-sort"
        data-sorted={dir !== undefined || undefined}
        onClick={() => cycle(col.key)}
      >
        {col.header}
        {dir === "asc" ? <ArrowUpIcon /> : dir === "desc" ? <ArrowDownIcon /> : <ChevronsUpDownIcon />}
      </button>
    ) : (
      col.header
    );

  return (
    <Table
      role={tree ? "treegrid" : undefined}
      aria-rowcount={virtual ? flat.length + 1 : undefined}
      {...rest}
      sticky={virtual || rest.sticky}
      wrapRef={wrap}
      style={{
        ...style,
        ...(fixed ? { width: total, tableLayout: "fixed" } : null),
        ...(virtual ? { "--rk-table-head": `${headHeight}px` } : null),
      }}
      data-resizable={anyResizable || undefined}
      data-pinned={pinFirstColumn || undefined}
      data-fixed={fixed || undefined}
      data-virtual={virtual || undefined}
    >
      {fixed && (
        <colgroup>
          {selection && <col style={{ width: SELECT_COL }} />}
          {columns.map((col) => (
            <col key={col.key} style={{ width: widths?.[col.key] }} />
          ))}
        </colgroup>
      )}
      <thead ref={head}>
        <tr>
          {selection && (
            <th {...pin(null)} className={cx("rk-table-select", pin(null)?.className)}>
              {selection === "multiple" && (
                <Checkbox
                  aria-label={labels.selectAll}
                  checked={sel.allSelected}
                  indeterminate={sel.someSelected}
                  onChange={() => (sel.allSelected ? sel.clear() : sel.selectAll())}
                />
              )}
            </th>
          )}
          {columns.map((col) => {
            const dir = current?.key === col.key ? current.dir : undefined;
            return (
              <th
                key={col.key}
                data-col={col.key}
                {...pin(col.key)}
                style={{ width: fixed ? undefined : col.width, textAlign: col.align, ...pin(col.key)?.style }}
                aria-sort={dir ? (dir === "asc" ? "ascending" : "descending") : undefined}
              >
                {canResize(col) ? (
                  <>
                    <span className="rk-th-content">{headerContent(col, dir)}</span>
                    <ResizeHandle
                      label={`${labels.resize}: ${typeof col.header === "string" ? col.header : col.key}`}
                      width={widths?.[col.key]}
                      min={col.minWidth ?? 48}
                      max={col.maxWidth ?? 1200}
                      start={() => freeze()[col.key] ?? 120}
                      onResize={(w) => resizeTo(col.key, w)}
                      onFit={() => fit(col)}
                    />
                  </>
                ) : (
                  headerContent(col, dir)
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody ref={body}>
        {flat.length === 0 && (
          <tr>
            <td colSpan={columns.length + (selection ? 1 : 0)} className="rk-table-empty">
              {empty === undefined ? labels.noData : empty}
            </td>
          </tr>
        )}
        {virtual && win.before > 0 && (
          // biome-ignore lint/a11y/noAriaHiddenOnFocusable: a spacer row is never focusable
          <tr aria-hidden="true" className="rk-table-spacer" style={{ height: win.before }}>
            <td colSpan={columns.length + (selection ? 1 : 0)} />
          </tr>
        )}
        {shown.map(({ f, i }) => {
          const { row, key } = f;
          const isOpen = openSet.has(key);
          const picked = selection ? sel.isSelected(key) : undefined;
          const custom = rowProps?.(row, i);
          const activate = onRowClick
            ? () => onRowClick(row)
            : selection
              ? (event: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean }) =>
                  sel.select(key, event)
              : undefined;
          return (
            <tr
              key={key}
              {...custom}
              className={custom?.className}
              style={custom?.style}
              data-key={key}
              data-alt={i % 2 === 1 || undefined}
              aria-rowindex={virtual ? i + 2 : undefined}
              aria-level={tree ? f.depth + 1 : undefined}
              aria-posinset={tree ? f.pos : undefined}
              aria-setsize={tree ? f.size : undefined}
              aria-expanded={tree && f.expandable ? isOpen : undefined}
              aria-selected={picked ?? (selectedKey === undefined ? undefined : selectedKey === key)}
              data-clickable={activate ? true : undefined}
              onClick={(event) => {
                custom?.onClick?.(event);
                if (event.defaultPrevented || !activate) return;
                // clicks on the row's own controls (checkbox, buttons, links) aren't row clicks
                if ((event.target as HTMLElement).closest("input, button, a, label")) return;
                activate(event);
              }}
              onKeyDown={(event) => {
                custom?.onKeyDown?.(event);
                if (event.defaultPrevented || !(activate || tree)) return;
                if (event.target !== event.currentTarget) return;
                if (tree && onTreeKey(event, f, i)) return;
                if (activate && (event.key === "Enter" || (selection && !onRowClick && event.key === " "))) {
                  event.preventDefault();
                  activate(event);
                }
              }}
              onFocus={(event) => {
                custom?.onFocus?.(event);
                if (!event.defaultPrevented && tree) setFocusedKey(key);
              }}
              // Shift+click extends the row selection, not a text selection
              onMouseDown={(event) => {
                custom?.onMouseDown?.(event);
                if (!event.defaultPrevented && selection && event.shiftKey) event.preventDefault();
              }}
              // a treegrid is one tab stop (arrows move between rows); flat tables keep a stop per row
              tabIndex={tree ? (key === tabStop ? 0 : -1) : (custom?.tabIndex ?? (activate ? 0 : undefined))}
            >
              {selection && (
                <td {...pin(null)} className={cx("rk-table-select", pin(null)?.className)}>
                  <Checkbox
                    aria-label={labels.selectRow}
                    checked={Boolean(picked)}
                    onChange={(event) =>
                      selection === "single"
                        ? sel.select(key, { toggle: true })
                        : sel.toggle(key, (event.nativeEvent as MouseEvent).shiftKey)
                    }
                  />
                </td>
              )}
              {columns.map((col) => {
                const content = col.cell ? (
                  col.cell(row, i)
                ) : col.onEdit ? (
                  <Editable
                    value={String(cellValue(col, row) ?? "")}
                    mono={col.mono}
                    label={`${labels.edit}: ${typeof col.header === "string" ? col.header : col.key}`}
                    onChange={(v) => col.onEdit?.(row, v)}
                  />
                ) : (
                  cellValue(col, row)
                );
                const pinned = pin(col.key);
                if (!(tree && col.key === treeKey))
                  return (
                    <td
                      key={col.key}
                      {...pinned}
                      style={{ textAlign: col.align, ...pinned?.style }}
                      data-mono={col.mono || undefined}
                    >
                      {content}
                    </td>
                  );
                return (
                  <td
                    key={col.key}
                    {...pinned}
                    className={cx("rk-table-tree-cell", pinned?.className)}
                    style={
                      { textAlign: col.align, "--rk-depth": f.depth, ...pinned?.style } as React.CSSProperties
                    }
                    data-mono={col.mono || undefined}
                  >
                    <span className="rk-table-tree-inner">
                      {f.expandable ? (
                        // pointer shortcut; keyboard users have ←/→ on the row
                        <span
                          className="rk-tree-toggle"
                          aria-hidden="true"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleRow(key);
                          }}
                        >
                          <ChevronRightIcon data-open={isOpen || undefined} />
                        </span>
                      ) : (
                        <span className="rk-tree-toggle" aria-hidden="true" />
                      )}
                      <span className="rk-table-tree-content">{content}</span>
                    </span>
                  </td>
                );
              })}
            </tr>
          );
        })}
        {virtual && win.after > 0 && (
          // biome-ignore lint/a11y/noAriaHiddenOnFocusable: a spacer row is never focusable
          <tr aria-hidden="true" className="rk-table-spacer" style={{ height: win.after }}>
            <td colSpan={columns.length + (selection ? 1 : 0)} />
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export interface ColumnsMenuProps {
  columns: ReadonlyArray<Pick<Column<unknown>, "key" | "header" | "hideable">>;
  hidden: ReadonlyArray<string>;
  onHiddenChange: (hidden: string[]) => void;
  /** Trigger; defaults to an icon button. */
  trigger?: ReactElement;
}

/** Show/hide columns of a DataTable: checkbox menu over `hiddenColumns`. The last visible one stays. */
export function ColumnsMenu({ columns, hidden, onHiddenChange, trigger }: ColumnsMenuProps) {
  const labels = useLabels();
  const visible = columns.filter((c) => !hidden.includes(c.key)).length;
  return (
    <Menu trigger={trigger ?? <IconButton size="sm" icon={<ColumnsIcon />} label={labels.columns} />}>
      <MenuLabel>{labels.columns}</MenuLabel>
      {columns.map((c) => {
        const shown = !hidden.includes(c.key);
        return (
          <MenuCheckboxItem
            key={c.key}
            checked={shown}
            disabled={c.hideable === false || (shown && visible === 1)}
            onCheckedChange={(on) =>
              onHiddenChange(on ? hidden.filter((k) => k !== c.key) : [...hidden, c.key])
            }
          >
            {c.header}
          </MenuCheckboxItem>
        );
      })}
    </Menu>
  );
}
