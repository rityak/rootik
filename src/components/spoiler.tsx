import { type HTMLAttributes, type ReactNode, useId } from "react";
import { cx } from "../lib/cx";
import { useControllable, useElementSize } from "../lib/hooks";
import { ChevronDownIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";

export interface SpoilerProps extends HTMLAttributes<HTMLDivElement> {
  /** Collapsed height in px. */
  maxHeight?: number;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  showLabel?: ReactNode;
  hideLabel?: ReactNode;
  children: ReactNode;
}

/**
 * Clamps long content (release notes, captions, logs) to `maxHeight` with a fade and a Show more / less
 * toggle. The toggle only appears when the content actually overflows; focusing something inside the
 * hidden part expands it, so keyboard users never land on invisible links.
 */
export function Spoiler({
  maxHeight = 96,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  showLabel,
  hideLabel,
  className,
  children,
  ...rest
}: SpoilerProps) {
  const labels = useLabels();
  const [open, setOpen] = useControllable(expanded, defaultExpanded, onExpandedChange);
  const content = useElementSize<HTMLDivElement>();
  const id = useId();
  const overflowing = content.height > maxHeight + 1;
  return (
    <div
      {...rest}
      className={cx("rk-spoiler", className)}
      data-expanded={open || undefined}
      data-overflowing={overflowing || undefined}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: listens for focus moving into its content */}
      <div
        id={id}
        className="rk-spoiler-content"
        style={{ maxHeight: open || !overflowing ? content.height || undefined : maxHeight }}
        onFocus={() => {
          if (!open && overflowing) setOpen(true);
        }}
      >
        <div ref={content.ref}>{children}</div>
      </div>
      {overflowing && (
        <button
          type="button"
          className="rk-spoiler-toggle"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
        >
          {open ? (hideLabel ?? labels.showLess) : (showLabel ?? labels.showMore)}
          <ChevronDownIcon data-open={open || undefined} />
        </button>
      )}
    </div>
  );
}
