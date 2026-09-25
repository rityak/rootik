import {
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { useControllable, useLatest } from "../lib/hooks";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FitIcon,
  ImageIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "../lib/icons";
import { useLabels } from "../lib/labels";
import { IconButton } from "./button";
import { Spinner } from "./progress";

export interface LightboxImage {
  src: string;
  alt?: string;
  /** Header line next to the counter (file name); defaults to `alt`. */
  title?: ReactNode;
  /** Line under the image. */
  caption?: ReactNode;
  /** Filmstrip thumbnail; defaults to `src`. */
  thumb?: string;
}

/** Zoom relative to the fitted image (1 = fit) and pan from the stage center, in px. */
export interface LightboxView {
  scale: number;
  x: number;
  y: number;
}

interface Box {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

export const FIT_VIEW: LightboxView = { scale: 1, x: 0, y: 0 };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Zoom to `scale` keeping the image point under `at` (relative to the stage center) in place. */
export function zoomAt(view: LightboxView, scale: number, at: Point = { x: 0, y: 0 }): LightboxView {
  const k = scale / view.scale;
  return { scale, x: at.x - (at.x - view.x) * k, y: at.y - (at.y - view.y) * k };
}

/** Pan only as far as the scaled image overflows the stage, so an edge never pulls inside. */
export function clampView(view: LightboxView, content: Box, stage: Box): LightboxView {
  const maxX = Math.max(0, (content.width * view.scale - stage.width) / 2);
  const maxY = Math.max(0, (content.height * view.scale - stage.height) / 2);
  // `|| 0` folds -0 (from clamping into [-0, 0]) so views compare equal
  return { scale: view.scale, x: clamp(view.x, -maxX, maxX) || 0, y: clamp(view.y, -maxY, maxY) || 0 };
}

export interface LightboxProps extends Omit<HTMLAttributes<HTMLDialogElement>, "title"> {
  images: ReadonlyArray<LightboxImage>;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Defaults to true so `{shown && <Lightbox …/>}` works. */
  open?: boolean;
  onClose: () => void;
  /** Wrap around at the ends. */
  loop?: boolean;
  /** Filmstrip under the image; default on for more than one image. */
  thumbnails?: boolean;
  /** Largest zoom as a multiple of the image's natural size. */
  maxZoom?: number;
  /** Extra header buttons for the current image (download, delete, open in folder). */
  actions?: (image: LightboxImage, index: number) => ReactNode;
}

const STEP = 1.5;
const SWIPE = 60;

/**
 * Fullscreen image viewer on a native modal <dialog>. Wheel, pinch, double-click, +/−/0 zoom; drag pans
 * a zoomed image; ←/→, Home/End, swipe and the filmstrip switch images; Esc or a backdrop click closes.
 */
export function Lightbox({
  images,
  index,
  defaultIndex = 0,
  onIndexChange,
  open = true,
  onClose,
  loop,
  thumbnails,
  maxZoom = 4,
  actions,
  className,
  ...rest
}: LightboxProps) {
  const labels = useLabels();
  const [current, setCurrent] = useControllable(index, defaultIndex, onIndexChange);
  const count = images.length;
  const at = clamp(current, 0, Math.max(0, count - 1));
  const image = images[at];

  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const [view, setView] = useState(FIT_VIEW);
  const latestView = useLatest(view);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  // natural size / fitted size: turns the fit-relative scale into a real zoom percentage
  const [actual, setActual] = useState(1);
  const [dragging, setDragging] = useState(false);

  // a new image starts fitted and loading (state adjusted during render, not in an effect)
  const [shown, setShown] = useState(image?.src);
  if (shown !== image?.src) {
    setShown(image?.src);
    setView(FIT_VIEW);
    setStatus("loading");
    setActual(1);
  }

  useLayoutEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // the stage takes focus so a tooltip doesn't pop on the first button
      stage.current?.focus();
    } else if (!open && d.open) d.close();
  }, [open]);

  const go = (to: number) => {
    if (count === 0) return;
    setCurrent(loop ? (to + count) % count : clamp(to, 0, count - 1));
  };
  const canPrev = loop ? count > 1 : at > 0;
  const canNext = loop ? count > 1 : at < count - 1;

  // warm the neighbours so stepping through doesn't flash the spinner
  useEffect(() => {
    for (const n of [at - 1, at + 1]) {
      const src = images[(n + count) % count]?.src;
      if (src && count > 1) {
        const pre = new Image();
        pre.src = src;
      }
    }
  }, [at, count, images]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: follows the active thumbnail
  useEffect(() => {
    strip.current
      ?.querySelector("[aria-current='true']")
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [at]);

  const measure = () => {
    const s = stage.current;
    const m = img.current;
    if (!s || !m?.naturalWidth || !m.offsetWidth) return null;
    return {
      stage: { width: s.clientWidth, height: s.clientHeight },
      content: { width: m.offsetWidth, height: m.offsetHeight },
      actual: m.naturalWidth / m.offsetWidth,
    };
  };
  const maxScale = (natural: number) => Math.max(1, maxZoom * natural);

  const settle = (next: LightboxView) => {
    const m = measure();
    return m
      ? clampView({ ...next, scale: clamp(next.scale, 1, maxScale(m.actual)) }, m.content, m.stage)
      : next;
  };
  const latestSettle = useLatest(settle);
  const zoomTo = (scale: (v: LightboxView, natural: number) => number, point?: Point) =>
    setView((v) => {
      const m = measure();
      if (!m) return v;
      return settle(zoomAt(v, clamp(scale(v, m.actual), 1, maxScale(m.actual)), point));
    });

  const fromCenter = (clientX: number, clientY: number): Point => {
    const r = stage.current?.getBoundingClientRect();
    return r ? { x: clientX - r.left - r.width / 2, y: clientY - r.top - r.height / 2 } : { x: 0, y: 0 };
  };

  // wheel needs a non-passive listener to keep the page (and the dialog) from scrolling
  const latestZoom = useLatest(zoomTo);
  useEffect(() => {
    const s = stage.current;
    if (!s) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = s.getBoundingClientRect();
      const point = { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
      // trackpad pinch arrives as ctrl+wheel with small deltas
      const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002));
      latestZoom.current((v) => v.scale * factor, point);
    };
    s.addEventListener("wheel", onWheel, { passive: false });
    return () => s.removeEventListener("wheel", onWheel);
  }, [latestZoom]);

  // keep the pan legal and the percentage right when the window resizes
  useEffect(() => {
    const s = stage.current;
    if (!s) return;
    const observer = new ResizeObserver(() => {
      const m = img.current;
      if (m?.offsetWidth) setActual(m.naturalWidth / m.offsetWidth);
      setView((v) => {
        const next = latestSettle.current(v);
        return next.x === v.x && next.y === v.y && next.scale === v.scale ? v : next;
      });
    });
    observer.observe(s);
    return () => observer.disconnect();
  }, [latestSettle]);

  // pointer gestures: one pointer pans (or swipes at fit), two pinch around their midpoint
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<{ view: LightboxView; start: Point; dist: number; moved: boolean } | null>(null);
  // pointer capture retargets the click to the stage, so remember where the press began
  const pressedEmpty = useRef(false);
  const begin = () => {
    const pts = [...pointers.current.values()];
    const [a, b] = pts;
    if (!a) {
      gesture.current = null;
      return;
    }
    const start = b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : a;
    const dist = b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
    gesture.current = { view: latestView.current, start, dist, moved: gesture.current?.moved ?? false };
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if (pointers.current.size === 0) pressedEmpty.current = e.target === e.currentTarget;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) gesture.current = null;
    begin();
    setDragging(true);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || !pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const [a, b] = [...pointers.current.values()];
    if (!a) return;
    const mid = b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : a;
    const dx = mid.x - g.start.x;
    const dy = mid.y - g.start.y;
    if (Math.hypot(dx, dy) > 4) g.moved = true;
    if (b && g.dist > 0) {
      const scale = (g.view.scale * Math.hypot(a.x - b.x, a.y - b.y)) / g.dist;
      const zoomed = zoomAt(g.view, scale, fromCenter(g.start.x, g.start.y));
      setView(settle({ ...zoomed, x: zoomed.x + dx, y: zoomed.y + dy }));
    } else if (g.view.scale > 1) {
      setView(settle({ ...g.view, x: g.view.x + dx, y: g.view.y + dy }));
    }
  };
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!pointers.current.delete(e.pointerId)) return;
    if (pointers.current.size > 0) return begin();
    setDragging(false);
    if (!g || e.type === "pointercancel") return;
    const dx = e.clientX - g.start.x;
    if (
      g.view.scale === 1 &&
      g.dist === 0 &&
      Math.abs(dx) > SWIPE &&
      Math.abs(dx) > Math.abs(e.clientY - g.start.y)
    )
      go(at + (dx < 0 ? 1 : -1));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    switch (e.key) {
      case "ArrowLeft":
        go(at - 1);
        break;
      case "ArrowRight":
        go(at + 1);
        break;
      case "Home":
        go(0);
        break;
      case "End":
        go(count - 1);
        break;
      case "+":
      case "=":
        zoomTo((v) => v.scale * STEP);
        break;
      case "-":
        zoomTo((v) => v.scale / STEP);
        break;
      case "0":
        setView(FIT_VIEW);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const zoomed = view.scale > 1.001;
  const heading = image?.title ?? image?.alt;
  const showStrip = (thumbnails ?? count > 1) && count > 1;

  return (
    <dialog
      {...rest}
      ref={dialog}
      className={cx("rk-lightbox", className)}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        // a click on the empty stage closes; the end of a drag or a swipe doesn't
        if (event.target === stage.current && pressedEmpty.current && !gesture.current?.moved) onClose();
      }}
    >
      <header className="rk-lightbox-bar">
        <div id={titleId} className="rk-lightbox-title" aria-live="polite">
          {count > 1 && (
            <span className="rk-lightbox-counter rk-num">{labels.imageCounter(at + 1, count)}</span>
          )}
          {heading && <span className="rk-truncate">{heading}</span>}
        </div>
        <div className="rk-lightbox-tools">
          <IconButton
            size="sm"
            icon={<ZoomOutIcon />}
            label={labels.zoomOut}
            disabled={!zoomed}
            onClick={() => zoomTo((v) => v.scale / STEP)}
          />
          <span className="rk-lightbox-zoom rk-num">
            {status === "ready" && `${Math.round((view.scale / actual) * 100)}%`}
          </span>
          <IconButton
            size="sm"
            icon={<ZoomInIcon />}
            label={labels.zoomIn}
            disabled={status !== "ready" || view.scale >= maxScale(actual) - 0.001}
            onClick={() => zoomTo((v) => v.scale * STEP)}
          />
          <IconButton
            size="sm"
            icon={<FitIcon />}
            label={labels.fitToScreen}
            disabled={!zoomed}
            onClick={() => setView(FIT_VIEW)}
          />
          {image && actions?.(image, at)}
          <IconButton size="sm" icon={<XIcon />} label={labels.close} onClick={onClose} />
        </div>
      </header>

      {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer gestures; keys (+/−/0, arrows) live on the dialog */}
      <div
        ref={stage}
        className="rk-lightbox-stage"
        tabIndex={-1}
        data-zoomed={zoomed || undefined}
        data-dragging={dragging || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        // on the stage: pointer capture retargets the image's double-click here too
        onDoubleClick={(e) => {
          if (pressedEmpty.current || status !== "ready") return;
          zoomTo(
            (v, natural) => (v.scale > 1.001 ? 1 : Math.max(natural, 2)),
            fromCenter(e.clientX, e.clientY),
          );
        }}
      >
        {image && status !== "error" && (
          <img
            key={image.src}
            ref={img}
            className="rk-lightbox-img"
            src={image.src}
            alt={image.alt ?? ""}
            draggable={false}
            data-ready={status === "ready" || undefined}
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
            onLoad={(e) => {
              setStatus("ready");
              const m = e.currentTarget;
              if (m.offsetWidth) setActual(m.naturalWidth / m.offsetWidth);
            }}
            onError={() => setStatus("error")}
          />
        )}
        {status === "loading" && <Spinner size={28} className="rk-lightbox-spinner" />}
        {status === "error" && (
          <div className="rk-lightbox-error">
            <ImageIcon />
            {image?.alt}
          </div>
        )}
        {count > 1 && (
          <>
            <IconButton
              round
              tooltip={false}
              className="rk-lightbox-nav"
              data-side="prev"
              icon={<ChevronLeftIcon />}
              label={labels.previous}
              disabled={!canPrev}
              onClick={() => go(at - 1)}
            />
            <IconButton
              round
              tooltip={false}
              className="rk-lightbox-nav"
              data-side="next"
              icon={<ChevronRightIcon />}
              label={labels.next}
              disabled={!canNext}
              onClick={() => go(at + 1)}
            />
          </>
        )}
      </div>

      {image?.caption && <p className="rk-lightbox-caption">{image.caption}</p>}

      {showStrip && (
        <div ref={strip} className="rk-lightbox-strip">
          {images.map((im, i) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: the same file may appear twice
              key={i}
              type="button"
              className="rk-lightbox-thumb"
              aria-current={i === at}
              aria-label={im.alt ?? labels.imageCounter(i + 1, count)}
              onClick={() => go(i)}
            >
              <ImageIcon />
              <img
                src={im.thumb ?? im.src}
                alt=""
                loading="lazy"
                draggable={false}
                // a broken thumb falls back to the icon underneath
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </dialog>
  );
}
