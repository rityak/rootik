import {
  createContext,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
  useContext,
  useId,
} from "react";
import { SvgControlFrame, useSvgControlBorder } from "../components/svg-control-frame";
import { useShellCompact } from "../layout/shell-context";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
import { ChevronRightIcon } from "../lib/icons";
import type { SvgControlBorder } from "../lib/svg-geometry";
import { MotionLayer } from "../motion/layer";
import { Tooltip } from "../overlays/tooltip";

const SidebarContext = createContext({ collapsed: false });

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Icon-only rail; item labels move into tooltips. Unset: follows a compact AppShell. */
  collapsed?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}

export function Sidebar({ collapsed: forced, header, footer, className, children, ...rest }: SidebarProps) {
  // unset = follow the AppShell: a rail while the shell is compact
  const shellCompact = useShellCompact();
  const collapsed = forced ?? shellCompact;
  return (
    <SidebarContext value={{ collapsed }}>
      <nav {...rest} className={cx("rk-sidebar", className)} data-collapsed={collapsed || undefined}>
        {header && <div className="rk-sidebar-header">{header}</div>}
        <div className="rk-sidebar-body">{children}</div>
        {footer && <div className="rk-sidebar-footer">{footer}</div>}
      </nav>
    </SidebarContext>
  );
}

export interface NavItemProps {
  svgBorder?: SvgControlBorder;
  icon?: ReactNode;
  label: ReactNode;
  active?: boolean;
  /** Right side: count, badge, row actions (shown on hover when `trailingOnHover`). */
  trailing?: ReactNode;
  trailingOnHover?: boolean;
  /** Tree indentation level. */
  depth?: number;
  /** Secondary row (group/folder). */
  muted?: boolean;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  title?: string;
  disabled?: boolean;
  className?: string;
}

/** Navigation row: sidebars, lists of presets/runs/files. Renders <a> with href, else <button>. */
export function NavItem({
  svgBorder,
  icon,
  label,
  active,
  trailing,
  trailingOnHover,
  depth = 0,
  muted,
  href,
  onClick,
  title,
  disabled,
  className,
}: NavItemProps) {
  const border = useSvgControlBorder(svgBorder);
  const { collapsed } = useContext(SidebarContext);
  const common = {
    className: "rk-nav-link",
    "data-svg-border": border,
    "data-rk-nav-item": "",
    "aria-current": active ? ("page" as const) : undefined,
    title: collapsed ? undefined : title,
    onClick: disabled ? (event: React.MouseEvent<HTMLElement>) => event.preventDefault() : onClick,
  };
  const content = (
    <>
      {border ? <SvgControlFrame border={border} /> : <MotionLayer />}
      {icon && <span className="rk-icon rk-nav-icon">{icon}</span>}
      <span className="rk-nav-label">{label}</span>
    </>
  );
  const link = href ? (
    <a
      {...common}
      href={disabled ? undefined : href}
      role={disabled ? "link" : undefined}
      tabIndex={disabled ? -1 : undefined}
      aria-disabled={disabled || undefined}
    >
      {content}
    </a>
  ) : (
    <button {...common} type="button" disabled={disabled}>
      {content}
    </button>
  );
  return (
    <div
      className={cx("rk-nav-item", className)}
      data-active={active || undefined}
      data-muted={muted || undefined}
      style={depth ? ({ "--rk-depth": depth } as React.CSSProperties) : undefined}
    >
      {collapsed ? (
        <Tooltip content={label} placement="right">
          {link}
        </Tooltip>
      ) : (
        link
      )}
      {trailing && !collapsed && (
        <div className="rk-nav-trailing" data-hover={trailingOnHover || undefined}>
          {trailing}
        </div>
      )}
    </div>
  );
}

export interface NavGroupProps {
  label: ReactNode;
  /** Right of the label: add button etc. */
  action?: ReactNode;
  collapsible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

export function NavGroup({
  label,
  action,
  collapsible,
  open,
  defaultOpen = true,
  onOpenChange,
  children,
  className,
}: NavGroupProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const { collapsed } = useContext(SidebarContext);
  const id = useId();
  return (
    <div className={cx("rk-nav-group", className)}>
      {!collapsed && (
        <div className="rk-nav-group-head">
          {collapsible ? (
            <button
              type="button"
              className="rk-nav-group-label"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(!isOpen)}
            >
              {label}
              <ChevronRightIcon className="rk-nav-group-chevron" data-open={isOpen || undefined} />
            </button>
          ) : (
            <span className="rk-nav-group-label">{label}</span>
          )}
          {action}
        </div>
      )}
      {(isOpen || collapsed) && (
        // biome-ignore lint/a11y/useSemanticElements: a div group keeps NavItem markup flexible
        <div id={id} role="group" className="rk-nav-group-items">
          {children}
        </div>
      )}
    </div>
  );
}
