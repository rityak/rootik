import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { readStorage, useControllable, writeStorage } from "../lib/hooks";
import { useLabels } from "../lib/labels";

export interface SplitterProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** horizontal — panes side by side; vertical — stacked. */
  orientation?: "horizontal" | "vertical";
  /** Size of the first pane in percent. */
  size?: number;
  defaultSize?: number;
  onSizeChange?: (size: number) => void;
  /** Bounds for the first pane, percent. */
  min?: number;
  max?: number;
  /** Remember the size in localStorage under this key (uncontrolled only). */
  storageKey?: string;
  /** Accessible name of the divider (default labels.resize). */
  handleLabel?: string;
  /** Exactly two panes. */
  children: [ReactNode, ReactNode];
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Two panes with a draggable divider (list + preview, editor + output). The divider is a focusable
 * window splitter per APG: ←/→ (↑/↓ when stacked) by 2% (Shift 10%), Home/End to the bounds,
 * Enter or double-click back to the default split.
 */
export function Splitter({
  orientation = "horizontal",
  size,
  defaultSize = 50,
  onSizeChange,
  min = 15,
  max = 85,
  storageKey,
  handleLabel,
  className,
  style,
  children,
  ...rest
}: SplitterProps) {
  const labels = useLabels();
  const root = useRef<HTMLDivElement>(null);
  const [initial] = useState(() => clamp(readStorage(storageKey, defaultSize), min, max));
  const [current, setCurrent] = useControllable(size, initial, onSizeChange);
  const [dragging, setDragging] = useState(false);
  const horizontal = orientation === "horizontal";
  const [first, second] = Children.toArray(children);

  const commit = (next: number) => {
    const v = Math.round(clamp(next, min, max) * 10) / 10;
    setCurrent(v);
    if (size === undefined) writeStorage(storageKey, v);
  };

  const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const r = root.current?.getBoundingClientRect();
    if (!r) return;
    commit(
      horizontal ? ((event.clientX - r.left) / r.width) * 100 : ((event.clientY - r.top) / r.height) * 100,
    );
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2;
    const back = horizontal ? "ArrowLeft" : "ArrowUp";
    const forward = horizontal ? "ArrowRight" : "ArrowDown";
    if (event.key === back) commit(current - step);
    else if (event.key === forward) commit(current + step);
    else if (event.key === "Home") commit(min);
    else if (event.key === "End") commit(max);
    else if (event.key === "Enter") commit(defaultSize);
    else return;
    event.preventDefault();
  };

  return (
    <div
      {...rest}
      ref={root}
      className={cx("rk-splitter", className)}
      data-orientation={orientation}
      data-dragging={dragging || undefined}
      style={{ ...style, "--rk-split": `${current}%` } as CSSProperties}
    >
      <div className="rk-splitter-pane">{first}</div>
      {/* biome-ignore lint/a11y/useSemanticElements: an <hr> can't be a focusable splitter */}
      <div
        role="separator"
        tabIndex={0}
        aria-orientation={horizontal ? "vertical" : "horizontal"}
        aria-valuenow={Math.round(current)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={handleLabel ?? labels.resize}
        className="rk-splitter-handle"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.focus();
          setDragging(true);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onDoubleClick={() => commit(defaultSize)}
        onKeyDown={onKeyDown}
      />
      <div className="rk-splitter-pane">{second}</div>
    </div>
  );
}
