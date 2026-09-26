import { type RefObject, useLayoutEffect, useState } from "react";

export interface IndicatorBox {
  /** Offsets from the container's start and end edges: left/right, or top/bottom on the `y` axis. */
  left: number;
  right: number;
  /** Movement direction: the leading edge animates faster, so the indicator stretches in flight. */
  dir: -1 | 0 | 1;
}

/** Measures the element matching `selector` inside `container` for a sliding selection indicator. */
export function useIndicator(
  container: RefObject<HTMLElement | null>,
  selector: string,
  key: unknown,
  axis: "x" | "y" = "x",
) {
  const [box, setBox] = useState<IndicatorBox | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` is the trigger to re-measure
  useLayoutEffect(() => {
    const el = container.current;
    if (!el) return;
    const measure = () => {
      const active = el.querySelector<HTMLElement>(selector);
      if (!active) return setBox(null);
      const left = axis === "x" ? active.offsetLeft : active.offsetTop;
      const right =
        axis === "x"
          ? el.clientWidth - left - active.offsetWidth
          : el.scrollHeight - left - active.offsetHeight;
      setBox((prev) =>
        prev && prev.left === left && prev.right === right
          ? prev
          : { left, right, dir: !prev ? 0 : left > prev.left ? 1 : left < prev.left ? -1 : 0 },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    for (const child of el.children) observer.observe(child);
    return () => observer.disconnect();
  }, [container, selector, key, axis]);
  return box;
}
