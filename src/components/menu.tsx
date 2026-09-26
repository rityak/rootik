import {
  type ButtonHTMLAttributes,
  Children,
  createContext,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { Floating, type Placement } from "../lib/floating";
import { cloneTrigger, useControllable } from "../lib/hooks";
import { CheckIcon, ChevronRightIcon, icon as makeIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { Spinner } from "./progress";

const DotIcon = makeIcon(<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />);

/** What MenuItem calls after a pick; custom menu containers (Menubar) provide their own `close`. */
export const MenuContext = createContext<{ close: () => void }>({
  close: () => {
    // outside a Menu there is nothing to close
  },
});

const ITEM = '[role^="menuitem"]:not([aria-disabled="true"])';
const PRINTABLE = /\S/;

/** Roving focus over a menu panel's own items: arrows, Home/End, first-letter typeahead; Tab closes. */
export function onMenuKeyDown(event: React.KeyboardEvent<HTMLElement>, close: () => void) {
  // own items only: a submenu's items live inside this element too
  const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(ITEM)).filter(
    (el) => el.parentElement?.closest('[role="menu"]') === event.currentTarget,
  );
  const i = items.indexOf(document.activeElement as HTMLElement);
  const focus = (n: number) => {
    event.preventDefault();
    items[(n + items.length) % items.length]?.focus();
  };
  if (event.key === "ArrowDown") focus(i + 1);
  else if (event.key === "ArrowUp") focus(i < 0 ? -1 : i - 1);
  else if (event.key === "Home") focus(0);
  else if (event.key === "End") focus(-1);
  else if (event.key === "Tab") close();
  else if (event.key.length === 1 && PRINTABLE.test(event.key)) {
    const k = event.key.toLowerCase();
    const order = [...items.slice(i + 1), ...items.slice(0, i + 1)];
    order.find((el) => el.textContent?.trim().toLowerCase().startsWith(k))?.focus();
  }
}

function useMenuState(open: boolean | undefined, onOpenChange: ((open: boolean) => void) | undefined) {
  const [isOpen, setOpen] = useControllable(open, false, onOpenChange);
  const anchor = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const onFloatingChange = (next: boolean) => {
    // Light dismiss / Esc: return focus to the trigger only if it was inside the menu.
    if (!next && panel.current?.contains(document.activeElement)) anchor.current?.focus();
    if (next !== isOpen) setOpen(next);
    if (next) requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>(ITEM)?.focus());
  };
  const close = () => {
    setOpen(false);
    anchor.current?.focus();
  };
  return { isOpen, setOpen, anchor, panel, onFloatingChange, close };
}

export interface MenuProps {
  /** A button element; receives ref, aria and click wiring. */
  trigger: ReactElement;
  children: ReactNode;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  /** Items are being fetched: a spinner row replaces the children. */
  loading?: boolean;
  /** Shown when there are no children (nothing recent, no matches). */
  empty?: ReactNode;
}

export function Menu({
  trigger,
  children,
  placement = "bottom-start",
  open,
  onOpenChange,
  className,
  loading,
  empty,
}: MenuProps) {
  const m = useMenuState(open, onOpenChange);
  const id = useId();
  const labels = useLabels();
  return (
    <MenuContext value={{ close: m.close }}>
      {cloneTrigger(trigger, {
        ref: m.anchor,
        "aria-haspopup": "menu",
        "aria-expanded": m.isOpen,
        "aria-controls": id,
        onClick: () => m.setOpen(!m.isOpen),
        onKeyDown: (event: React.KeyboardEvent) => {
          if (event.key === "ArrowDown" && !m.isOpen) {
            event.preventDefault();
            m.setOpen(true);
          }
        },
      })}
      <Floating
        ref={m.panel}
        id={id}
        role="menu"
        anchor={m.anchor}
        open={m.isOpen}
        onOpenChange={m.onFloatingChange}
        placement={placement}
        className={cx("rk-menu", className)}
        aria-busy={loading || undefined}
        onKeyDown={(event) => onMenuKeyDown(event, m.close)}
      >
        {loading ? (
          <div className="rk-menu-status">
            <Spinner size={14} />
            {labels.loading}
          </div>
        ) : Children.count(children) === 0 && empty !== undefined ? (
          <div className="rk-menu-status">{empty}</div>
        ) : (
          children
        )}
      </Floating>
    </MenuContext>
  );
}

