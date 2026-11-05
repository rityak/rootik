import {
  type DialogHTMLAttributes,
  type ReactNode,
  type RefObject,
  useId,
  useLayoutEffect,
  useRef,
} from "react";
import { cx } from "../lib/cx";
import { XIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { OverlayDecoration, type OverlaySurfaceOptions, overlaySurfaceStyle } from "./surface";

export interface DialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, "title" | "onClose"> {
  /** Defaults to true so `{show && <Dialog …/>}` works. */
  open?: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  /** Bottom actions; primary goes last. */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** center — modal; right/left/bottom — drawer/sheet. */
  placement?: "center" | "top" | "right" | "left" | "bottom";
  /** Backdrop click closes (Esc always does). */
  dismissible?: boolean;
  hideClose?: boolean;
  bodyClassName?: string;
  /** Element or selector to focus after opening; defaults to the first form field. */
  initialFocus?: RefObject<HTMLElement | null> | string;
  /** Optional SVG material inside the native dialog; children and focus targets stay mounted. */
  surface?: OverlaySurfaceOptions;
}

/**
 * Native modal <dialog>: top layer, focus trap, inert page and Esc come from the platform.
 * We only add backdrop-click dismissal and the look.
 */
export function Dialog({
  open = true,
  onClose,
  title,
  description,
  footer,
  size = "md",
  placement = "center",
  dismissible = true,
  hideClose,
  className,
  bodyClassName,
  initialFocus,
  surface,
  onCancel,
  onPointerDown,
  onClick,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  children,
  ...rest
}: DialogProps) {
  const strings = useLabels();
  const ref = useRef<HTMLDialogElement>(null);
  const downOnBackdrop = useRef(false);
  const titleId = useId();
  const descId = useId();

  useLayoutEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      const target =
        typeof initialFocus === "string"
          ? d.querySelector<HTMLElement>(initialFocus)
          : (initialFocus?.current ??
            d.querySelector<HTMLElement>(
              "[autofocus], input:not([type=hidden]):not(:disabled), select:not(:disabled), textarea:not(:disabled), [contenteditable=true]",
            ));
      target?.focus();
    } else if (!open && d.open) d.close();
  }, [open, initialFocus]);
  useLayoutEffect(() => {
    const dialog = ref.current;
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click only; Esc closes natively
    <dialog
      {...rest}
      ref={ref}
      className={cx("rk-dialog", className)}
      data-size={size}
      data-placement={placement}
      aria-labelledby={labelledBy ?? (title ? titleId : undefined)}
      aria-describedby={cx(describedBy, description ? descId : undefined) || undefined}
      onCancel={(event) => {
        onCancel?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        onClose();
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        downOnBackdrop.current = !event.defaultPrevented && event.target === event.currentTarget;
      }}
      onClick={(event) => {
        onClick?.(event);
        // both press and release on the backdrop: a text-selection drag that ends outside doesn't close
        if (
          !event.defaultPrevented &&
          dismissible &&
          downOnBackdrop.current &&
          event.target === event.currentTarget
        )
          onClose();
      }}
    >
      <div
        className="rk-dialog-panel rk-overlay"
        data-surface={surface ? "true" : undefined}
        style={overlaySurfaceStyle(surface)}
      >
        <OverlayDecoration surface={surface} />
        {(title || description || !hideClose) && (
          <header className="rk-dialog-header">
            <div className="rk-dialog-titles">
              {title && (
                <h2 id={titleId} className="rk-dialog-title">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="rk-dialog-desc">
                  {description}
                </p>
              )}
            </div>
            {!hideClose && (
              <button type="button" className="rk-dialog-close" aria-label={strings.close} onClick={onClose}>
                <XIcon />
              </button>
            )}
          </header>
        )}
        {children !== undefined && <div className={cx("rk-dialog-body", bodyClassName)}>{children}</div>}
        {footer && <footer className="rk-dialog-footer">{footer}</footer>}
      </div>
    </dialog>
  );
}

/** Side sheet: a Dialog docked to an edge. */
export function Drawer({ placement = "right", size = "md", ...rest }: DialogProps) {
  return <Dialog {...rest} placement={placement} size={size} />;
}
