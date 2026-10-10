import {
  type HTMLAttributes,
  type Ref,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { cx } from "./cx";
import { mergeRefs, useLatest } from "./hooks";

type Side = "top" | "bottom" | "left" | "right";
export type Placement = Side | `${Side}-start` | `${Side}-end`;
/** Element ref or a function returning a rect (virtual anchor: pointer position for context menus). */
export type Anchor = RefObject<Element | null> | (() => DOMRect | null);

const PAD = 8;
const OPPOSITE: Record<Side, Side> = { top: "bottom", bottom: "top", left: "right", right: "left" };

export function computePosition(a: DOMRect, w: number, h: number, placement: Placement, gap: number) {
  const [first, align = "center"] = placement.split("-") as [Side, string?];
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const room: Record<Side, number> = { top: a.top, bottom: vh - a.bottom, left: a.left, right: vw - a.right };
  const vertical = first === "top" || first === "bottom";
  const need = (vertical ? h : w) + gap + PAD;
  const side = room[first] < need && room[OPPOSITE[first]] > room[first] ? OPPOSITE[first] : first;
  let x: number;
  let y: number;
  if (vertical) {
    y = side === "bottom" ? a.bottom + gap : a.top - gap - h;
    x = align === "start" ? a.left : align === "end" ? a.right - w : a.left + a.width / 2 - w / 2;
  } else {
    x = side === "right" ? a.right + gap : a.left - gap - w;
    y = align === "start" ? a.top : align === "end" ? a.bottom - h : a.top + a.height / 2 - h / 2;
  }
  return {
    x: Math.max(PAD, Math.min(x, vw - w - PAD)),
    y: Math.max(PAD, Math.min(y, vh - h - PAD)),
    side,
    available: room[side] - gap - PAD,
  };
}

export interface FloatingProps extends Omit<HTMLAttributes<HTMLDivElement>, "popover"> {
  /** Controlled visibility. Omit when a `popoverTarget` button toggles it natively. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  anchor: Anchor;
  /** Element tracked for layout shifts when `anchor` is a virtual rect function. */
  contextElement?: RefObject<Element | null>;
  placement?: Placement;
  offset?: number;
  /** `manual`: no light dismiss (tooltips, toasts). */
  manual?: boolean;
  /** `popover="hint"`: opened by the browser from an `interestfor` trigger (native tooltips). */
  hint?: boolean;
  /** min-width = anchor width (selects). */
  matchWidth?: boolean;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A top-layer element (Popover API) positioned next to an anchor. Top layer escapes overflow clipping,
 * transforms and backdrop-filter containing blocks, so it works inside dialogs, cards and canvases.
 * Hidden until positioned (`data-placed`) to avoid a frame at the UA default spot.
 */
export function Floating({
  open,
  onOpenChange,
  anchor,
  contextElement,
  placement = "bottom-start",
  offset = 6,
  manual,
  hint,
  matchWidth,
  className,
  ref,
  children,
  ...rest
}: FloatingProps) {
  const own = useRef<HTMLDivElement>(null);
  const onChange = useLatest(onOpenChange);

  const position = useCallback(() => {
    const el = own.current;
    if (!el?.matches(":popover-open")) return;
    const rect = typeof anchor === "function" ? anchor() : anchor.current?.getBoundingClientRect();
    if (!rect) return;
    if (matchWidth) el.style.minWidth = `${rect.width}px`;
    const p = computePosition(rect, el.offsetWidth, el.offsetHeight, placement, offset);
    el.style.left = `${p.x}px`;
    el.style.top = `${p.y}px`;
    el.style.setProperty("--rk-available-h", `${Math.max(120, p.available)}px`);
    el.dataset.side = p.side;
    el.dataset.placed = "";
  }, [anchor, placement, offset, matchWidth]);

  useEffect(() => {
    const el = own.current;
    if (!el) return;
    let frame = 0;
    let move: IntersectionObserver | undefined;
    const element = typeof anchor === "function" ? contextElement?.current : anchor.current;
    const watchMove = (threshold = 1) => {
      move?.disconnect();
      if (!element || !el.matches(":popover-open") || typeof IntersectionObserver === "undefined") return;
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const root = document.documentElement;
      move = new IntersectionObserver(
        ([entry]) => {
          if (!entry || !el.matches(":popover-open")) return;
          const next = element.getBoundingClientRect();
          if (
            next.x !== rect.x ||
            next.y !== rect.y ||
            next.width !== rect.width ||
            next.height !== rect.height
          )
            follow();
          else if (
            entry.intersectionRatio > 0 &&
            entry.intersectionRatio < 1 &&
            entry.intersectionRatio !== threshold
          )
            watchMove(entry.intersectionRatio);
        },
        {
          rootMargin: `${-rect.top}px ${rect.right - root.clientWidth}px ${rect.bottom - root.clientHeight}px ${-rect.left}px`,
          threshold,
        },
      );
      move.observe(element);
    };
    const follow = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        position();
        watchMove();
      });
    };
    const resize = new ResizeObserver(follow);
    const track = () => {
      window.addEventListener("scroll", follow, true);
      window.addEventListener("resize", follow);
      resize.observe(el);
      if (element) resize.observe(element);
      watchMove();
    };
    const onToggle = (event: Event) => {
      const next = (event as ToggleEvent).newState === "open";
      if (next) {
        position();
        track();
      } else {
        delete el.dataset.placed;
        window.removeEventListener("scroll", follow, true);
        window.removeEventListener("resize", follow);
        resize.disconnect();
        move?.disconnect();
        cancelAnimationFrame(frame);
      }
      onChange.current?.(next);
    };
    el.addEventListener("toggle", onToggle);
    if (el.matches(":popover-open")) track();
    return () => {
      el.removeEventListener("toggle", onToggle);
      window.removeEventListener("scroll", follow, true);
      window.removeEventListener("resize", follow);
      resize.disconnect();
      move?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [position, onChange, anchor, contextElement]);

  // anchor/placement changed while open (context menu reopened at a new point)
  useLayoutEffect(position, [position]);

  useLayoutEffect(() => {
    const el = own.current;
    if (!el || open === undefined) return;
    const shown = el.matches(":popover-open");
    if (open && !shown) {
      el.showPopover();
      position();
    } else if (!open && shown) el.hidePopover();
  }, [open, position]);

  return (
    <div
      {...rest}
      ref={mergeRefs(own, ref)}
      popover={hint ? "hint" : manual ? "manual" : "auto"}
      className={cx("rk-floating", className)}
    >
      {children}
    </div>
  );
}
