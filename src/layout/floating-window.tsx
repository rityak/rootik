import {
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { clampFloatingPosition, floatingViewport } from "../lib/floating";
import { XIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { OverlayDecoration, type OverlaySurfaceOptions, overlaySurfaceStyle } from "../overlays/surface";

export interface FloatingWindowProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  surface?: OverlaySurfaceOptions;
  title: ReactNode;
  /** Defaults to true so `{show && <FloatingWindow …/>}` works. */
  open?: boolean;
  onClose?: () => void;
  /** Initial top-left corner, px from the viewport. */
  defaultPosition?: { x: number; y: number };
  width?: number;
  height?: number;
  /** Header-right controls before the close button. */
  actions?: ReactNode;
}

const KEY_STEP = 16;

/**
 * Non-modal panel over the app (inspector, log, preview): drag it by the title bar (or focus the bar and
 * use arrow keys), resize it from the corner. Lives in the top layer, so it stays above page content.
 */
export function FloatingWindow({
  title,
  surface,
  onKeyDown,
  open = true,
  onClose,
  defaultPosition = { x: 80, y: 80 },
  width = 360,
  height = 280,
  actions,
  className,
  style,
  children,
  ...rest
}: FloatingWindowProps) {
  const strings = useLabels();
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [pos, setPos] = useState(defaultPosition);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.matches(":popover-open")) el.showPopover();
    else if (!open && el.matches(":popover-open")) el.hidePopover();
  }, [open]);

  const clamp = useCallback(
    (x: number, y: number) => {
      const viewport = floatingViewport();
      const el = ref.current;
      const maxWidth = Math.max(0, viewport.width - 16);
      const maxHeight = Math.max(0, viewport.height - 16);
      const w = el?.offsetWidth || Math.min(width, maxWidth);
      const h = el?.offsetHeight || Math.min(height, maxHeight);
      return clampFloatingPosition(x, y, w, h, viewport);
    },
    [width, height],
  );

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !open) return;
    const fit = () => {
      const viewport = floatingViewport();
      const maxWidth = Math.max(0, viewport.width - 16);
      const maxHeight = Math.max(0, viewport.height - 16);
      el.style.setProperty("--rk-floating-max-w", `${maxWidth}px`);
      el.style.setProperty("--rk-floating-max-h", `${maxHeight}px`);
      const w = el.offsetWidth || Math.min(width, maxWidth);
      const h = el.offsetHeight || Math.min(height, maxHeight);
      setPos((prev) => {
        const next = clampFloatingPosition(prev.x, prev.y, w, h, viewport);
        return next.x === prev.x && next.y === prev.y ? prev : next;
      });
    };
    fit();
    const resize = new ResizeObserver(fit);
    resize.observe(el);
    const viewport = window.visualViewport;
    window.addEventListener("resize", fit);
    viewport?.addEventListener("resize", fit);
    viewport?.addEventListener("scroll", fit);
    return () => {
      resize.disconnect();
      window.removeEventListener("resize", fit);
      viewport?.removeEventListener("resize", fit);
      viewport?.removeEventListener("scroll", fit);
    };
  }, [open, width, height]);

  return (
    <div
      {...rest}
      ref={ref}
      popover="manual"
      role="dialog"
      aria-labelledby={titleId}
      className={cx("rk-floating-window rk-floating rk-overlay", className)}
      data-surface={surface ? "" : undefined}
      data-placed=""
      style={{ left: pos.x, top: pos.y, width, height, ...overlaySurfaceStyle(surface), ...style }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "Escape" && onClose) {
          event.stopPropagation();
          onClose();
        }
      }}
    >
      <OverlayDecoration surface={surface} />
      <div
        className="rk-floating-window-bar"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          if (
            (event.target as Element).closest(
              "button:not(.rk-floating-window-title), a, input, select, textarea, [contenteditable]",
            )
          )
            return;
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { dx: event.clientX - pos.x, dy: event.clientY - pos.y };
        }}
        onPointerMove={(event) => {
          if (drag.current) setPos(clamp(event.clientX - drag.current.dx, event.clientY - drag.current.dy));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onLostPointerCapture={() => {
          drag.current = null;
        }}
      >
        {/* a button so keyboard users have a handle: arrow keys move the window */}
        <button
          type="button"
          id={titleId}
          className="rk-floating-window-title"
          aria-description={strings.moveWithArrows}
          onKeyDown={(event) => {
            const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[
              event.key
            ];
            if (!d) return;
            event.preventDefault();
            const step = event.shiftKey ? KEY_STEP * 4 : KEY_STEP;
            setPos((p) => clamp(p.x + (d[0] ?? 0) * step, p.y + (d[1] ?? 0) * step));
          }}
        >
          {title}
        </button>
        {actions}
        {onClose && (
          <button
            type="button"
            className="rk-floating-window-close"
            aria-label={strings.close}
            onClick={onClose}
          >
            <XIcon />
          </button>
        )}
      </div>
      <div className="rk-floating-window-body">{children}</div>
    </div>
  );
}
