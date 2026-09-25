import { type RefObject, useCallback, useLayoutEffect, useMemo, useState } from "react";

export interface VirtualItem {
  index: number;
  /** Offset from the start of the list, px. */
  start: number;
  size: number;
}

/** Start offsets for per-index sizes (prefix sums); `offsets[count]` is the total size. */
export function prefixOffsets(count: number, sizeOf: (index: number) => number): number[] {
  const out = new Array<number>(count + 1);
  out[0] = 0;
  for (let i = 0; i < count; i++) out[i + 1] = (out[i] ?? 0) + sizeOf(i);
  return out;
}

/**
 * Indices intersecting [offset, offset + height] plus `overscan` on each side. Pure; `useVirtual`
 * feeds it the scroll position. Fixed sizes are O(1), per-index sizes use a binary search on offsets.
 */
export function virtualRange(
  count: number,
  size: number | readonly number[],
  offset: number,
  height: number,
  overscan: number,
): [first: number, last: number] {
  if (count === 0) return [0, -1];
  let first: number;
  let last: number;
  if (typeof size === "number") {
    first = Math.floor(offset / size);
    last = Math.ceil((offset + height) / size) - 1;
  } else {
    const find = (y: number) => {
      let lo = 0;
      let hi = count - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if ((size[mid] ?? 0) <= y) lo = mid;
        else hi = mid - 1;
      }
      return lo;
    };
    first = find(offset);
    last = find(offset + height);
  }
  return [Math.max(0, first - overscan), Math.min(count - 1, last + overscan)];
}

export interface UseVirtualOptions {
  count: number;
  /** Row height in px, or a function for known per-row heights. */
  size: number | ((index: number) => number);
  /** The scrolling element. */
  scrollRef: RefObject<HTMLElement | null>;
  /** Extra rows rendered above and below the viewport. */
  overscan?: number;
  /** Space inside the scroller before the list starts (sticky header, toolbar), px. */
  scrollMargin?: number;
}

/**
 * Windowing for long lists, tables and logs: renders only the rows in view. Put the rows in a spacer of
 * `total` px and position each at `start` (or pad with `before` / `after`).
 */
export function useVirtual({ count, size, scrollRef, overscan = 6, scrollMargin = 0 }: UseVirtualOptions) {
  const [view, setView] = useState({ offset: 0, height: 0 });

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () =>
      setView((v) =>
        v.offset === el.scrollTop && v.height === el.clientHeight
          ? v
          : { offset: el.scrollTop, height: el.clientHeight },
      );
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [scrollRef]);

  const offsets = useMemo(
    () => (typeof size === "number" ? null : prefixOffsets(count, size)),
    [count, size],
  );
  const startOf = useCallback(
    (i: number) => (offsets ? (offsets[i] ?? 0) : i * (size as number)),
    [offsets, size],
  );
  const sizeOf = (i: number) => (offsets ? (offsets[i + 1] ?? 0) - (offsets[i] ?? 0) : (size as number));
  const total = offsets ? (offsets[count] ?? 0) : count * (size as number);
  const [first, last] = virtualRange(
    count,
    offsets ?? (size as number),
    Math.max(0, view.offset - scrollMargin),
    view.height,
    overscan,
  );

  const items: VirtualItem[] = [];
  for (let i = first; i <= last; i++) items.push({ index: i, start: startOf(i), size: sizeOf(i) });

  const scrollToIndex = useCallback(
    (index: number, align: "start" | "center" | "end" | "nearest" = "nearest") => {
      const el = scrollRef.current;
      if (!el) return;
      const top = scrollMargin + startOf(index);
      const bottom = top + (offsets ? (offsets[index + 1] ?? 0) - (offsets[index] ?? 0) : (size as number));
      const visible = el.clientHeight;
      let next = el.scrollTop;
      if (align === "start") next = top;
      else if (align === "end") next = bottom - visible;
      else if (align === "center") next = top - (visible - (bottom - top)) / 2;
      else if (top < el.scrollTop) next = top;
      else if (bottom > el.scrollTop + visible) next = bottom - visible;
      el.scrollTop = next;
    },
    [scrollRef, scrollMargin, startOf, offsets, size],
  );

  return {
    items,
    total,
    /** Padding above the first rendered row (for table layouts that can't absolutely position rows). */
    before: items[0]?.start ?? 0,
    after: Math.max(0, total - ((items.at(-1)?.start ?? 0) + (items.at(-1)?.size ?? 0))),
    scrollToIndex,
  };
}
