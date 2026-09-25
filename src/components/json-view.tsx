import { type CSSProperties, type KeyboardEvent, useMemo, useRef, useState } from "react";
import { announce } from "../lib/announce";
import { cx } from "../lib/cx";
import { useClipboard } from "../lib/hooks";
import { ChevronRightIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { CopyButton } from "./copy-button";

type Path = ReadonlyArray<string | number>;

const IDENT = /^[A-Za-z_$][\w$]*$/;

/** `$.config.layers[2]["dropout rate"]` */
export function jsonPath(path: Path): string {
  return path.reduce<string>(
    (out, part) =>
      typeof part === "number"
        ? `${out}[${part}]`
        : IDENT.test(part)
          ? `${out}.${part}`
          : `${out}[${JSON.stringify(part)}]`,
    "$",
  );
}

const isBranch = (v: unknown): v is Record<string, unknown> | unknown[] =>
  typeof v === "object" && v !== null && !(v instanceof Date);

const entries = (v: Record<string, unknown> | unknown[]): Array<[string | number, unknown]> =>
  Array.isArray(v) ? v.map((x, i) => [i, x]) : Object.entries(v);

function kindOf(v: unknown) {
  if (v === null) return "null";
  if (v instanceof Date) return "string";
  return typeof v === "bigint" ? "number" : typeof v;
}

function scalar(v: unknown): string {
  if (typeof v === "string") return JSON.stringify(v);
  if (v instanceof Date) return JSON.stringify(v.toISOString());
  if (typeof v === "bigint") return `${v}n`;
  return String(v);
}

/** The value as pretty JSON for copying (bigints as strings, circular or odd values as text). */
function toJson(v: unknown): string {
  try {
    return JSON.stringify(v, (_key, x) => (typeof x === "bigint" ? `${x}` : x), 2) ?? scalar(v);
  } catch {
    return scalar(v);
  }
}

interface Row {
  id: string;
  path: Path;
  depth: number;
  key: string | number | null;
  value: unknown;
  branch: boolean;
  parent: string | null;
}

export interface JsonViewProps {
  data: unknown;
  /** Levels open at first (0 = only the root row). */
  defaultExpandDepth?: number;
  /** Row actions to copy the value (as JSON) and its path; `c` / `p` do the same on a focused row. */
  copyable?: boolean;
  /** Longer strings are cut with an ellipsis (the full text is in the tooltip and the copy). */
  maxStringLength?: number;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

/**
 * Collapsible JSON tree: typed colors, sizes of collapsed objects/arrays, indent guides, copy value or
 * path. Tree keyboard per APG (↑/↓, ←/→, Home/End, Enter/Space toggles); children mount on expand.
 */
export function JsonView({
  data,
  defaultExpandDepth = 1,
  copyable = true,
  maxStringLength = 120,
  className,
  style,
  ...rest
}: JsonViewProps) {
  const labels = useLabels();
  const clipboard = useClipboard();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<ReadonlySet<string>>(() => {
    const ids = new Set<string>();
    const walk = (v: unknown, path: Path) => {
      if (!isBranch(v) || path.length >= defaultExpandDepth) return;
      ids.add(jsonPath(path));
      for (const [k, x] of entries(v)) walk(x, [...path, k]);
    };
    walk(data, []);
    return ids;
  });
  const [active, setActive] = useState<string | null>(null);

  const rows = useMemo(() => {
    const out: Row[] = [];
    const walk = (v: unknown, path: Path, key: string | number | null, parent: string | null) => {
      const id = jsonPath(path);
      const branch = isBranch(v);
      out.push({ id, path, depth: path.length, key, value: v, branch, parent });
      if (branch && open.has(id)) for (const [k, x] of entries(v)) walk(x, [...path, k], k, id);
    };
    walk(data, [], null, null);
    return out;
  }, [data, open]);

  const toggle = (id: string, to?: boolean) => {
    const next = new Set(open);
    if (to ?? !next.has(id)) next.add(id);
    else next.delete(id);
    setOpen(next);
  };
  const focus = (id: string | null | undefined) => {
    if (!id) return;
    setActive(id);
    root.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)?.focus();
  };
  const copy = async (text: string) => {
    if (await clipboard.copy(text)) announce(labels.copied);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>, row: Row, i: number) => {
    const isOpen = open.has(row.id);
    switch (event.key) {
      case "ArrowDown":
        focus(rows[i + 1]?.id);
        break;
      case "ArrowUp":
        focus(rows[i - 1]?.id);
        break;
      case "Home":
        focus(rows[0]?.id);
        break;
      case "End":
        focus(rows.at(-1)?.id);
        break;
      case "ArrowRight":
        if (row.branch && !isOpen) toggle(row.id, true);
        else if (isOpen) focus(rows[i + 1]?.id);
        break;
      case "ArrowLeft":
        if (isOpen) toggle(row.id, false);
        else focus(row.parent);
        break;
      case "Enter":
      case " ":
        if (row.branch) toggle(row.id);
        break;
      case "c":
        if (!copyable) return;
        copy(toJson(row.value));
        break;
      case "p":
        if (!copyable) return;
        copy(jsonPath(row.path));
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const tabStop = active && rows.some((r) => r.id === active) ? active : rows[0]?.id;

  return (
    <div
      ref={root}
      role="tree"
      aria-label={rest["aria-label"]}
      className={cx("rk-json", className)}
      style={style}
    >
      {rows.map((row, i) => {
        const isOpen = open.has(row.id);
        const kind = row.branch ? (Array.isArray(row.value) ? "array" : "object") : kindOf(row.value);
        const size = row.branch ? entries(row.value as Record<string, unknown>).length : 0;
        const text = row.branch ? "" : scalar(row.value);
        const shown = text.length > maxStringLength ? `${text.slice(0, maxStringLength)}…` : text;
        return (
          <div
            key={row.id}
            role="treeitem"
            data-id={row.id}
            aria-level={row.depth + 1}
            aria-expanded={row.branch ? isOpen : undefined}
            tabIndex={row.id === tabStop ? 0 : -1}
            className="rk-json-row"
            style={{ "--rk-depth": row.depth } as CSSProperties}
            onFocus={() => setActive(row.id)}
            onPointerEnter={() => setActive(row.id)}
            onClick={(event) => {
              // the copy buttons live in the row
              if (row.branch && !(event.target as HTMLElement).closest("button")) toggle(row.id);
            }}
            onKeyDown={(event) => onKeyDown(event, row, i)}
          >
            <span className="rk-json-toggle" aria-hidden="true">
              {row.branch && <ChevronRightIcon data-open={isOpen || undefined} />}
            </span>
            {row.key !== null && (
              <span className="rk-json-key" data-index={typeof row.key === "number" || undefined}>
                {row.key}
              </span>
            )}
            {row.branch ? (
              <span className="rk-json-summary">
                <span className="rk-json-brace">{kind === "array" ? "[" : "{"}</span>
                {isOpen ? null : <span className="rk-json-brace">…{kind === "array" ? "]" : "}"}</span>}
                <span className="rk-json-size">
                  {kind === "array" ? labels.jsonItems(size) : labels.jsonKeys(size)}
                </span>
              </span>
            ) : (
              <span className="rk-json-value" data-kind={kind} title={shown === text ? undefined : text}>
                {shown}
              </span>
            )}
            {copyable && active === row.id && (
              <span className="rk-json-actions">
                <CopyButton
                  size="sm"
                  tabIndex={-1}
                  label={labels.copyValue}
                  value={() => toJson(row.value)}
                />
                <CopyButton size="sm" tabIndex={-1} label={labels.copyPath} value={jsonPath(row.path)} />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
