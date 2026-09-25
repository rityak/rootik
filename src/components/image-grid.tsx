import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { CheckIcon, ImageIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { useSelection } from "../lib/selection";
import { useVirtual } from "../lib/virtual";

export interface ThumbnailProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  src: string;
  alt?: string;
  /** Width / height of the frame. */
  aspect?: number;
  /** cover crops to fill the frame; contain letterboxes the whole image. */
  fit?: "cover" | "contain";
  /** Line under the frame (file name). */
  label?: ReactNode;
  /** Corner overlay: resolution, tag count, status dot. */
  badge?: ReactNode;
  selected?: boolean;
}

/** Lazy image in a fixed-ratio frame: shimmer while loading, an icon when the file is missing. */
export function Thumbnail({
  src,
  alt = "",
  aspect = 1,
  fit = "cover",
  label,
  badge,
  selected,
  className,
  style,
  ...rest
}: ThumbnailProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  // a new src starts over (state adjusted during render)
  const [shown, setShown] = useState(src);
  if (shown !== src) {
    setShown(src);
    setStatus("loading");
  }
  return (
    <figure
      {...rest}
      className={cx("rk-thumb", className)}
      style={{ "--rk-thumb-aspect": aspect, ...style } as CSSProperties}
      data-fit={fit}
      data-status={status}
      data-selected={selected || undefined}
    >
      <div className="rk-thumb-frame">
        {status === "error" ? (
          <ImageIcon className="rk-thumb-missing" />
        ) : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={() => setStatus("ready")}
            onError={() => setStatus("error")}
          />
        )}
        {badge && <span className="rk-thumb-badge">{badge}</span>}
      </div>
      {label && <figcaption className="rk-thumb-label rk-truncate">{label}</figcaption>}
    </figure>
  );
}

export interface ImageGridItem {
  key: string;
  src: string;
  alt?: string;
  label?: ReactNode;
  badge?: ReactNode;
}

export interface ImageGridProps<T extends ImageGridItem = ImageGridItem>
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: ReadonlyArray<T>;
  /** Minimum thumbnail width in px; columns fill the width. */
  size?: number;
  aspect?: number;
  fit?: "cover" | "contain";
  /** Click selects (Ctrl/⌘ toggles, Shift extends), a corner check toggles, double-click / Enter opens. */
  selectable?: boolean;
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (keys: string[]) => void;
  /** Click (or double-click when selectable) / Enter: open the preview. */
  onOpen?: (item: T, index: number) => void;
  /** Only mount rows in view (thousands of images). The grid scrolls itself: give it a height. */
  virtual?: boolean;
  /** Shown when there are no items. */
  empty?: ReactNode;
}

/** Columns that fit `width` with at least `size` px each (matches CSS `repeat(auto-fill, minmax(size, 1fr))`). */
export function gridColumns(width: number, size: number, gap: number) {
  return Math.max(1, Math.floor((width + gap) / (size + gap)) || 1);
}

interface Metrics {
  /** Scroller padding above the cells (virtual mode). */
  pad: number;
  width: number;
  colGap: number;
  rowGap: number;
  itemHeight: number;
}

/**
 * Gallery grid: a listbox of thumbnails with 2-D arrow keys (rows follow the column count), Space to
 * select, Ctrl/⌘+A, Shift ranges, Esc to clear; optional row virtualization for large datasets.
 */
