import { type ReactNode, useId, useMemo, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { Floating } from "../lib/floating";
import { useControllable } from "../lib/hooks";
import { ChevronDownIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import type { Size } from "./button";
import { SearchInput, useField } from "./input";
import { Tree, type TreeNode } from "./tree";

export interface TreeSelectProps {
  items: ReadonlyArray<TreeNode>;
  /** Single: the picked node id. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (id: string, node: TreeNode) => void;
  /** Many: checked leaf ids (tri-state parents), shown as a count in the trigger. */
  multiple?: boolean;
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (ids: string[]) => void;
  placeholder?: ReactNode;
  /** Search box above the tree (default on). */
  searchable?: boolean;
  size?: Size;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

/** Pick from a hierarchy (folder, category, layer) in a select-like field; covers Cascader cases too. */
export function TreeSelect({
  items,
  value,
  defaultValue = null,
  onChange,
  multiple,
  values,
  defaultValues = [],
  onValuesChange,
  placeholder,
  searchable = true,
  size = "md",
  disabled,
  className,
  ...rest
}: TreeSelectProps) {
  const labels = useLabels();
  const field = useField(rest);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useControllable(value, defaultValue, (id) => {
    const node = id ? find(items, id) : undefined;
    if (id && node) onChange?.(id, node);
  });
  const [checked, setChecked] = useControllable(values, defaultValues, onValuesChange);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const node = useMemo(() => (picked ? find(items, picked) : undefined), [items, picked]);
  // the picked node's ancestors start expanded, so the tree opens where the value is
  const expanded = useMemo(() => (picked ? pathTo(items, picked) : []), [items, picked]);

  const summary = multiple
    ? checked.length > 0
      ? labels.selectedCount(checked.length)
      : undefined
    : node && (node.text ?? node.label);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        {...field}
        aria-label={rest["aria-label"]}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}
        className={cx("rk-select-trigger", className)}
        data-size={size}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className="rk-select-value" data-placeholder={summary === undefined || undefined}>
          {summary ?? placeholder ?? labels.select}
        </span>
        <ChevronDownIcon className="rk-select-chevron" />
      </button>
      <Floating
        id={panelId}
        role="dialog"
        aria-label={rest["aria-label"]}
        anchor={trigger}
        open={open}
        matchWidth
        onOpenChange={(next) => {
          if (!next) {
            setQuery("");
            if (trigger.current && document.activeElement?.closest(`#${CSS.escape(panelId)}`))
              trigger.current.focus();
          }
          setOpen(next);
        }}
        className="rk-menu rk-tree-select"
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        {searchable && (
          <SearchInput
            size="sm"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            // ↓ from the search box goes into the tree
            onKeyDown={(event) => {
              if (event.key !== "ArrowDown") return;
              event.preventDefault();
              event.currentTarget
                .closest(".rk-tree-select")
                ?.querySelector<HTMLElement>('[role="treeitem"]')
                ?.focus();
            }}
          />
        )}
        <Tree
          aria-label={rest["aria-label"]}
          items={items}
          filter={query}
          defaultExpanded={expanded}
          {...(multiple
            ? { checkable: true, checked, onCheckedChange: setChecked }
            : {
                selected: picked,
                onSelect: (id: string) => {
                  setPicked(id);
                  setOpen(false);
                  trigger.current?.focus();
                },
              })}
        />
      </Floating>
    </>
  );
}

function find(nodes: ReadonlyArray<TreeNode>, id: string): TreeNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    const hit = n.children && find(n.children, id);
    if (hit) return hit;
  }
  return undefined;
}

function pathTo(nodes: ReadonlyArray<TreeNode>, id: string, trail: string[] = []): string[] {
  for (const n of nodes) {
    if (n.id === id) return trail;
    const hit = n.children && pathTo(n.children, id, [...trail, n.id]);
    if (hit && hit.length > 0) return hit;
  }
  return [];
}