export interface ContextMenuProps {
  /** Target element; right-click (or the context-menu key) opens the menu at the pointer. */
  children: ReactElement;
  content: ReactNode;
  className?: string;
}

export function ContextMenu({ children, content, className }: ContextMenuProps) {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const m = useMenuState(point !== null, (next) => !next && setPoint(null));
  const anchor = useCallback(() => (point ? new DOMRect(point.x, point.y, 0, 0) : null), [point]);
  return (
    <MenuContext value={{ close: () => setPoint(null) }}>
      {cloneTrigger(children, {
        ref: m.anchor,
        onContextMenu: (event: React.MouseEvent) => {
          event.preventDefault();
          const r = (event.currentTarget as HTMLElement).getBoundingClientRect();
          // keyboard-invoked context menu has no pointer coordinates
          setPoint(
            event.clientX || event.clientY
              ? { x: event.clientX, y: event.clientY }
              : { x: r.left, y: r.bottom },
          );
        },
      })}
      <Floating
        ref={m.panel}
        role="menu"
        anchor={anchor}
        open={point !== null}
        onOpenChange={m.onFloatingChange}
        placement="bottom-start"
        offset={2}
        className={cx("rk-menu", className)}
        onKeyDown={(event) => onMenuKeyDown(event, () => setPoint(null))}
      >
        {content}
      </Floating>
    </MenuContext>
  );
}

export interface MenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  icon?: ReactNode;
  /** Shortcut hint on the right. */
  shortcut?: string;
  /** Right-side content (badge, count). */
  trailing?: ReactNode;
  hint?: ReactNode;
  danger?: boolean;
  onSelect?: () => void;
  /** Don't close the menu after selecting. */
  keepOpen?: boolean;
}

export function MenuItem({
  icon,
  shortcut,
  trailing,
  hint,
  danger,
  onSelect,
  keepOpen,
  disabled,
  className,
  children,
  ...rest
}: MenuItemProps) {
  const { close } = useContext(MenuContext);
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      {...rest}
      aria-disabled={disabled || undefined}
      data-danger={danger || undefined}
      className={cx("rk-menu-item", className)}
      onPointerMove={(event) => !disabled && event.currentTarget.focus()}
      onClick={() => {
        if (disabled) return;
        onSelect?.();
        if (!keepOpen) close();
      }}
    >
      {icon && <span className="rk-icon rk-menu-icon">{icon}</span>}
      <span className="rk-menu-text">
        <span className="rk-truncate">{children}</span>
        {hint && <span className="rk-menu-hint">{hint}</span>}
      </span>
      {trailing}
      {shortcut && <kbd className="rk-menu-shortcut">{shortcut}</kbd>}
    </button>
  );
}

export interface MenuSubProps {
  /** The submenu's own item text. */
  label: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
  /** Submenu items: MenuItem, MenuCheckboxItem, nested MenuSub. */
  children: ReactNode;
  className?: string;
}

/**
 * Nested menu (APG): opens on hover after a short delay, or with →/Enter/Space and focuses its first item;
 * ←/Esc close it and return to its item; choosing an item closes the whole menu. The panel is a nested
 * popover, so the parent stays open and light dismiss closes both.
 */
export function MenuSub({ label, icon, hint, disabled, children, className }: MenuSubProps) {
  const { close } = useContext(MenuContext);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();
  useEffect(() => () => clearTimeout(timer.current), []);

  const show = (focusFirst: boolean) => {
    clearTimeout(timer.current);
    if (disabled) return;
    setOpen(true);
    if (focusFirst) requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>(ITEM)?.focus());
  };
  const back = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        role="menuitem"
        tabIndex={-1}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        aria-disabled={disabled || undefined}
        className="rk-menu-item rk-menu-sub-trigger"
        onPointerMove={(event) => {
          if (disabled) return;
          event.currentTarget.focus();
          if (!open) {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => show(false), 120);
          }
        }}
        onPointerLeave={() => clearTimeout(timer.current)}
        onClick={() => show(true)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            show(true);
          }
        }}
        onBlur={() =>
          // focus moved to a sibling item (hover or arrows): the submenu goes away
          requestAnimationFrame(() => {
            const now = document.activeElement;
            if (now !== trigger.current && !panel.current?.contains(now)) setOpen(false);
          })
        }
      >
        {icon && <span className="rk-icon rk-menu-icon">{icon}</span>}
        <span className="rk-menu-text">
          <span className="rk-truncate">{label}</span>
          {hint && <span className="rk-menu-hint">{hint}</span>}
        </span>
        <ChevronRightIcon className="rk-menu-sub-chevron" />
      </button>
      <Floating
        ref={panel}
        id={id}
        role="menu"
        anchor={trigger}
        open={open}
        onOpenChange={(next) => {
          if (!next && panel.current?.contains(document.activeElement)) trigger.current?.focus();
          if (next !== open) setOpen(next);
        }}
        placement="right-start"
        offset={2}
        className={cx("rk-menu rk-submenu", className)}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.key === "ArrowLeft" || event.key === "Escape") {
            event.preventDefault();
            back();
            return;
          }
          onMenuKeyDown(event, close);
        }}
      >
        {children}
      </Floating>
    </>
  );
}

