import { type HTMLAttributes, useRef } from "react";
import { cx } from "../lib/cx";
import { readStorage, useControllable, writeStorage } from "../lib/hooks";
import { useLabels } from "../lib/labels";

export interface ResizablePanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Edge that carries the drag handle. */
  handle?: "right" | "left" | "top" | "bottom";
  size?: number;
  defaultSize?: number;
  min?: number;
  max?: number;
  onSizeChange?: (size: number) => void;
  /** Persist size in localStorage under this key. */
  storageKey?: string;
}

/** Panel with a draggable (and keyboard-resizable) edge: sidebars, inspectors, log docks. */
export function ResizablePanel({
  handle = "right",
  size,
  defaultSize = 260,
  min = 160,
  max = 560,
  onSizeChange,
  storageKey,
  className,
  style,
  children,
  ...rest
}: ResizablePanelProps) {
  const strings = useLabels();
  const [current, setCurrent] = useControllable(size, readStorage(storageKey, defaultSize), onSizeChange);
  const latest = useRef(current);
  latest.current = current;
  const horizontal = handle === "left" || handle === "right";
  const dir = handle === "right" || handle === "bottom" ? 1 : -1;
  const clamp = (v: number) => Math.round(Math.min(max, Math.max(min, v)));
  const commit = (v: number) => {
    setCurrent(v);
    writeStorage(storageKey, v);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const el = event.currentTarget;
    el.setPointerCapture(event.pointerId);
    const start = horizontal ? event.clientX : event.clientY;
    const from = latest.current;
    const move = (e: PointerEvent) =>
      setCurrent(clamp(from + dir * ((horizontal ? e.clientX : e.clientY) - start)));
    const up = () => {
      writeStorage(storageKey, latest.current);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  };

  return (
    <div
      {...rest}
      className={cx("rk-resizable", className)}
      data-handle={handle}
      style={{ ...style, [horizontal ? "width" : "height"]: current }}
    >
      {children}
      {/* biome-ignore lint/a11y/useSemanticElements: an <hr> can't be a focusable splitter */}
      <div
        role="separator"
        tabIndex={0}
        aria-orientation={horizontal ? "vertical" : "horizontal"}
        aria-valuenow={current}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={strings.resize}
        className="rk-resize-handle"
        onPointerDown={onPointerDown}
        onDoubleClick={() => commit(clamp(defaultSize))}
        onKeyDown={(event) => {
          const step = event.shiftKey ? 48 : 12;
          const grow = horizontal ? { ArrowRight: dir, ArrowLeft: -dir } : { ArrowDown: dir, ArrowUp: -dir };
          const d = grow[event.key as keyof typeof grow];
          if (d === undefined) return;
          event.preventDefault();
          commit(clamp(current + d * step));
        }}
      />
    </div>
  );
}
