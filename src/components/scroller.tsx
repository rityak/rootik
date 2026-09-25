import { type HTMLAttributes, useCallback, useLayoutEffect, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { ChevronLeftIcon, ChevronRightIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";

export interface ScrollerProps extends HTMLAttributes<HTMLDivElement> {
  /** Arrow buttons at the edges that can scroll (default true). */
  controls?: boolean;
  /** Mouse drag scrolls the row (default true; touch and trackpads scroll natively anyway). */
  draggable?: boolean;
}

/**
 * Horizontal overflow for tab bars, chip rows and docks on narrow screens. Edges fade and show an arrow
 * only in a direction that can still scroll; the native scrollbar is hidden.
 */
export function Scroller({ controls = true, draggable = true, className, children, ...rest }: ScrollerProps) {
  const labels = useLabels();
  const viewport = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ back: false, forward: false });

  const measure = useCallback(() => {
    const el = viewport.current;
    if (!el) return;
    const back = el.scrollLeft > 1;
    const forward = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    setEdges((prev) => (prev.back === back && prev.forward === forward ? prev : { back, forward }));
  }, []);

  useLayoutEffect(() => {
    const el = viewport.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    for (const child of el.children) observer.observe(child);
    return () => observer.disconnect();
  }, [measure]);

  const page = (dir: 1 | -1) => {
    const el = viewport.current;
    if (!el) return;
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: smooth ? "smooth" : "auto" });
  };

  // mouse drag: scroll after a few pixels of travel, and swallow the click that ends a drag
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || event.pointerType !== "mouse" || event.button !== 0 || !viewport.current) return;
    drag.current = { x: event.clientX, left: viewport.current.scrollLeft, moved: false };
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = viewport.current;
    if (!d || !el) return;
    const dx = event.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 5) return;
    if (!d.moved) el.setPointerCapture(event.pointerId);
    d.moved = true;
    el.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const moved = drag.current?.moved;
    drag.current = null;
    if (moved)
      viewport.current?.addEventListener("click", (e) => e.stopPropagation(), { capture: true, once: true });
  };

  return (
    <div
      {...rest}
      className={cx("rk-scroller", className)}
      data-back={edges.back || undefined}
      data-forward={edges.forward || undefined}
    >
      <div
        ref={viewport}
        className="rk-scroller-viewport"
        onScroll={measure}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {children}
      </div>
      {controls && (
        <>
          <button
            type="button"
            tabIndex={-1}
            className="rk-scroller-btn"
            data-dir="back"
            aria-label={labels.scrollBack}
            hidden={!edges.back}
            onClick={() => page(-1)}
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            tabIndex={-1}
            className="rk-scroller-btn"
            data-dir="forward"
            aria-label={labels.scrollForward}
            hidden={!edges.forward}
            onClick={() => page(1)}
          >
            <ChevronRightIcon />
          </button>
        </>
      )}
    </div>
  );
}
