import { type CSSProperties, type HTMLAttributes, type ReactNode, useContext, useId, useState } from "react";
import { IconButton, type IconButtonProps } from "../components/button";
import { cx } from "../lib/cx";
import { useElementSize, useWindowFocus } from "../lib/hooks";
import { icon as makeIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { Drawer } from "../overlays/dialog";
import { useAppearanceValue } from "../theme/provider";

export { useShellCompact, useShellDockBar } from "./shell-context";

import { ShellContext } from "./shell-context";
import { SvgSurface, type SvgSurfaceProps } from "./svg-surface";

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
  /** Surface follows island contours; capsule keeps the Dock's own rounded body. Floating docks only. */
  dockShape?: "surface" | "capsule";
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
  /** SVG contours for island parts and the floating dock. Inset keeps its continuous panel. */
  surface?: Pick<
    SvgSurfaceProps,
    "shape" | "edge" | "padding" | "depth" | "span" | "position" | "glass" | "opacity" | "shadow" | "contours"
  >;
  /** Decorative canvas layer, for example SvgBackdrop with custom SVG children. */
  backdrop?: ReactNode;
}

function ShellPart({
  surface,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { surface?: AppShellProps["surface"] }) {
  return surface ? (
    <SvgSurface {...surface} {...props} contentClassName="rk-shell-part-content">
      {children}
    </SvgSurface>
  ) : (
    <div {...props}>{children}</div>
  );
}

const MenuIcon = makeIcon(
  <>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
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
  dockShape,
  sidebarWidth = 232,
  compactBelow = 720,
  variant,
  dimWhenInactive,
  background = "default",
  drawerBelow = 520,
  surface,
  backdrop,
  className,
  style,
  children,
  ...rest
}: AppShellProps) {
  const focused = useWindowFocus();
  const setting = useAppearanceValue("layout");
  const dockSetting = useAppearanceValue("dock");
  const dockShapeSetting = useAppearanceValue("dockShape");
  const dockBar = Boolean(dock) && (dockPlacement ?? (dockSetting === "bar" ? "bar" : "float")) === "bar";
  const strings = useLabels();
  const size = useElementSize<HTMLDivElement>();
  const dockSize = useElementSize<HTMLDivElement>();
  const compact = size.width > 0 && size.width < compactBelow;
  const drawer = Boolean(sidebar) && size.width > 0 && size.width < drawerBelow;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mainId = useId();
  const mode: ShellVariant = variant ?? (setting === "inset" ? "inset" : "islands");
  const part = mode === "islands" && !surface ? "rk-surface" : undefined;
  const contour = mode === "islands" ? surface : undefined;
  const dockContour = (dockShape ?? dockShapeSetting) === "capsule" ? undefined : contour;
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
        {backdrop && (
          <div className="rk-shell-backdrop" aria-hidden="true">
            {backdrop}
          </div>
        )}
        {(sidebar || header) && (
          <a className="rk-skip" href={`#${mainId}`}>
            {strings.skipToContent}
          </a>
        )}
        {sidebar && !drawer && (
          <ShellPart className={cx("rk-shell-sidebar", part)} surface={contour}>
            {sidebar}
          </ShellPart>
        )}
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
            <ShellPart
              className={cx("rk-shell-header", headerShape !== "none" && part)}
              data-shape={headerShape}
              surface={headerShape !== "none" ? contour : undefined}
            >
              {header}
            </ShellPart>
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
            {aside &&
              (contour ? (
                <aside className="rk-shell-aside">
                  <ShellPart surface={contour}>{aside}</ShellPart>
                </aside>
              ) : (
                <aside className={cx("rk-shell-aside", part)}>{aside}</aside>
              ))}
            {dock && !dockBar && (
              <div ref={dockSize.ref} className="rk-shell-dock">
                {dockContour ? <ShellPart surface={dockContour}>{dock}</ShellPart> : dock}
              </div>
            )}
          </div>
          {dockBar && <div className="rk-shell-dockbar">{dock}</div>}
          {footer && (
            <ShellPart className={cx("rk-shell-footer", part)} surface={contour}>
              {footer}
            </ShellPart>
          )}
        </div>
      </div>
    </ShellContext>
  );
}
