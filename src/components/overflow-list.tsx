import { type HTMLAttributes, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { useLabels } from "../lib/labels";
import { Popover } from "./menu";

/**
 * How many items fit: widths in order, the gap between them, room for the "+N" indicator.
 * Pure so it's testable; `OverflowList` feeds it measured widths.
 */
export function fitCount(
  widths: readonly number[],
  available: number,
  gap: number,
  indicator: number,
  minVisible = 0,
) {
  const total = widths.reduce((sum, w) => sum + w, 0) + gap * Math.max(0, widths.length - 1);
  if (total <= available) return widths.length;
  let used = indicator;
  let count = 0;
  for (const w of widths) {
    const next = used + gap + w;
    if (next > available) break;
    used = next;
    count++;
  }
  return Math.max(minVisible, count);
}

export interface OverflowListProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: readonly T[];
  renderItem: (item: T, index: number) => ReactNode;
  /** Replaces the default "+N" chip with a popover of the hidden items. */
  renderOverflow?: (hidden: T[]) => ReactNode;
  /** Never collapse below this many visible items. */
  minVisible?: number;
  /** `start` keeps the tail visible (breadcrumbs, recent paths). */
  collapseFrom?: "end" | "start";
}

/**
 * Priority+ row: items that don't fit collapse into a "+N" chip that opens the rest. Widths are
 * measured on an inert copy of the row, so it recomputes on resize without flicker.
 */
export function OverflowList<T>({
  items,
  renderItem,
  renderOverflow,
  minVisible = 0,
  collapseFrom = "end",
  className,
  ...rest
}: OverflowListProps<T>) {
  const labels = useLabels();
  const root = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(items.length);

  useLayoutEffect(() => {
    const el = root.current;
    const probe = measure.current;
    if (!el || !probe) return;
    const update = () => {
      const kids = Array.from(probe.children) as HTMLElement[];
      const indicator = kids.pop()?.offsetWidth ?? 0;
      let widths = kids.map((k) => k.offsetWidth);
      if (collapseFrom === "start") widths = widths.reverse();
      const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
      setVisible(fitCount(widths, el.clientWidth, gap, indicator, minVisible));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    observer.observe(probe);
    return () => observer.disconnect();
  }, [collapseFrom, minVisible]);

  const cut = collapseFrom === "end" ? visible : items.length - visible;
  const shown = collapseFrom === "end" ? items.slice(0, cut) : items.slice(cut);
  const hidden = collapseFrom === "end" ? items.slice(cut) : items.slice(0, cut);
  const offset = collapseFrom === "end" ? 0 : cut;

  const more = (count: number, list: T[]) =>
    renderOverflow ? (
      renderOverflow(list)
    ) : (
      <Popover
        placement={collapseFrom === "end" ? "bottom-end" : "bottom-start"}
        trigger={
          <button type="button" className="rk-overflow-more rk-num" aria-label={labels.moreItems(count)}>
            {labels.moreCount(count)}
          </button>
        }
      >
        <div className="rk-overflow-menu">
          {list.map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: items are positional; callers key inside
            <div key={i}>{renderItem(item, (collapseFrom === "end" ? cut : 0) + i)}</div>
          ))}
        </div>
      </Popover>
    );

  return (
    <div {...rest} ref={root} className={cx("rk-overflow-list", className)}>
      {collapseFrom === "start" && hidden.length > 0 && more(hidden.length, hidden)}
      {shown.map((item, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: items are positional; callers key inside
        <div key={offset + i} className="rk-overflow-item">
          {renderItem(item, offset + i)}
        </div>
      ))}
      {collapseFrom === "end" && hidden.length > 0 && more(hidden.length, hidden)}
      <div ref={measure} className="rk-overflow-measure" aria-hidden="true" inert>
        {items.map((item, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: measurement copy
          <div key={i} className="rk-overflow-item">
            {renderItem(item, i)}
          </div>
        ))}
        <span className="rk-overflow-more rk-num">{labels.moreCount(items.length)}</span>
      </div>
    </div>
  );
}
