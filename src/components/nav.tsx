import {
  type CSSProperties,
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
import { useLabels } from "../lib/labels";
import type { Size } from "./button";
import { useShellCompact, useShellDockBar } from "./layout";
import { Select } from "./select";
import { Tooltip } from "./tooltip";

export interface TabItem<T extends string = string> {
  value: T;
  label?: ReactNode;
  icon?: ReactNode;
  /** Raw leading media instead of the square icon slot. */
  media?: ReactNode;
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
  /** `vertical`: a stacked list beside the panel (settings pages); ↑/↓ move. */
  orientation?: "horizontal" | "vertical";
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
  orientation = "horizontal",
  className,
  ...rest
}: TabsProps<T>) {
  const vertical = orientation === "vertical";
  const [current, set] = useControllable<T | undefined>(
    value,
    defaultValue ?? items[0]?.value,
    onChange as (v: T | undefined) => void,
  );
  const list = useRef<HTMLDivElement>(null);
  const box = useIndicator(list, '[aria-selected="true"]', current, vertical ? "y" : "x");
  const strings = useLabels();

  const onKeyDown = (event: React.KeyboardEvent) => {
    const enabled = items.filter((t) => !t.disabled);
    const i = enabled.findIndex((t) => t.value === current);
    const [back, forward] = vertical ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];
    const to = { [forward]: i + 1, [back]: i - 1, Home: 0, End: enabled.length - 1 }[event.key];
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
      aria-orientation={vertical ? "vertical" : undefined}
      className={cx("rk-tabs", className)}
      data-orientation={orientation}
      data-variant={variant}
      data-size={size}
      data-fill={fill || undefined}
      onKeyDown={onKeyDown}
    >
      {box && (
        <span
          className="rk-indicator rk-tabs-indicator"
          data-dir={box.dir}
          style={vertical ? { top: box.left, bottom: box.right } : { left: box.left, right: box.right }}
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
            {t.media ? (
              <span className="rk-tab-media">{t.media}</span>
            ) : (
              t.icon && <span className="rk-icon">{t.icon}</span>
            )}
            {t.label}
            {t.badge !== undefined && t.badge !== null && (
              <span className="rk-tab-badge rk-num">{t.badge}</span>
            )}
            {t.dirty && (
              <span className="rk-tab-dirty" title={strings.unsaved}>
                <span className="rk-sr-only">{strings.unsaved}</span>
              </span>
            )}
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

export interface TopNavItem {
  href: string;
  label: ReactNode;
  icon?: ReactNode;
}

export interface TopNavProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  items: ReadonlyArray<TopNavItem>;
  /** href of the current page. */
  current?: string;
  /** Client-side routing: called instead of following the link (modifier clicks still open normally). */
  onNavigate?: (href: string) => void;
  size?: Size;
}

/** Page navigation as a pill bar of real links (Cmd/middle-click work); the current page is the inverted pill. */
export function TopNav({ items, current, onNavigate, size = "md", className, ...rest }: TopNavProps) {
  const list = useRef<HTMLDivElement>(null);
  const box = useIndicator(list, '[aria-current="page"]', current);
  const strings = useLabels();
  return (
    <nav aria-label={strings.navigation} {...rest} className={cx("rk-topnav", className)}>
      <div ref={list} className="rk-tabs" data-variant="pill" data-size={size}>
        {box && (
          <span
            className="rk-indicator rk-tabs-indicator"
            data-dir={box.dir}
            style={{ left: box.left, right: box.right }}
          />
        )}
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rk-tab"
            aria-current={item.href === current ? "page" : undefined}
            onClick={(event) => {
              if (!onNavigate || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
                return;
              event.preventDefault();
              onNavigate(item.href);
            }}
          >
            {item.icon && <span className="rk-icon">{item.icon}</span>}
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export interface TocItem {
  id: string;
  label: ReactNode;
  /** 0 for top-level sections, 1+ for nested ones. */
  depth?: number;
}

export interface TableOfContentsProps extends HTMLAttributes<HTMLElement> {
  items: ReadonlyArray<TocItem>;
  /** Id of the section being read (from `useScrollSpy`). */
  active?: string;
}

/** In-page section links with the current one marked on a rail (long settings and docs pages). */
export function TableOfContents({ items, active, className, ...rest }: TableOfContentsProps) {
  const strings = useLabels();
  return (
    <nav aria-label={strings.onThisPage} {...rest} className={cx("rk-toc", className)}>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="rk-toc-link"
          style={{ "--rk-toc-depth": item.depth ?? 0 } as CSSProperties}
          aria-current={item.id === active ? "location" : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
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
    "data-rk-nav-item": "",
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
  /** Spoken badge ("3 new errors"); defaults to the count, or the `newItems` label for a dot. */
  badgeLabel?: string;
  disabled?: boolean;
  /** Tab id and controlled panel id when Dock uses tab mode. */
  id?: string;
  controls?: string;
}

export interface DockProps<T extends string = string> {
  items: ReadonlyArray<DockItem<T>>;
  value?: T;
  onChange?: (value: T) => void;
  /** icons — round icon buttons, labels in tooltips; labels — icon + text pills. */
  variant?: "icons" | "labels";
  /** tabs uses the APG tablist/tab contract instead of page navigation. */
  mode?: "navigation" | "tabs";
  /** Extra elements after the items: DockSeparator, a primary action. In a bar they sit at the far end. */
  children?: ReactNode;
  /** Before the items: a start button that opens a launcher menu, a logo. */
  start?: ReactNode;
  /**
   * float — capsule; bar — full-width taskbar. Defaults to bar inside an AppShell with `dockPlacement="bar"`.
   */
  shape?: "float" | "bar";
  /** Where items sit in a bar: start (Windows 10) or center (Windows 11). */
  align?: "start" | "center";
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
  mode = "navigation",
  children,
  start,
  shape,
  align = "start",
  className,
  ...rest
}: DockProps<T>) {
  const track = useRef<HTMLDivElement>(null);
  // a compact AppShell (phone, narrow window, high zoom) has no room for text pills
  const compact = useShellCompact();
  const shellBar = useShellDockBar();
  const bar = (shape ?? (shellBar ? "bar" : "float")) === "bar";
  const withLabels = variant === "labels" && !compact;
  const box = useIndicator(
    track,
    mode === "tabs" ? '[aria-selected="true"]' : '[aria-current="page"]',
    `${withLabels}:${value}`,
  );
  const strings = useLabels();
  const label = rest["aria-label"] ?? strings.navigation;
  const tabStop =
    items.find((item) => item.value === value && !item.disabled)?.value ??
    items.find((item) => !item.disabled)?.value;
  const onTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLButtonElement>(".rk-dock-item");
    if (mode !== "tabs" || !target || !event.currentTarget.contains(target)) return;
    const enabled = items.filter((item) => !item.disabled);
    const at = enabled.findIndex((item) => item.value === target.dataset.value);
    const to = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: enabled.length - 1 }[event.key];
    if (at < 0 || to === undefined || enabled.length === 0) return;
    const next = enabled[(to + enabled.length) % enabled.length];
    if (!next) return;
    event.preventDefault();
    onChange?.(next.value);
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus();
  };
  const trackProps = mode === "tabs" ? { role: "tablist", "aria-label": label, onKeyDown: onTabKeyDown } : {};
  return (
    <nav
      aria-label={label}
      className={cx("rk-dock rk-surface", className)}
      data-variant={withLabels ? "labels" : "icons"}
      data-shape={bar ? "bar" : undefined}
      data-align={bar ? align : undefined}
    >
      {start}
      <div ref={track} className="rk-dock-track" {...trackProps}>
        {box && (
          <span
            className="rk-indicator rk-dock-indicator"
            data-dir={box.dir}
            style={{ left: box.left, right: box.right }}
          />
        )}
        {items.map((item) => {
          const current = item.value === value;
          const semantics =
            mode === "tabs"
              ? {
                  role: "tab" as const,
                  id: item.id,
                  "aria-controls": item.controls,
                  "aria-selected": current,
                }
              : { "aria-current": current ? ("page" as const) : undefined };
          const button = (
            <button
              key={item.value}
              type="button"
              className="rk-dock-item"
              {...semantics}
              data-value={item.value}
              tabIndex={mode === "tabs" ? (item.value === tabStop ? 0 : -1) : undefined}
              disabled={item.disabled}
              onClick={() => onChange?.(item.value)}
            >
              <span className="rk-icon">{item.icon}</span>
              {/* the name comes from content, so it includes the badge (aria-label would drop it) */}
              <span className={withLabels ? "rk-dock-label" : "rk-sr-only"}>{item.label}</span>
              <DockBadge
                badge={item.badge}
                label={item.badgeLabel ?? (item.badge === true ? strings.newItems : undefined)}
              />
            </button>
          );
          return withLabels ? (
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

function DockBadge({ badge, label }: { badge: DockItem["badge"]; label?: string }) {
  const spoken = label && <span className="rk-sr-only">, {label}</span>;
  if (badge === true)
    return (
      <>
        <span className="rk-dock-dot" />
        {spoken}
      </>
    );
  if (badge === undefined || badge === false) return null;
  return (
    <>
      <span className="rk-dock-count rk-num" aria-hidden={label ? true : undefined}>
        {badge}
      </span>
      {spoken}
    </>
  );
}

export function DockSeparator() {
  return <span className="rk-dock-sep" aria-hidden="true" />;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: ReadonlyArray<{ label: ReactNode; href?: string; onClick?: () => void; icon?: ReactNode }>;
}

export function Breadcrumbs({ items, className, ...rest }: BreadcrumbsProps) {
  const strings = useLabels();
  return (
    <nav aria-label={strings.breadcrumb} {...rest} className={cx("rk-breadcrumbs", className)}>
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
  /** `compact`: "3 / 20" between the arrows, for toolbars and narrow panels. */
  variant?: "full" | "compact";
  /** With `total`, shows the item range ("26–50 of 480"). */
  pageSize?: number;
  total?: number;
  /** Options for a page-size select; shown with `onPageSizeChange`. */
  pageSizes?: ReadonlyArray<number>;
  onPageSizeChange?: (size: number) => void;
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

export function Pagination({
  page,
  pageCount,
  onChange,
  siblings = 1,
  variant = "full",
  pageSize,
  total,
  pageSizes = [10, 25, 50, 100],
  onPageSizeChange,
  className,
}: PaginationProps) {
  const strings = useLabels();
  const from = pageSize && total !== undefined ? Math.min(total, (page - 1) * pageSize + 1) : 0;
  const to = pageSize && total !== undefined ? Math.min(total, page * pageSize) : 0;
  return (
    <nav aria-label={strings.pagination} className={cx("rk-pagination", className)} data-variant={variant}>
      {pageSize !== undefined && total !== undefined && (
        <span className="rk-pagination-info rk-num">{strings.itemRange(from, to, total)}</span>
      )}
      {pageSize !== undefined && onPageSizeChange && (
        <Select
          size="sm"
          variant="button"
          aria-label={strings.pageSize}
          value={String(pageSize)}
          onChange={(v) => onPageSizeChange(Number(v))}
          options={pageSizes.map((n) => ({ value: String(n), label: strings.perPage(n) }))}
          className="rk-pagination-size"
        />
      )}
      <button
        type="button"
        aria-label={strings.previousPage}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeftIcon />
      </button>
      {variant === "compact" ? (
        <span className="rk-pagination-current rk-num" aria-current="page">
          {page} / {pageCount}
        </span>
      ) : (
        pageRange(page, pageCount, siblings).map((p, i) =>
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
        )
      )}
      <button
        type="button"
        aria-label={strings.nextPage}
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRightIcon />
      </button>
    </nav>
  );
}
