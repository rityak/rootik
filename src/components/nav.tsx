import {
  createContext,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
  useContext,
  useId,
  useRef,
} from "react";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
import { ChevronLeftIcon, ChevronRightIcon } from "../lib/icons";
import { useIndicator } from "../lib/indicator";
import type { Size } from "./button";
import { Tooltip } from "./tooltip";

export interface TabItem<T extends string = string> {
  value: T;
  label?: ReactNode;
  icon?: ReactNode;
  /** Tooltip; accessible name of icon-only tabs. */
  hint?: string;
  /** Counter or mark after the label. */
  badge?: ReactNode;
  /** Unsaved changes dot. */
  dirty?: boolean;
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  items: ReadonlyArray<TabItem<T>>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  /** line — underlined sections; pill — sliding inverted pill (top navigation, filters). */
  variant?: "line" | "pill";
  size?: Size;
  /** Tabs share the width equally. */
  fill?: boolean;
  /** Links tabs to <TabPanel idPrefix=…> via aria-controls. */
  idPrefix?: string;
  "aria-label"?: string;
  className?: string;
}

/** Tab list per ARIA APG: one Tab stop, arrows move and activate, Home/End jump. */
export function Tabs<T extends string = string>({
  items,
  value,
  defaultValue,
  onChange,
  variant = "line",
  size = "md",
  fill,
  idPrefix,
  className,
  ...rest
}: TabsProps<T>) {
  const [current, set] = useControllable<T | undefined>(
    value,
    defaultValue ?? items[0]?.value,
    onChange as (v: T | undefined) => void,
  );
  const list = useRef<HTMLDivElement>(null);
  const box = useIndicator(list, '[aria-selected="true"]', current);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const enabled = items.filter((t) => !t.disabled);
    const i = enabled.findIndex((t) => t.value === current);
    const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: enabled.length - 1 }[event.key];
    if (to === undefined) return;
    event.preventDefault();
    const next = enabled[(to + enabled.length) % enabled.length];
    if (!next) return;
    set(next.value);
    list.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus();
  };

  return (
    <div
      ref={list}
      role="tablist"
      aria-label={rest["aria-label"]}
      className={cx("rk-tabs", className)}
      data-variant={variant}
      data-size={size}
      data-fill={fill || undefined}
      onKeyDown={onKeyDown}
    >
      {box && (
        <span
          className="rk-indicator rk-tabs-indicator"
          data-dir={box.dir}
          style={{ left: box.left, right: box.right }}
        />
      )}
      {items.map((t) => {
        const selected = t.value === current;
        const tab = (
          <button
            key={t.value}
            type="button"
            role="tab"
            id={idPrefix ? `${idPrefix}-tab-${t.value}` : undefined}
            aria-controls={idPrefix ? `${idPrefix}-panel-${t.value}` : undefined}
            aria-selected={selected}
            aria-label={t.label ? undefined : t.hint}
            tabIndex={selected ? 0 : -1}
            disabled={t.disabled}
            data-value={t.value}
            className="rk-tab"
            onClick={() => set(t.value)}
          >
            {t.icon && <span className="rk-icon">{t.icon}</span>}
            {t.label}
            {t.badge !== undefined && t.badge !== null && (
              <span className="rk-tab-badge rk-num">{t.badge}</span>
            )}
            {t.dirty && <span className="rk-tab-dirty" title="Unsaved changes" />}
          </button>
        );
        return t.hint && t.label ? (
          <Tooltip key={t.value} content={t.hint}>
            {tab}
          </Tooltip>
        ) : (
          tab
        );
      })}
    </div>
  );
}