export function ImageGrid<T extends ImageGridItem = ImageGridItem>({
  items,
  size = 160,
  aspect = 1,
  fit = "cover",
  selectable,
  selected,
  defaultSelected,
  onSelectedChange,
  onOpen,
  virtual,
  empty,
  className,
  style,
  onKeyDown,
  ...rest
}: ImageGridProps<T>) {
  const labels = useLabels();
  const root = useRef<HTMLDivElement>(null);
  const cells = useRef<HTMLDivElement>(null);
  const keys = items.map((i) => i.key);
  const selection = useSelection({
    keys,
    value: selected,
    defaultValue: defaultSelected,
    onChange: onSelectedChange,
  });
  const [active, setActive] = useState(0);
  const focusPending = useRef(false);

  // column count and row height come from the rendered grid, so CSS (density, gap tokens) stays in charge
  const [metrics, setMetrics] = useState<Metrics>({ pad: 0, width: 0, colGap: 0, rowGap: 0, itemHeight: 0 });
  const measure = useCallback(() => {
    const el = cells.current;
    if (!el) return;
    const width = el.clientWidth;
    const css = getComputedStyle(el);
    const colGap = Number.parseFloat(css.columnGap) || 0;
    const rowGap = Number.parseFloat(css.rowGap) || 0;
    const itemHeight = (el.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0;
    const pad = root.current ? Number.parseFloat(getComputedStyle(root.current).paddingTop) || 0 : 0;
    setMetrics((m) =>
      m.pad === pad &&
      m.width === width &&
      m.colGap === colGap &&
      m.rowGap === rowGap &&
      m.itemHeight === itemHeight
        ? m
        : { pad, width, colGap, rowGap, itemHeight },
    );
  }, []);
  useLayoutEffect(measure);
  useEffect(() => {
    const el = cells.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  const cols = gridColumns(metrics.width, size, metrics.colGap);
  const rows = Math.ceil(items.length / cols);
  const colWidth = (metrics.width - metrics.colGap * (cols - 1)) / cols;
  const rowHeight = Math.max(1, (metrics.itemHeight || colWidth / aspect) + metrics.rowGap);
  const win = useVirtual({
    count: virtual ? rows : 0,
    size: rowHeight,
    scrollRef: root,
    overscan: 2,
    scrollMargin: metrics.pad,
  });
  const firstRow = virtual ? (win.items[0]?.index ?? 0) : 0;
  const lastRow = virtual ? (win.items.at(-1)?.index ?? -1) : rows - 1;
  const from = firstRow * cols;
  const to = virtual ? Math.min(items.length, (lastRow + 1) * cols) : items.length;
  const current = Math.min(active, Math.max(0, items.length - 1));

  // move real focus once the target cell is mounted (a virtual row may need a scroll first)
  useEffect(() => {
    if (!focusPending.current) return;
    const el = root.current?.querySelector<HTMLElement>(`[data-index="${current}"]`);
    if (el) {
      focusPending.current = false;
      el.focus({ preventScroll: virtual });
    }
  });

  const moveTo = (index: number, event?: { shiftKey: boolean }) => {
    const next = Math.max(0, Math.min(items.length - 1, index));
    const key = keys[next];
    if (key === undefined) return;
    setActive(next);
    focusPending.current = true;
    if (virtual) win.scrollToIndex(Math.floor(next / cols));
    if (selectable && event?.shiftKey) selection.select(key, { range: true });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || e.altKey) return;
    const mod = e.ctrlKey || e.metaKey;
    const item = items[current];
    switch (e.key) {
      case "ArrowRight":
        moveTo(current + 1, e);
        break;
      case "ArrowLeft":
        moveTo(current - 1, e);
        break;
      case "ArrowDown":
        moveTo(current + cols, e);
        break;
      case "ArrowUp":
        moveTo(current - cols, e);
        break;
      case "Home":
        moveTo(mod ? 0 : current - (current % cols), e);
        break;
      case "End":
        moveTo(mod ? items.length - 1 : current - (current % cols) + cols - 1, e);
        break;
      case " ":
        if (!(selectable && item)) return;
        selection.toggle(item.key, e.shiftKey);
        break;
      case "Enter":
        if (!(item && onOpen)) return;
        onOpen(item, current);
        break;
      case "a":
        if (!(selectable && mod)) return;
        selection.selectAll();
        break;
      case "Escape":
        // only swallow Esc when it did something, so a surrounding dialog still closes
        if (!(selectable && selection.count > 0)) return;
        selection.clear();
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const handleClick = (e: MouseEvent, item: T, index: number) => {
    setActive(index);
    if (selectable) selection.select(item.key, e);
    else onOpen?.(item, index);
  };

  const hasLabels = items.some((i) => i.label !== undefined);

  return (
    <div
      role="listbox"
      aria-multiselectable={selectable || undefined}
      tabIndex={items.length === 0 ? 0 : -1}
      {...rest}
      ref={root}
      className={cx("rk-image-grid", className)}
      style={{ "--rk-grid-size": `${size}px`, ...style } as CSSProperties}
      data-virtual={virtual || undefined}
      data-selectable={selectable || undefined}
      onKeyDown={handleKeyDown}
    >
      {items.length === 0 && <div className="rk-image-grid-empty">{empty ?? labels.noData}</div>}
      <div className="rk-image-grid-spacer" style={virtual ? { height: win.total } : undefined}>
        <div
          ref={cells}
          className="rk-image-grid-cells"
          data-labels={hasLabels || undefined}
          style={{
            gridTemplateColumns: metrics.width ? `repeat(${cols}, minmax(0, 1fr))` : undefined,
            translate: virtual ? `0 ${firstRow * rowHeight}px` : undefined,
          }}
        >
          {items.slice(from, to).map((item, i) => {
            const index = from + i;
            const isSelected = selectable && selection.isSelected(item.key);
            return (
              // biome-ignore lint/a11y/useKeyWithClickEvents: keys are handled once, on the listbox
              <div
                key={item.key}
                role="option"
                aria-selected={selectable ? isSelected : undefined}
                tabIndex={index === current ? 0 : -1}
                className="rk-image-grid-item"
                data-index={index}
                onFocus={() => setActive(index)}
                onClick={(e) => handleClick(e, item, index)}
                onDoubleClick={selectable && onOpen ? () => onOpen(item, index) : undefined}
              >
                <Thumbnail
                  src={item.src}
                  alt={item.alt}
                  aspect={aspect}
                  fit={fit}
                  label={item.label}
                  badge={item.badge}
                  selected={isSelected}
                />
                {selectable && (
                  // pointer shortcut for "toggle this one"; keyboard users have Space
                  <span
                    aria-hidden
                    className="rk-image-grid-check"
                    data-checked={isSelected || undefined}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(index);
                      selection.toggle(item.key, e.shiftKey);
                    }}
                  >
                    <CheckIcon />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
