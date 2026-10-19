import { type HTMLAttributes, type ReactNode, useRef, useState } from "react";
import { announce } from "../lib/announce";
import { cx } from "../lib/cx";
import { icon } from "../lib/icons";
import { useLabels } from "../lib/labels";

const GripIcon = icon(
  <>
    <circle cx="9" cy="6" r="1" />
    <circle cx="15" cy="6" r="1" />
    <circle cx="9" cy="12" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="9" cy="18" r="1" />
    <circle cx="15" cy="18" r="1" />
  </>,
);

export interface SortableListProps<T> extends Omit<HTMLAttributes<HTMLUListElement>, "children"> {
  items: ReadonlyArray<T>;
  getKey: (item: T) => string;
  /** Spoken name of an item ("Frankfurt"). */
  getLabel: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  onReorder: (items: T[]) => void;
}

const move = <T,>(list: ReadonlyArray<T>, from: number, to: number) => {
  const out = [...list];
  const [item] = out.splice(from, 1);
  if (item !== undefined) out.splice(to, 0, item);
  return out;
};

/**
 * Reorderable list (priorities, node order, pipeline steps). Drag the grip, or focus it and press Space to
 * lift, ↑/↓ to move, Space to drop, Esc to cancel; every step is announced.
 */
export function SortableList<T>({
  items,
  getKey,
  getLabel,
  renderItem,
  onReorder,
  className,
  ...rest
}: SortableListProps<T>) {
  const labels = useLabels();
  const [preview, setPreview] = useState<ReadonlyArray<T> | null>(null);
  const [lifted, setLifted] = useState<string | null>(null);
  const list = useRef<HTMLUListElement>(null);
  // React moves the focused row's DOM node on reorder, which blurs it: that blur must not cancel the lift
  const moving = useRef(false);
  const shown = preview ?? items;

  const focusGrip = (key: string) =>
    requestAnimationFrame(() => {
      list.current?.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"] .rk-sortable-grip`)?.focus();
      moving.current = false;
    });
  const drop = (commit: boolean, item: T) => {
    if (commit && preview) onReorder([...preview]);
    announce(
      commit
        ? labels.dropped(getLabel(item), shown.indexOf(item) + 1)
        : labels.reorderCancelled(getLabel(item)),
    );
    setPreview(null);
    setLifted(null);
  };

  return (
    <ul ref={list} {...rest} className={cx("rk-sortable", className)}>
      {shown.map((item, index) => {
        const key = getKey(item);
        const isLifted = lifted === key;
        return (
          <li key={key} data-key={key} className="rk-sortable-item" data-lifted={isLifted || undefined}>
            <button
              type="button"
              className="rk-sortable-grip"
              aria-label={labels.reorder(getLabel(item))}
              aria-pressed={isLifted}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  if (isLifted) drop(true, item);
                  else {
                    setLifted(key);
                    setPreview(items);
                    announce(labels.lifted(getLabel(item), index + 1, items.length));
                  }
                } else if (isLifted && event.key === "Escape") {
                  event.preventDefault();
                  drop(false, item);
                  focusGrip(key);
                } else if (isLifted && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
                  event.preventDefault();
                  const to = index + (event.key === "ArrowUp" ? -1 : 1);
                  if (to < 0 || to >= shown.length) return;
                  moving.current = true;
                  setPreview(move(shown, index, to));
                  announce(labels.movedTo(to + 1, shown.length));
                  focusGrip(key);
                }
              }}
              onBlur={() => isLifted && !moving.current && drop(false, item)}
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                event.preventDefault();
                // window listeners: reordering moves this row's node, which drops pointer capture
                let order: ReadonlyArray<T> = items;
                setLifted(key);
                setPreview(order);
                const onMove = (e: PointerEvent) => {
                  const rows = Array.from(list.current?.children ?? []) as HTMLElement[];
                  const from = order.indexOf(item);
                  let to = rows.findIndex((row) => {
                    const r = row.getBoundingClientRect();
                    return e.clientY < r.top + r.height / 2;
                  });
                  if (to === -1) to = rows.length - 1;
                  else if (to > from) to -= 1;
                  if (to !== from) {
                    order = move(order, from, to);
                    setPreview(order);
                  }
                };
                const onUp = (e: PointerEvent) => {
                  window.removeEventListener("pointermove", onMove);
                  window.removeEventListener("pointerup", onUp);
                  window.removeEventListener("pointercancel", onUp);
                  if (e.type === "pointerup") onReorder([...order]);
                  setPreview(null);
                  setLifted(null);
                };
                window.addEventListener("pointermove", onMove);
                window.addEventListener("pointerup", onUp);
                window.addEventListener("pointercancel", onUp);
              }}
            >
              <GripIcon />
            </button>
            <div className="rk-sortable-content">{renderItem(item)}</div>
          </li>
        );
      })}
    </ul>
  );
}
