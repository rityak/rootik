import { type DetailsHTMLAttributes, type HTMLAttributes, type ReactNode, useRef } from "react";
import { cx } from "../lib/cx";
import { readStorage, useControllable, writeStorage } from "../lib/hooks";
import { ChevronRightIcon, MinusIcon, SquareIcon, XIcon } from "../lib/icons";
import { useAppearanceValue } from "../theme/provider";

export type ShellVariant = "islands" | "inset";

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebar?: ReactNode;
  /** Top bar: TitleBar, page toolbar. */
  header?: ReactNode;
  /**
   * bar — rounded panel (toolbars, title bars); pill — capsule, concentric with round controls inside;
   * none — no panel, controls sit on the canvas (mobile top rows). Only matters for islands.
   */
  headerShape?: "bar" | "pill" | "none";
  /** Status bar under the content. */
  footer?: ReactNode;
  /** Right panel (details, inspector). */
  aside?: ReactNode;
  /** Floating bottom navigation (Dock); content scrolls underneath it. */
  dock?: ReactNode;
  /**
   * islands — every part (sidebar, header, aside, footer, dock) is its own surface over the ambient canvas;
   * inset — sidebar and bars sit on the background, content (+aside) is one surface block.
   * Defaults to the `layout` appearance setting.
   */
  variant?: ShellVariant;
}

/** Full-viewport frame; the surface material applies to its parts. Content scrolls, the frame doesn't. */
export function AppShell({
  sidebar,
  header,
  headerShape = "bar",
  footer,
  aside,
  dock,
  variant,
  className,
  children,
  ...rest
}: AppShellProps) {
  const setting = useAppearanceValue("layout");
  const mode: ShellVariant = variant ?? (setting === "inset" ? "inset" : "islands");
  const part = mode === "islands" ? "rk-surface" : undefined;
  return (
    <div {...rest} className={cx("rk-shell", className)} data-variant={mode}>
      {sidebar && <div className={cx("rk-shell-sidebar", part)}>{sidebar}</div>}
      <div className="rk-shell-main">
        {header && (
          <div className={cx("rk-shell-header", headerShape !== "none" && part)} data-shape={headerShape}>
            {header}
          </div>
        )}
        <div className={cx("rk-shell-body", mode === "inset" && "rk-shell-panel")}>
          <main className="rk-shell-content" data-dock={dock ? "" : undefined}>
            {children}
          </main>
          {aside && <aside className={cx("rk-shell-aside", part)}>{aside}</aside>}
          {dock && <div className="rk-shell-dock">{dock}</div>}
        </div>
        {footer && <div className={cx("rk-shell-footer", part)}>{footer}</div>}
      </div>
    </div>
  );
}

export interface TitleBarProps extends HTMLAttributes<HTMLElement> {
  /** Left: logo, app name, status. */
  start?: ReactNode;
  /** Right: actions before the window controls. */
  end?: ReactNode;
  /** Window controls appear when handlers are given (frameless Tauri/Electron windows). */
  onMinimize?: () => void;
  onMaximize?: () => void;
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
  onClose,
  className,
  children,
  ...rest
}: TitleBarProps) {
  const controls = onMinimize || onMaximize || onClose;
  return (
    <header data-tauri-drag-region {...rest} className={cx("rk-titlebar", className)}>
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
              <button type="button" aria-label="Minimize" onClick={onMinimize}>
                <MinusIcon />
              </button>
            )}
            {onMaximize && (
              <button type="button" aria-label="Maximize" onClick={onMaximize}>
                <SquareIcon />
              </button>
            )}
            {onClose && (
              <button type="button" aria-label="Close" data-close onClick={onClose}>
                <XIcon />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** Above the title: breadcrumbs, back link. */
  eyebrow?: ReactNode;
  /** Right side: actions, tabs, badges. */
  actions?: ReactNode;
  /** Large display title (dashboards) vs compact (tool pages). */
  size?: "sm" | "lg";
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  size = "sm",
  className,
  ...rest
}: PageHeaderProps) {
  return (
    <header {...rest} className={cx("rk-page-header", className)} data-size={size}>
      <div className="rk-page-titles">
        {eyebrow && <div className="rk-page-eyebrow">{eyebrow}</div>}
        <h1 className="rk-page-title">{title}</h1>
        {description && <p className="rk-page-desc">{description}</p>}
      </div>
      {actions && <div className="rk-page-actions">{actions}</div>}
    </header>
  );
}

/** Scrollable page body: centered column of limited width. */
export function PageBody({
  width = 1120,
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { width?: number | "none" }) {
  return (
    <div {...rest} className={cx("rk-page-body", className)}>
      <div className="rk-page-column" style={{ maxWidth: width === "none" ? undefined : width }}>
        {children}
      </div>
    </div>
  );
}

/** Row of controls above a work area (gallery, canvas, table). */
export function Toolbar({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div role="toolbar" {...rest} className={cx("rk-toolbar", className)} />;
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
        aria-label="Resize"
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

export interface DisclosureProps extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "title"> {
  title: ReactNode;
  /** Right side of the summary. */
  aside?: ReactNode;
  /** Same `name` on several = exclusive accordion (native). */
  name?: string;
}

/** Collapsible section on native <details>. */
export function Disclosure({ title, aside, className, children, ...rest }: DisclosureProps) {
  return (
    <details {...rest} className={cx("rk-disclosure", className)}>
      <summary>
        <ChevronRightIcon className="rk-disclosure-chevron" />
        <span className="rk-disclosure-title">{title}</span>
        {aside}
      </summary>
      <div className="rk-disclosure-body">{children}</div>
    </details>
  );
}
