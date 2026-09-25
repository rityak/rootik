import { useCallback, useMemo, useRef } from "react";
import { useControllable } from "./hooks";

export type SelectionMode = "single" | "multiple";

export interface SelectIntent {
  /** Shift: extend from the anchor to this key. */
  range?: boolean;
  /** Ctrl/⌘ or a checkbox: flip this key, keep the rest. */
  toggle?: boolean;
}

/**
 * Next selection after activating `key` (pure; `useSelection` wires it to state).
 * Plain activation selects only `key`; `toggle` flips it; `range` selects anchor..key in `keys` order,
 * added to the current selection when combined with `toggle`.
 */
export function nextSelection<K>(
  current: readonly K[],
  keys: readonly K[],
  key: K,
  { range, toggle }: SelectIntent,
  mode: SelectionMode,
  anchor: K | undefined,
): K[] {
  if (mode === "single") return current.length === 1 && current[0] === key && toggle ? [] : [key];
  if (range && anchor !== undefined) {
    const a = keys.indexOf(anchor);
    const b = keys.indexOf(key);
    if (a >= 0 && b >= 0) {
      const span = keys.slice(Math.min(a, b), Math.max(a, b) + 1);
      if (!toggle) return span;
      const set = new Set(current);
      for (const k of span) set.add(k);
      return keys.filter((k) => set.has(k));
    }
  }
  if (toggle) return current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
  return [key];
}

export interface UseSelectionOptions<K> {
  /** Every selectable key in display order (range selection follows it). */
  keys: readonly K[];
  mode?: SelectionMode;
  value?: K[];
  defaultValue?: K[];
  onChange?: (value: K[]) => void;
}

/**
 * Selection state for lists, tables, trees and grids: single or multiple, Shift ranges, Ctrl/⌘ toggles,
 * select all. `select(key, event)` reads the modifiers from a pointer or keyboard event.
 */
export function useSelection<K>({
  keys,
  mode = "multiple",
  value,
  defaultValue = [],
  onChange,
}: UseSelectionOptions<K>) {
  const [selected, setSelected] = useControllable(value, defaultValue, onChange);
  const anchor = useRef<K | undefined>(undefined);
  const set = useMemo(() => new Set(selected), [selected]);

  const select = useCallback(
    (key: K, intent: SelectIntent | { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean } = {}) => {
      const how =
        "shiftKey" in intent || "ctrlKey" in intent || "metaKey" in intent
          ? { range: Boolean(intent.shiftKey), toggle: Boolean(intent.ctrlKey || intent.metaKey) }
          : (intent as SelectIntent);
      setSelected(nextSelection(selected, keys, key, how, mode, anchor.current));
      if (!how.range) anchor.current = key;
    },
    [selected, keys, mode, setSelected],
  );

  const count = keys.reduce((n, k) => (set.has(k) ? n + 1 : n), 0);
  return {
    selected,
    count,
    isSelected: (key: K) => set.has(key),
    select,
    /** Checkbox behaviour: flip one key (Shift extends the range). */
    toggle: (key: K, shiftKey = false) => select(key, { toggle: true, range: shiftKey }),
    selectAll: () => setSelected([...keys]),
    clear: () => setSelected([]),
    allSelected: keys.length > 0 && count === keys.length,
    someSelected: count > 0 && count < keys.length,
  };
}
