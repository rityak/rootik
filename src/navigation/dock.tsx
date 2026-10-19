import { type ReactNode, useRef } from "react";
import { useShellCompact, useShellDockBar } from "../layout/shell-context";
import { cx } from "../lib/cx";
import { useIndicator } from "../lib/indicator";
import { useLabels } from "../lib/labels";
import { useFocusRecovery } from "../lib/roving";
import { MotionLayer } from "../motion/layer";
import { Tooltip } from "../overlays/tooltip";

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
  useFocusRecovery(track);
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
              <MotionLayer active={current} />
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
