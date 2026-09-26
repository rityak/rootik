import { type CSSProperties, type ReactNode, useMemo, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { useHighlight } from "../lib/highlight";
import { useControllable } from "../lib/hooks";
import { CheckIcon, ChevronRightIcon, MinusIcon } from "../lib/icons";
import { nextSelection } from "../lib/selection";
import { useVirtual } from "../lib/virtual";

export interface TreeNode {
  id: string;
  label: ReactNode;
  /** Plain text for filtering and typeahead when `label` isn't a string. */
  text?: string;
  icon?: ReactNode;
  children?: TreeNode[];
  /** Has children not loaded yet (shows a chevron; load in onExpandedChange). */
  lazy?: boolean;
  /** Right side: counts, row actions (visible on hover/focus). */
  trailing?: ReactNode;
  disabled?: boolean;
}

export type TreeDropPosition = "before" | "after" | "inside";

export interface TreeProps {
  items: ReadonlyArray<TreeNode>;
  /** Single selection (the default mode). */
  selected?: string | null;
  onSelect?: (id: string, node: TreeNode) => void;
  /** `multiple`: Ctrl/⌘-click toggles, Shift-click extends, Space toggles the focused row. */
  selectionMode?: "single" | "multiple";
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Tri-state checkboxes; the value is the checked leaf ids (a parent is checked when all its leaves are). */
  checkable?: boolean;
  checked?: string[];
  defaultChecked?: string[];
  onCheckedChange?: (leafIds: string[]) => void;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  /** Shows matches and their ancestors (expanded), with the match highlighted. */
  filter?: string;
  /** Enter / double-click: open the item. */
  onActivate?: (node: TreeNode) => void;
  /** Fixed height, px: rows are virtualized (large models, file systems). */
  height?: number;
  /** Row pitch for virtualization, px (row height + gap). */
  rowHeight?: number;
  /** Drag rows onto others; the app moves the data. Pointer only: offer a "Move to…" command too. */
  onMove?: (id: string, targetId: string, position: TreeDropPosition) => void;
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

const textOf = (n: TreeNode) => (n.text ?? (typeof n.label === "string" ? n.label : "")).toLowerCase();
const PRINTABLE = /^\S$/;

/** Tree view (files, folders, tensors, config nodes). Flat treeitems with aria-level; keyboard per APG. */
export function Tree({
  items,
  selected,
  onSelect,
  selectionMode = "single",
  selectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  checkable,
  checked,
  defaultChecked = [],
  onCheckedChange,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  filter = "",
  onActivate,
  height,
  rowHeight = 29,
  onMove,
  className,
  ...rest
}: TreeProps) {
  const [open, setOpen] = useControllable(expanded, defaultExpanded, onExpandedChange);
  const [multi, setMulti] = useControllable(selectedIds, defaultSelectedIds, onSelectionChange);
  const [checks, setChecks] = useControllable(checked, defaultChecked, onCheckedChange);
  const [focused, setFocused] = useState<string | null>(null);
  const [drop, setDrop] = useState<{ id: string; pos: TreeDropPosition } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const anchor = useRef<string | undefined>(undefined);
  const dragged = useRef<string | null>(null);
  const typed = useRef({ text: "", at: 0 });
  const openSet = useMemo(() => new Set(open), [open]);
  const checkSet = useMemo(() => new Set(checks), [checks]);
  const multiple = selectionMode === "multiple";
  const query = filter.trim().toLowerCase();

  // leaves under every node, and parents, over the whole tree (not just visible rows)
  const { leaves, parentOf } = useMemo(() => {
    const leafMap = new Map<string, string[]>();
    const parents = new Map<string, string | null>();
    const walk = (node: TreeNode, parent: string | null): string[] => {
      parents.set(node.id, parent);
      const own = node.children?.length ? node.children.flatMap((c) => walk(c, node.id)) : [node.id];
      leafMap.set(node.id, own);
      return own;
    };
    for (const n of items) walk(n, null);
    return { leaves: leafMap, parentOf: parents };
  }, [items]);

  // filtering: matches plus their ancestors, which open regardless of `expanded`
  const { visible, forcedOpen } = useMemo(() => {
    if (!query) return { visible: null, forcedOpen: new Set<string>() };
    const shown = new Set<string>();
    const opened = new Set<string>();
    const walk = (node: TreeNode): boolean => {
      const inner = (node.children ?? []).map(walk).some(Boolean);
      const hit = textOf(node).includes(query);
      if (inner) opened.add(node.id);
      if (hit || inner) shown.add(node.id);
      return hit || inner;
    };
    for (const n of items) walk(n);
    return { visible: shown, forcedOpen: opened };
  }, [items, query]);

  const isOpen = (id: string) => openSet.has(id) || forcedOpen.has(id);
  const rows = useMemo(() => {
    const out: Row[] = [];
    const walk = (nodes: ReadonlyArray<TreeNode>, depth: number, parent: string | null) => {
      const shown = visible ? nodes.filter((n) => visible.has(n.id)) : nodes;
      shown.forEach((node, i) => {
        out.push({ node, depth, parent, pos: i + 1, size: shown.length });
        if (node.children && (openSet.has(node.id) || forcedOpen.has(node.id)))
          walk(node.children, depth + 1, node.id);
      });
    };
    walk(items, 0, null);
    return out;
  }, [items, openSet, visible, forcedOpen]);

  const keys = useMemo(() => rows.map((r) => r.node.id), [rows]);
  const virtual = useVirtual({ count: height ? rows.length : 0, size: rowHeight, scrollRef: root });
  useHighlight(root, query, ".rk-tree-label");

  const expandable = (n: TreeNode) => Boolean(n.lazy || n.children?.length);
  const toggle = (id: string, to = !openSet.has(id)) =>
    setOpen(to ? [...open, id] : open.filter((x) => x !== id));
  const isSelected = (id: string) => (multiple ? multi.includes(id) : selected === id);
  const tabStop = focused ?? (multiple ? multi[0] : selected) ?? rows[0]?.node.id;

  const checkState = (id: string): boolean | "mixed" => {
    const ls = leaves.get(id) ?? [id];
    const n = ls.filter((l) => checkSet.has(l)).length;
    return n === 0 ? false : n === ls.length ? true : "mixed";
  };
  const flipCheck = (id: string) => {
    const ls = leaves.get(id) ?? [id];
    const on = checkState(id) !== true;
    const next = new Set(checks);
    for (const l of ls) on ? next.add(l) : next.delete(l);
    setChecks([...next]);
  };

  const select = (node: TreeNode, how: { range?: boolean; toggle?: boolean } = {}) => {
    if (node.disabled) return;
    if (!multiple) return onSelect?.(node.id, node);
    setMulti(nextSelection(multi, keys, node.id, how, "multiple", anchor.current));
    if (!how.range) anchor.current = node.id;
  };

  const focusRow = (id: string | undefined) => {
    if (!id) return;
    setFocused(id);
    const index = keys.indexOf(id);
    if (height && index >= 0) virtual.scrollToIndex(index);
    // a virtualized row may only exist after the scroll re-renders
    requestAnimationFrame(() =>
      root.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)?.focus(),
    );
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
      const target = rows[jump]?.node;
      focusRow(target?.id);
      if (multiple && event.shiftKey && target) select(target, { range: true });
    } else if (key === "ArrowRight") {
      handled();
      if (expandable(node) && !isOpen(node.id)) toggle(node.id, true);
      else if (isOpen(node.id)) focusRow(rows[index + 1]?.node.id);
    } else if (key === "ArrowLeft") {
      handled();
      if (openSet.has(node.id)) toggle(node.id, false);
      else focusRow(row.parent ?? undefined);
    } else if (key === " ") {
      handled();
      if (node.disabled) return;
      if (checkable) flipCheck(node.id);
      else select(node, { toggle: multiple });
    } else if (key === "Enter") {
      handled();
      if (node.disabled) return;
      select(node);
      onActivate?.(node);
    } else if (key === "a" && (event.ctrlKey || event.metaKey) && multiple) {
      handled();
      setMulti(keys);
    } else if (PRINTABLE.test(key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
      // typeahead: letters typed within half a second build a prefix
      const now = Date.now();
      typed.current = {
        text: (now - typed.current.at < 500 ? typed.current.text : "") + key.toLowerCase(),
        at: now,
      };
      const prefix = typed.current.text;
      const order = [...rows.slice(index + (prefix.length === 1 ? 1 : 0)), ...rows.slice(0, index)];
      focusRow(order.find((r) => textOf(r.node).startsWith(prefix))?.node.id);
    }
  };

  const dropPos = (event: React.DragEvent<HTMLElement>, node: TreeNode): TreeDropPosition => {
    const r = event.currentTarget.getBoundingClientRect();
    const y = (event.clientY - r.top) / r.height;
    if (y < 0.28) return "before";
    if (y > 0.72) return "after";
    return expandable(node) || !node.children ? "inside" : "after";
  };
  // no dropping a node into itself or its own subtree
  const isInside = (id: string, ancestor: string) => {
    for (let at: string | null | undefined = id; at; at = parentOf.get(at)) if (at === ancestor) return true;
    return false;
  };

  const renderRow = (row: Row, index: number, style?: CSSProperties) => {
    const { node, depth } = row;
    const expandedNow = isOpen(node.id);
    const state = checkable ? checkState(node.id) : undefined;
    return (
      <div
        key={node.id}
        role="treeitem"
        data-id={node.id}
        aria-level={depth + 1}
        aria-posinset={row.pos}
        aria-setsize={row.size}
        aria-expanded={expandable(node) ? expandedNow : undefined}
        aria-selected={isSelected(node.id)}
        aria-checked={state}
        aria-disabled={node.disabled || undefined}
        tabIndex={node.id === tabStop ? 0 : -1}
        className="rk-tree-row"
        data-drop={drop?.id === node.id ? drop.pos : undefined}
        draggable={Boolean(onMove) && !node.disabled}
        style={{ "--rk-depth": depth, ...style } as CSSProperties}
        onFocus={() => setFocused(node.id)}
        onClick={(event) => select(node, { range: event.shiftKey, toggle: event.ctrlKey || event.metaKey })}
        onDoubleClick={() => !node.disabled && onActivate?.(node)}
        onKeyDown={(event) => onKeyDown(event, row, index)}
        onDragStart={(event) => {
          dragged.current = node.id;
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", textOf(node));
        }}
        onDragOver={(event) => {
          const from = dragged.current;
          if (!onMove || !from || isInside(node.id, from)) return;
          event.preventDefault();
          const pos = dropPos(event, node);
          if (drop?.id !== node.id || drop.pos !== pos) setDrop({ id: node.id, pos });
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setDrop(null);
        }}
        onDrop={(event) => {
          event.preventDefault();
          const from = dragged.current;
          if (from && drop) onMove?.(from, node.id, drop.pos);
          setDrop(null);
        }}
        onDragEnd={() => {
          dragged.current = null;
          setDrop(null);
        }}
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
            <ChevronRightIcon data-open={expandedNow || undefined} />
          </span>
        ) : (
          <span className="rk-tree-toggle" aria-hidden="true" />
        )}
        {checkable && (
          <span
            className="rk-tree-check"
            data-state={state === "mixed" ? "mixed" : state ? "on" : undefined}
            aria-hidden="true"
            onClick={(event) => {
              event.stopPropagation();
              if (!node.disabled) flipCheck(node.id);
            }}
          >
            {state === "mixed" ? <MinusIcon /> : <CheckIcon />}
          </span>
        )}
        {node.icon && <span className="rk-icon rk-tree-icon">{node.icon}</span>}
        <span className="rk-tree-label">{node.label}</span>
        {node.trailing && <span className="rk-tree-trailing">{node.trailing}</span>}
      </div>
    );
  };

  return (
    <div
      ref={root}
      role="tree"
      aria-label={rest["aria-label"]}
      aria-multiselectable={multiple || undefined}
      className={cx("rk-tree", className)}
      data-virtual={height ? "" : undefined}
      style={height ? { height } : undefined}
    >
      {height ? (
        <div className="rk-tree-space" style={{ height: virtual.total }}>
          {virtual.items.map((v) => {
            const row = rows[v.index];
            return row
              ? renderRow(row, v.index, { position: "absolute", top: v.start, insetInline: 0 })
              : null;
          })}
        </div>
      ) : (
        rows.map((row, index) => renderRow(row, index))
      )}
    </div>
  );
}
