import { type HTMLAttributes, type ReactNode, type Ref, useRef } from "react";
import { cx } from "../lib/cx";
import { MinusIcon, icon as makeIcon, SquareIcon, XIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { useRovingFocus } from "../lib/roving";

const RestoreIcon = makeIcon(
  <>
    <rect x="7" y="5" width="12" height="12" rx="2" />
    <path d="M5 9v8a2 2 0 0 0 2 2h8" />
  </>,
);

export interface TitleBarProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
  /** Left: logo, app name, status. */
  start?: ReactNode;
  /** Right: actions before the window controls. */
  end?: ReactNode;
  /** Window controls appear when handlers are given (frameless Tauri/Electron windows). */
  onMinimize?: () => void;
  onMaximize?: () => void;
  /** Switches the maximize control to its restore label and icon. */
  maximized?: boolean;
  onClose?: () => void;
}

/**
 * App title bar for frameless desktop windows. Empty areas carry `data-tauri-drag-region`, so the window
 * drags by the bar but not by its controls. Children render in the center.
 */
export function TitleBar({
  start,
  end,
  onMinimize,
  onMaximize,
  maximized,
  onClose,
  className,
  ref,
  children,
  ...rest
}: TitleBarProps) {
  const strings = useLabels();
  const controls = onMinimize || onMaximize || onClose;
  return (
    <header ref={ref} data-tauri-drag-region {...rest} className={cx("rk-titlebar", className)}>
      <div className="rk-titlebar-start" data-tauri-drag-region>
        {start}
      </div>
      <div className="rk-titlebar-center" data-tauri-drag-region>
        {children}
      </div>
      <div className="rk-titlebar-end" data-tauri-drag-region>
        {end}
        {controls && (
          <div className="rk-titlebar-controls">
            {onMinimize && (
              <button
                type="button"
                aria-label={strings.minimize}
                title={strings.minimize}
                onClick={onMinimize}
              >
                <MinusIcon />
              </button>
            )}
            {onMaximize && (
              <button
                type="button"
                aria-label={maximized ? strings.restore : strings.maximize}
                title={maximized ? strings.restore : strings.maximize}
                onClick={onMaximize}
              >
                {maximized ? <RestoreIcon /> : <SquareIcon />}
              </button>
            )}
            {onClose && (
              <button
                type="button"
                aria-label={strings.close}
                title={strings.close}
                data-close
                onClick={onClose}
              >
                <XIcon />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

/**
 * Row of controls above a work area (gallery, canvas, table). One Tab stop; arrow keys move between the
 * controls (APG toolbar), while fields, segmented controls and sliders inside keep their own arrows.
 */
export function Toolbar({ orientation = "horizontal", className, onKeyDown, ...rest }: ToolbarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rove = useRovingFocus(ref, orientation);
  return (
    <div
      role="toolbar"
      aria-orientation={orientation}
      {...rest}
      ref={ref}
      className={cx("rk-toolbar", className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented) rove(event);
      }}
    />
  );
}

/** Spacer that pushes following toolbar items to the right. */
export function Spacer() {
  return <span className="rk-spacer" />;
}

export interface ActionBarProps extends HTMLAttributes<HTMLElement> {
  /** Left: state, validation message. */
  status?: ReactNode;
  /** Below the row: expanded details. */
  below?: ReactNode;
}

/** Bottom bar with the page's main actions; primary button last (rightmost). */
export function ActionBar({ status, below, className, children, ...rest }: ActionBarProps) {
  return (
    <footer {...rest} className={cx("rk-action-bar", className)}>
      <div className="rk-action-bar-row">
        <div className="rk-action-bar-status">{status}</div>
        {children}
      </div>
      {below}
    </footer>
  );
}

export interface StatusBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Pulsing dot: something is running. */
  running?: boolean;
  /** 0..1, thin line along the top edge while running. */
  progress?: number;
  /** Right side items. */
  end?: ReactNode;
}

export function StatusBar({ running, progress, end, className, children, ...rest }: StatusBarProps) {
  return (
    <div {...rest} className={cx("rk-status-bar", className)}>
      {running && <span className="rk-status-bar-dot" aria-hidden="true" />}
      <span className="rk-truncate">{children}</span>
      {end && <span className="rk-status-bar-end">{end}</span>}
      {progress !== undefined && (
        <span
          className="rk-status-bar-progress"
          style={{ width: `${Math.min(1, Math.max(0, progress)) * 100}%` }}
        />
      )}
    </div>
  );
}
