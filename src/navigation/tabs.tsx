import { type CSSProperties, type HTMLAttributes, type ReactNode, useRef } from "react";
import type { Size } from "../components/button";
import { SvgControlFrame, useSvgControlBorder } from "../components/svg-control-frame";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
import { useIndicator } from "../lib/indicator";
import { useLabels } from "../lib/labels";
import { useFocusRecovery } from "../lib/roving";
import type { SvgControlBorder } from "../lib/svg-geometry";
import { MotionLayer } from "../motion/layer";
import { Tooltip } from "../overlays/tooltip";

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
  /** Optional contour for pill tabs; line tabs retain their underline. */
  svgBorder?: SvgControlBorder;
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
  svgBorder,
  size = "md",
  fill,
  idPrefix,
  orientation = "horizontal",
  className,
  ...rest
}: TabsProps<T>) {
  const border = useSvgControlBorder(variant === "pill" ? svgBorder : undefined);
  const vertical = orientation === "vertical";
  const [current, set] = useControllable<T | undefined>(
    value,
    defaultValue ?? items.find((t) => !t.disabled)?.value,
    onChange as (v: T | undefined) => void,
  );
  const list = useRef<HTMLDivElement>(null);
  useFocusRecovery(list);
  const enabled = items.filter((t) => !t.disabled);
  const tabStop = enabled.find((t) => t.value === current)?.value ?? enabled[0]?.value;
  const box = useIndicator(list, '[aria-selected="true"]', current, vertical ? "y" : "x");
  const strings = useLabels();

  const onKeyDown = (event: React.KeyboardEvent) => {
    const from = (event.target as HTMLElement).closest<HTMLElement>('[role="tab"]')?.dataset.value;
    const i = enabled.findIndex((t) => t.value === from);
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
      data-svg-border={border}
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
        const itemBorder = vertical && !selected ? undefined : border;
        const tab = (
          <button
            key={t.value}
            type="button"
            role="tab"
            id={idPrefix ? `${idPrefix}-tab-${t.value}` : undefined}
            aria-controls={idPrefix ? `${idPrefix}-panel-${t.value}` : undefined}
            aria-selected={selected}
            aria-label={t.label ? undefined : t.hint}
            tabIndex={t.value === tabStop ? 0 : -1}
            disabled={t.disabled}
            data-value={t.value}
            data-svg-border={itemBorder}
            className="rk-tab"
            onClick={() => set(t.value)}
          >
            {itemBorder ? <SvgControlFrame border={itemBorder} /> : <MotionLayer />}
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
            <MotionLayer />
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