export function TabPanel({
  idPrefix,
  value,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { idPrefix: string; value: string }) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${value}`}
      aria-labelledby={`${idPrefix}-tab-${value}`}
      {...rest}
      className={cx("rk-tab-panel", className)}
    />
  );
}

const SidebarContext = createContext({ collapsed: false });

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Icon-only rail; item labels move into tooltips. */
  collapsed?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}

export function Sidebar({ collapsed = false, header, footer, className, children, ...rest }: SidebarProps) {
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
  const { collapsed } = useContext(SidebarContext);
  const common = {
    className: "rk-nav-link",
    "aria-current": active ? ("page" as const) : undefined,
    title: collapsed ? undefined : title,
    onClick,
  };
  const content = (
    <>
      {icon && <span className="rk-icon rk-nav-icon">{icon}</span>}
      <span className="rk-nav-label">{label}</span>
    </>
  );
  const link = href ? (
    <a {...common} href={href} aria-disabled={disabled || undefined}>
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
              <ChevronRightIcon className="rk-card-chevron" data-open={isOpen || undefined} />
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

export interface DockItem<T extends string = string> {
  value: T;
  icon: ReactNode;
  label: string;
  /** `true` — dot; number/string — count. */
  badge?: boolean | number | string;
  disabled?: boolean;
}

export interface DockProps<T extends string = string> {
  items: ReadonlyArray<DockItem<T>>;
  value?: T;
  onChange?: (value: T) => void;
  /** icons — round icon buttons, labels in tooltips; labels — icon + text pills. */
  variant?: "icons" | "labels";
  /** Extra elements after the items: DockSeparator, a primary action. */
  children?: ReactNode;
  className?: string;
  "aria-label"?: string;
}

/**
 * Floating bottom navigation (surface material). Items keep a fixed size; the current one is marked by
 * an inverted pill sliding behind them, so switching never shifts the layout. Pairs with AppShell `dock`.
 */
export function Dock<T extends string = string>({
  items,
  value,
  onChange,
  variant = "icons",
  children,
  className,
  ...rest
}: DockProps<T>) {
  const track = useRef<HTMLDivElement>(null);
  const box = useIndicator(track, '[aria-current="page"]', `${variant}:${value}`);
  const labels = variant === "labels";
  return (
    <nav
      aria-label={rest["aria-label"] ?? "Dock"}
      className={cx("rk-dock rk-surface", className)}
      data-variant={variant}
    >
      <div ref={track} className="rk-dock-track">
        {box && (
          <span
            className="rk-indicator rk-dock-indicator"
            data-dir={box.dir}
            style={{ left: box.left, right: box.right }}
          />
        )}
        {items.map((item) => {
          const button = (
            <button
              key={item.value}
              type="button"
              className="rk-dock-item"
              aria-label={labels ? undefined : item.label}
              aria-current={item.value === value ? "page" : undefined}
              disabled={item.disabled}
              onClick={() => onChange?.(item.value)}
            >
              <span className="rk-icon">{item.icon}</span>
              {labels && <span className="rk-dock-label">{item.label}</span>}
              <DockBadge badge={item.badge} />
            </button>
          );
          return labels ? (
            button
          ) : (
            <Tooltip key={item.value} content={item.label}>
              {button}
            </Tooltip>
          );
        })}
      </div>
      {children}
    </nav>
  );
}

function DockBadge({ badge }: { badge: DockItem["badge"] }) {
  if (badge === true) return <span className="rk-dock-dot" />;
  if (badge === undefined || badge === false) return null;
  return <span className="rk-dock-count rk-num">{badge}</span>;
}

export function DockSeparator() {
  return <span className="rk-dock-sep" aria-hidden="true" />;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: ReadonlyArray<{ label: ReactNode; href?: string; onClick?: () => void; icon?: ReactNode }>;
}

export function Breadcrumbs({ items, className, ...rest }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" {...rest} className={cx("rk-breadcrumbs", className)}>
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          const content = (
            <>
              {item.icon && <span className="rk-icon">{item.icon}</span>}
              {item.label}
            </>
          );
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: path position is the identity
            <li key={i}>
              {last ? (
                <span aria-current="page">{content}</span>
              ) : item.href ? (
                <a href={item.href} onClick={item.onClick}>
                  {content}
                </a>
              ) : (
                <button type="button" onClick={item.onClick}>
                  {content}
                </button>
              )}
              {!last && <ChevronRightIcon className="rk-breadcrumbs-sep" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export interface PaginationProps {
  /** 1-based. */
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  /** Pages shown around the current one. */
  siblings?: number;
  className?: string;
}

export function pageRange(page: number, count: number, siblings: number): Array<number | "…"> {
  const pages = new Set([1, count]);
  for (let p = page - siblings; p <= page + siblings; p++) if (p >= 1 && p <= count) pages.add(p);
  const sorted = [...pages].sort((a, b) => a - b);
  const out: Array<number | "…"> = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev === 2) out.push(prev + 1);
    else if (prev !== undefined && p - prev > 2) out.push("…");
    out.push(p);
  });
  return out;
}

export function Pagination({ page, pageCount, onChange, siblings = 1, className }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className={cx("rk-pagination", className)}>
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeftIcon />
      </button>
      {pageRange(page, pageCount, siblings).map((p, i) =>
        p === "…" ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis has no identity
          <span key={`e${i}`} className="rk-pagination-gap">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRightIcon />
      </button>
    </nav>
  );
}
