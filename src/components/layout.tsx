import {
  type CSSProperties,
  createContext,
  type DetailsHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { readStorage, useControllable, useElementSize, useWindowFocus, writeStorage } from "../lib/hooks";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  icon as makeIcon,
  SquareIcon,
  XIcon,
} from "../lib/icons";
import { useLabels } from "../lib/labels";
import { useRovingFocus } from "../lib/roving";
import { useAppearanceValue } from "../theme/provider";
import { IconButton, type IconButtonProps } from "./button";
import { Drawer } from "./dialog";

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
  /** Bottom navigation (Dock); content scrolls underneath it while it floats. */
  dock?: ReactNode;
  /**
   * float — capsule over the content; bar — taskbar row along the bottom edge (Dock stretches, `start`
   * slot on the left). Defaults to the `dock` appearance setting.
   */
  dockPlacement?: "float" | "bar";
  /** Sidebar width, px (the rail width comes from its content). */
  sidebarWidth?: number;
  /**
   * Below this shell width (px) the layout compacts: the Sidebar becomes an icon rail and the aside moves
   * under the content, so a narrow window or 200% zoom still leaves room for the page. 0 disables.
   */
  compactBelow?: number;
  /**
   * islands — every part (sidebar, header, aside, footer, dock) is its own surface over the ambient canvas;
   * inset — sidebar and bars sit on the background, content (+aside) is one surface block.
   * Defaults to the `layout` appearance setting.
   */
  variant?: ShellVariant;
  /**
   * Desktop windows (Tauri): while the window is in the background the title bar fades and selected
   * pills turn grey, like native apps. Off for web pages, where devtools or an iframe steal focus.
   */
  dimWhenInactive?: boolean;
  /** none leaves the shell transparent for an image, video or canvas behind it. */
  background?: "default" | "none";
  /**
   * Below this shell width (px) the sidebar leaves the layout and opens as a left drawer from a
   * `ShellMenuButton` (phones). 0 disables.
   */
  drawerBelow?: number;
}

const ShellContext = createContext({
  compact: false,
  drawer: false,
  dockBar: false,
  openDrawer: () => {
    // outside an AppShell there is no drawer
  },
});

/** True inside a compacted AppShell (narrow window, high zoom). Sidebar reads it to become a rail. */
export const useShellCompact = () => useContext(ShellContext).compact;

/** True for a Dock rendered as the AppShell taskbar (`dockPlacement="bar"`). */
export const useShellDockBar = () => useContext(ShellContext).dockBar;

const MenuIcon = makeIcon(
  <>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </>,
);

const RestoreIcon = makeIcon(
  <>
    <rect x="7" y="5" width="12" height="12" rx="2" />
    <path d="M5 9v8a2 2 0 0 0 2 2h8" />
  </>,
);

/** Opens the sidebar drawer; renders nothing unless the AppShell is in drawer mode. Put it in the header. */
export function ShellMenuButton(props: Omit<IconButtonProps, "icon" | "label"> & { label?: string }) {
  const { drawer, openDrawer } = useContext(ShellContext);
  const strings = useLabels();
  if (!drawer) return null;
  return <IconButton icon={<MenuIcon />} label={strings.openNavigation} {...props} onClick={openDrawer} />;
}

