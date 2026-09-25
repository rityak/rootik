import { type ReactNode, type TableHTMLAttributes, useCallback, useMemo, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
import { ArrowDownIcon, ArrowUpIcon, ChevronRightIcon, ChevronsUpDownIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { useSelection } from "../lib/selection";
import { Checkbox } from "./choice";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  density?: "compact" | "default" | "comfortable";
  /** Sticky header inside a scrolling wrapper (set maxHeight). */
  sticky?: boolean;
  zebra?: boolean;
  /** Scroll container max height. */
  maxHeight?: number | string;
  /** Outline + radius around the table. */
  framed?: boolean;
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
  className,
  ...rest
}: TableProps) {
  const [scrolls, setScrolls] = useState(false);
  const observe = useCallback((wrap: HTMLDivElement | null) => {
    if (!wrap) return;
    const measure = () =>
      setScrolls(wrap.scrollHeight > wrap.clientHeight + 1 || wrap.scrollWidth > wrap.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    if (wrap.firstElementChild) observer.observe(wrap.firstElementChild);
    return () => observer.disconnect();
  }, []);
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
}

export interface DataTableProps<T> extends Omit<TableProps, "children"> {
  columns: ReadonlyArray<Column<T>>;
  rows: ReadonlyArray<T>;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
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
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

function cellValue<T>(col: Column<T>, row: T) {
  return col.value
    ? col.value(row)
    : ((row as Record<string, unknown>)[col.key] as string | number | undefined);
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  selectedKey,
  selection,
  selected,
  defaultSelected,
  onSelectedChange,
  sort,
  defaultSort = null,
  onSortChange,
  empty = "No data",
  ...rest
}: DataTableProps<T>) {
  const labels = useLabels();
  const [current, setSort] = useControllable(sort, defaultSort, onSortChange);
  const sorted = useMemo(() => {
    const col = current && columns.find((c) => c.key === current.key);
    // controlled sort = rows arrive sorted from the server
    if (!col || !current || sort !== undefined) return rows;
    const sign = current.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = cellValue(col, a);
      const y = cellValue(col, b);
      if (x == null || y == null) return x == null ? 1 : -1;
      return (
        sign *
        (typeof x === "number" && typeof y === "number" ? x - y : collator.compare(String(x), String(y)))
      );
    });
  }, [rows, columns, current, sort]);

  const keys = useMemo(() => sorted.map(rowKey), [sorted, rowKey]);
  const sel = useSelection({
    keys,
    mode: selection ?? "multiple",
    value: selected,
    defaultValue: defaultSelected,
    onChange: onSelectedChange,
  });

  const cycle = (key: string) =>
    setSort(current?.key !== key ? { key, dir: "asc" } : current.dir === "asc" ? { key, dir: "desc" } : null);

  return (
    <Table {...rest}>
      <thead>
        <tr>
          {selection && (
            <th className="rk-table-select">
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
                style={{ width: col.width, textAlign: col.align }}
                aria-sort={dir ? (dir === "asc" ? "ascending" : "descending") : undefined}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    className="rk-th-sort"
                    data-sorted={dir !== undefined || undefined}
                    onClick={() => cycle(col.key)}
                  >
                    {col.header}
                    {dir === "asc" ? (
                      <ArrowUpIcon />
                    ) : dir === "desc" ? (
                      <ArrowDownIcon />
                    ) : (
                      <ChevronsUpDownIcon />
                    )}
                  </button>
                ) : (
                  col.header
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 && (
          <tr>
            <td colSpan={columns.length + (selection ? 1 : 0)} className="rk-table-empty">
              {empty}
            </td>
          </tr>
        )}
        {sorted.map((row, i) => {
          const key = rowKey(row);
          const picked = selection ? sel.isSelected(key) : undefined;
          const activate = onRowClick
            ? () => onRowClick(row)
            : selection
              ? (event: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean }) =>
                  sel.select(key, event)
              : undefined;
          return (
            <tr
              key={key}
              aria-selected={picked ?? (selectedKey === undefined ? undefined : selectedKey === key)}
              data-clickable={activate ? true : undefined}
              onClick={
                activate
                  ? (event) => {
                      // clicks on the row's own controls (checkbox, buttons, links) aren't row clicks
                      if ((event.target as HTMLElement).closest("input, button, a, label")) return;
                      activate(event);
                    }
                  : undefined
              }
              onKeyDown={
                activate
                  ? (event) => {
                      if (event.target !== event.currentTarget) return;
                      if (event.key === "Enter" || (selection && !onRowClick && event.key === " ")) {
                        event.preventDefault();
                        activate(event);
                      }
                    }
                  : undefined
              }
              tabIndex={activate ? 0 : undefined}
            >
              {selection && (
                <td className="rk-table-select">
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
              {columns.map((col) => (
                <td key={col.key} style={{ textAlign: col.align }} data-mono={col.mono || undefined}>
                  {col.cell ? col.cell(row, i) : (cellValue(col, row) as ReactNode)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export interface TreeNode {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: TreeNode[];
  /** Has children not loaded yet (shows a chevron; load in onExpandedChange). */
  lazy?: boolean;
  /** Right side: counts, row actions (visible on hover/focus). */
  trailing?: ReactNode;
  disabled?: boolean;
}

export interface TreeProps {
  items: ReadonlyArray<TreeNode>;
  selected?: string | null;
  onSelect?: (id: string, node: TreeNode) => void;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  /** Enter / double-click: open the item. */
  onActivate?: (node: TreeNode) => void;
  className?: string;
  "aria-label"?: string;
}

interface Row {
  node: TreeNode;
  depth: number;
  parent: string | null;
  pos: number;
  size: number;
}

/** Tree view (files, folders, tensors, config nodes). Flat treeitems with aria-level; keyboard per APG. */
export function Tree({
  items,
  selected,
  onSelect,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  onActivate,
  className,
  ...rest
}: TreeProps) {
  const [open, setOpen] = useControllable(expanded, defaultExpanded, onExpandedChange);
  const [focused, setFocused] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const openSet = useMemo(() => new Set(open), [open]);

  const rows = useMemo(() => {
    const out: Row[] = [];
    const walk = (nodes: ReadonlyArray<TreeNode>, depth: number, parent: string | null) => {
      nodes.forEach((node, i) => {
        out.push({ node, depth, parent, pos: i + 1, size: nodes.length });
        if (node.children && openSet.has(node.id)) walk(node.children, depth + 1, node.id);
      });
    };
    walk(items, 0, null);
    return out;
  }, [items, openSet]);

  const expandable = (n: TreeNode) => Boolean(n.lazy || n.children?.length);
  const toggle = (id: string, to = !openSet.has(id)) =>
    setOpen(to ? [...open, id] : open.filter((x) => x !== id));
  const tabStop = focused ?? selected ?? rows[0]?.node.id;

  const focusRow = (id: string | undefined) => {
    if (!id) return;
    setFocused(id);
    root.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, row: Row, index: number) => {
    const { node } = row;
    const key = event.key;
    const handled = () => event.preventDefault();
    const jump = (
      { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: rows.length - 1 } as Record<string, number>
    )[key];
    if (jump !== undefined) {
      handled();
      focusRow(rows[jump]?.node.id);
    } else if (key === "ArrowRight") {
      handled();
      if (expandable(node) && !openSet.has(node.id)) toggle(node.id, true);
      else if (openSet.has(node.id)) focusRow(rows[index + 1]?.node.id);
    } else if (key === "ArrowLeft") {
      handled();
      if (openSet.has(node.id)) toggle(node.id, false);
      else focusRow(row.parent ?? undefined);
    } else if (key === "Enter" || key === " ") {
      handled();
      if (node.disabled) return;
      onSelect?.(node.id, node);
      if (key === "Enter") onActivate?.(node);
    }
  };

  return (
    <div ref={root} role="tree" aria-label={rest["aria-label"]} className={cx("rk-tree", className)}>
      {rows.map((row, index) => {
        const { node, depth } = row;
        const isOpen = openSet.has(node.id);
        return (
          <div
            key={node.id}
            role="treeitem"
            data-id={node.id}
            aria-level={depth + 1}
            aria-posinset={row.pos}
            aria-setsize={row.size}
            aria-expanded={expandable(node) ? isOpen : undefined}
            aria-selected={selected === node.id}
            aria-disabled={node.disabled || undefined}
            tabIndex={node.id === tabStop ? 0 : -1}
            className="rk-tree-row"
            style={{ "--rk-depth": depth } as React.CSSProperties}
            onFocus={() => setFocused(node.id)}
            onClick={() => !node.disabled && onSelect?.(node.id, node)}
            onDoubleClick={() => !node.disabled && onActivate?.(node)}
            onKeyDown={(event) => onKeyDown(event, row, index)}
          >
            {expandable(node) ? (
              <span
                className="rk-tree-toggle"
                aria-hidden="true"
                onClick={(event) => {
                  event.stopPropagation();
                  toggle(node.id);
                }}
              >
                <ChevronRightIcon data-open={isOpen || undefined} />
              </span>
            ) : (
              <span className="rk-tree-toggle" aria-hidden="true" />
            )}
            {node.icon && <span className="rk-icon rk-tree-icon">{node.icon}</span>}
            <span className="rk-tree-label">{node.label}</span>
            {node.trailing && <span className="rk-tree-trailing">{node.trailing}</span>}
          </div>
        );
      })}
    </div>
  );
}