export interface MenuCheckboxItemProps extends Omit<MenuItemProps, "onSelect" | "icon"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function MenuCheckboxItem({
  checked,
  onCheckedChange,
  keepOpen = true,
  ...rest
}: MenuCheckboxItemProps) {
  return (
    <MenuItem
      {...rest}
      role="menuitemcheckbox"
      aria-checked={checked}
      keepOpen={keepOpen}
      icon={<CheckIcon style={{ opacity: checked ? 1 : 0 }} />}
      onSelect={() => onCheckedChange(!checked)}
    />
  );
}

const RadioCtx = createContext<{ value?: string; onValueChange: (value: string) => void } | null>(null);

export interface MenuRadioGroupProps {
  value?: string;
  onValueChange: (value: string) => void;
  /** Accessible name of the group; pair it with a visible MenuLabel. */
  label?: string;
  children: ReactNode;
}

/** One-of-many choice inside a menu (sort order, view mode). */
export function MenuRadioGroup({ value, onValueChange, label, children }: MenuRadioGroupProps) {
  return (
    <RadioCtx value={{ value, onValueChange }}>
      {/* biome-ignore lint/a11y/useSemanticElements: a fieldset is not an allowed menu child */}
      <div role="group" aria-label={label}>
        {children}
      </div>
    </RadioCtx>
  );
}

export interface MenuRadioItemProps extends Omit<MenuItemProps, "onSelect" | "icon"> {
  value: string;
}

export function MenuRadioItem({ value, ...rest }: MenuRadioItemProps) {
  const group = useContext(RadioCtx);
  const checked = group?.value === value;
  return (
    <MenuItem
      {...rest}
      role="menuitemradio"
      aria-checked={checked}
      icon={<DotIcon style={{ opacity: checked ? 1 : 0 }} />}
      onSelect={() => group?.onValueChange(value)}
    />
  );
}

export function MenuSeparator() {
  // biome-ignore lint/a11y/useSemanticElements: <hr> is not allowed as a menu child
  return <div role="separator" className="rk-menu-separator" />;
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return <div className="rk-menu-label">{children}</div>;
}

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  trigger: ReactElement;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
}

/** Non-modal floating panel anchored to a trigger (filters, pickers, details). */
export function Popover({
  trigger,
  placement = "bottom-start",
  open,
  onOpenChange,
  title,
  className,
  children,
  ...rest
}: PopoverProps) {
  const [isOpen, setOpen] = useControllable(open, false, onOpenChange);
  const anchor = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  return (
    <>
      {cloneTrigger(trigger, {
        ref: anchor,
        "aria-haspopup": "dialog",
        "aria-expanded": isOpen,
        "aria-controls": id,
        onClick: () => setOpen(!isOpen),
      })}
      <Floating
        {...rest}
        ref={panel}
        id={id}
        role="dialog"
        aria-label={typeof title === "string" ? title : undefined}
        anchor={anchor}
        open={isOpen}
        onOpenChange={(next) => {
          if (!next && panel.current?.contains(document.activeElement)) anchor.current?.focus();
          if (next !== isOpen) setOpen(next);
        }}
        placement={placement}
        className={cx("rk-popover", className)}
      >
        {title && <div className="rk-popover-title">{title}</div>}
        {children}
      </Floating>
    </>
  );
}
