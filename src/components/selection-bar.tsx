import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { announce } from "../lib/announce";
import { cx } from "../lib/cx";
import { XIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";

export interface SelectionBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Selected items; the bar shows while it's above zero. */
  count: number;
  /** Clear button (and Escape inside the bar). */
  onClear?: () => void;
  /** Bulk actions: Buttons, IconButtons, a Menu. */
  children?: ReactNode;
  /** Replaces "N selected". */
  label?: ReactNode;
  /** Distance from the bottom edge, e.g. to clear a dock. */
  offset?: number | string;
}

/**
 * Floating "N selected" bar with bulk actions, shown while a table, grid or list has a selection.
 * Lives in the top layer (manual popover) at the bottom centre; the count is announced politely.
 */
export function SelectionBar({
  count,
  onClear,
  label,
  offset = 24,
  className,
  style,
  children,
  ...rest
}: SelectionBarProps) {
  const labels = useLabels();
  const ref = useRef<HTMLDivElement>(null);
  const text = labels.selectedCount(count);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const open = el.matches(":popover-open");
    if (count > 0 && !open) el.showPopover();
    else if (count === 0 && open) el.hidePopover();
  }, [count]);

  useEffect(() => {
    if (count > 0 && typeof text === "string") announce(text);
  }, [count, text]);

  return (
    <div
      {...rest}
      ref={ref}
      popover="manual"
      role="toolbar"
      aria-label={typeof text === "string" ? text : undefined}
      className={cx("rk-selection-bar rk-panel-glass", className)}
      style={
        {
          "--rk-selection-offset": typeof offset === "number" ? `${offset}px` : offset,
          ...style,
        } as CSSProperties
      }
      onKeyDown={(event) => {
        if (event.key === "Escape" && onClear) {
          event.preventDefault();
          onClear();
        }
      }}
    >
      <span className="rk-selection-count rk-num">{label ?? text}</span>
      {onClear && (
        <button
          type="button"
          className="rk-selection-clear"
          aria-label={labels.clearSelection}
          onClick={onClear}
        >
          <XIcon />
        </button>
      )}
      {children && (
        <>
          <span className="rk-selection-sep" aria-hidden="true" />
          <div className="rk-selection-actions">{children}</div>
        </>
      )}
    </div>
  );
}
