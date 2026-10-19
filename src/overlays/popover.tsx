import { type HTMLAttributes, type ReactElement, type ReactNode, useId, useRef } from "react";
import { cx } from "../lib/cx";
import { Floating, type Placement } from "../lib/floating";
import { cloneTrigger, useControllable } from "../lib/hooks";
import { OverlayDecoration, type OverlaySurfaceOptions, overlaySurfaceStyle } from "./surface";

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  trigger: ReactElement;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  surface?: OverlaySurfaceOptions;
}

/** Non-modal floating panel anchored to a trigger (filters, pickers, details). */
export function Popover({
  trigger,
  placement = "bottom-start",
  open,
  onOpenChange,
  title,
  surface,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": labelledBy,
  className,
  children,
  ...rest
}: PopoverProps) {
  const [isOpen, setOpen] = useControllable(open, false, onOpenChange);
  const anchor = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  return (
    <>
      {cloneTrigger(trigger, {
        ref: anchor,
        "aria-haspopup": "dialog",
        "aria-expanded": isOpen,
        "aria-controls": id,
        onClick: () => setOpen(!isOpen),
      })}
      <Floating
        {...rest}
        ref={panel}
        id={id}
        role="dialog"
        aria-label={ariaLabel}
        aria-labelledby={labelledBy ?? (title && !ariaLabel ? `${id}-title` : undefined)}
        anchor={anchor}
        open={isOpen}
        onOpenChange={(next) => {
          if (!next && panel.current?.contains(document.activeElement)) anchor.current?.focus();
          if (next !== isOpen) setOpen(next);
        }}
        placement={placement}
        className={cx("rk-popover", "rk-overlay", className)}
        data-surface={surface ? "true" : undefined}
        style={{ ...overlaySurfaceStyle(surface), ...style }}
      >
        <OverlayDecoration surface={surface} />
        {title && (
          <div id={`${id}-title`} className="rk-popover-title">
            {title}
          </div>
        )}
        {children}
      </Floating>
    </>
  );
}