/** Full-viewport frame; the surface material applies to its parts. Content scrolls, the frame doesn't. */
export function AppShell({
  sidebar,
  header,
  headerShape = "bar",
  footer,
  aside,
  dock,
  dockPlacement,
  sidebarWidth = 232,
  compactBelow = 720,
  variant,
  dimWhenInactive,
  background = "default",
  drawerBelow = 520,
  className,
  style,
  children,
  ...rest
}: AppShellProps) {
  const focused = useWindowFocus();
  const setting = useAppearanceValue("layout");
  const dockSetting = useAppearanceValue("dock");
  const dockBar = Boolean(dock) && (dockPlacement ?? (dockSetting === "bar" ? "bar" : "float")) === "bar";
  const strings = useLabels();
  const size = useElementSize<HTMLDivElement>();
  const dockSize = useElementSize<HTMLDivElement>();
  const compact = size.width > 0 && size.width < compactBelow;
  const drawer = Boolean(sidebar) && size.width > 0 && size.width < drawerBelow;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mainId = useId();
  const mode: ShellVariant = variant ?? (setting === "inset" ? "inset" : "islands");
  const part = mode === "islands" ? "rk-surface" : undefined;
  return (
    <ShellContext value={{ compact, drawer, dockBar, openDrawer: () => setDrawerOpen(true) }}>
      <div
        {...rest}
        ref={size.ref}
        className={cx("rk-shell", className)}
        data-variant={mode}
        data-compact={compact || undefined}
        data-inactive={(dimWhenInactive && !focused) || undefined}
        data-background={background}
        style={
          {
            "--rk-sidebar-w": `${sidebarWidth}px`,
            "--rk-dock-height": `${dockSize.height || 56}px`,
            ...style,
          } as CSSProperties
        }
      >
        {(sidebar || header) && (
          <a className="rk-skip" href={`#${mainId}`}>
            {strings.skipToContent}
          </a>
        )}
        {sidebar && !drawer && <div className={cx("rk-shell-sidebar", part)}>{sidebar}</div>}
        {drawer && (
          <Drawer
            placement="left"
            size="sm"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            aria-label={strings.navigation}
            className="rk-shell-drawer"
            bodyClassName="rk-shell-drawer-body"
          >
            {/* full sidebar in the drawer, not the rail; following a link closes it */}
            <ShellContext
              value={{ compact: false, drawer: true, dockBar: false, openDrawer: () => setDrawerOpen(true) }}
            >
              {/* biome-ignore lint/a11y/noStaticElementInteractions: delegation only, links handle keys */}
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: delegation only, links handle keys */}
              <div
                className="rk-shell-drawer-inner"
                onClick={(event) =>
                  (event.target as Element).closest("a[href], .rk-nav-item") && setDrawerOpen(false)
                }
              >
                {sidebar}
              </div>
            </ShellContext>
          </Drawer>
        )}
        <div className="rk-shell-main">
          {header && (
            <div className={cx("rk-shell-header", headerShape !== "none" && part)} data-shape={headerShape}>
              {header}
            </div>
          )}
          <div className={cx("rk-shell-body", mode === "inset" && "rk-shell-panel")}>
            <main
              id={mainId}
              tabIndex={-1}
              className="rk-shell-content"
              data-dock={dock && !dockBar ? "" : undefined}
            >
              {children}
            </main>
            {aside && <aside className={cx("rk-shell-aside", part)}>{aside}</aside>}
            {dock && !dockBar && (
              <div ref={dockSize.ref} className="rk-shell-dock">
                {dock}
              </div>
            )}
          </div>
          {dockBar && <div className="rk-shell-dockbar">{dock}</div>}
          {footer && <div className={cx("rk-shell-footer", part)}>{footer}</div>}
        </div>
      </div>
    </ShellContext>
  );
}

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
  const strings = useLabels();
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
        aria-label={strings.resize}
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

export interface MasterDetailProps extends HTMLAttributes<HTMLDivElement> {
  list: ReactNode;
  /** The selected item's view; `null`/`undefined` when nothing is selected. */
  detail?: ReactNode;
  /** Narrow layout only: the back button's handler (clear the selection). */
  onBack?: () => void;
  /** Detail placeholder on wide layouts while nothing is selected. */
  empty?: ReactNode;
  listWidth?: number;
  /** Below this width (px) list and detail stack: one at a time, with a back button. */
  stackBelow?: number;
}

/** List + detail side by side; stacked with a back button when narrow (mail, nodes, runs). */
export function MasterDetail({
  list,
  detail,
  onBack,
  empty,
  listWidth = 300,
  stackBelow = 640,
  className,
  style,
  ...rest
}: MasterDetailProps) {
  const size = useElementSize<HTMLDivElement>();
  const strings = useLabels();
  const back = useRef<HTMLButtonElement>(null);
  const stacked = size.width > 0 && size.width < stackBelow;
  const hasDetail = detail !== null && detail !== undefined;
  const showDetail = !stacked || hasDetail;
  // stacked: opening a detail replaces the list, so focus follows to the back button
  useLayoutEffect(() => {
    if (stacked && hasDetail) back.current?.focus();
  }, [stacked, hasDetail]);
  return (
    <div
      {...rest}
      ref={size.ref}
      className={cx("rk-master-detail", className)}
      data-stacked={stacked || undefined}
      style={{ "--rk-md-list-w": `${listWidth}px`, ...style } as CSSProperties}
    >
      {!(stacked && hasDetail) && <div className="rk-master-detail-list">{list}</div>}
      {showDetail && (
        <div className="rk-master-detail-detail">
          {stacked && hasDetail && (
            <div className="rk-master-detail-bar">
              <button ref={back} type="button" className="rk-master-detail-back" onClick={onBack}>
                <ChevronLeftIcon />
                {strings.back}
              </button>
            </div>
          )}
          {hasDetail ? detail : empty}
        </div>
      )}
    </div>
  );
}
