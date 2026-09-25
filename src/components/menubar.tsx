import {
  createContext,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { Floating } from "../lib/floating";
import { MenuContext, onMenuKeyDown } from "./menu";

type FocusOnOpen = "first" | "last" | null;

interface MenubarCtx {
  openId: string | null;
  activeId: string | null;
  setActive: (id: string) => void;
  /** Open a menu (null closes); `focus` picks the item that takes focus once it shows. */
  open: (id: string | null, focus?: FocusOnOpen) => void;
  /** Consume the pending focus request for `id`. */
  takeFocus: (id: string) => FocusOnOpen;
  /** Close unless another menu took over meanwhile. */
  closeIf: (id: string) => void;
  /** Move to the trigger `delta` steps away (wrapping), opening it if a menu is open. */
  step: (from: HTMLElement, delta: number | "first" | "last", focus?: FocusOnOpen) => void;
}

const MenubarContext = createContext<MenubarCtx | null>(null);

const TRIGGER = ".rk-menubar-trigger";
const ITEM = '[role^="menuitem"]:not([aria-disabled="true"])';
const PRINTABLE = /\S/;

export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
  /** MenubarMenu elements. */
  children: ReactNode;
}

/**
 * Desktop menu bar (File / Edit / View) per the APG menubar pattern: one tab stop, ←/→ move between
 * menus (and carry an open menu along), ↓/Enter/Space open, ↑ opens at the last item; once a menu is
 * open, hovering another title switches to it. Items are the regular MenuItem / MenuSub / MenuCheckboxItem.
 */
export function Menubar({ className, children, ...rest }: MenubarProps) {
  const root = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const pending = useRef<{ id: string; focus: FocusOnOpen } | null>(null);

  const triggers = () =>
    Array.from(root.current?.querySelectorAll<HTMLElement>(TRIGGER) ?? []).filter(
      (el) => el.closest(".rk-menubar") === root.current,
    );

  // the first title is the tab stop until another one is focused
  useLayoutEffect(() => {
    if (activeId === null) {
      const first = triggers()[0]?.dataset.menuId;
      if (first) setActiveId(first);
    }
  });

  const ctx: MenubarCtx = {
    openId,
    activeId,
    setActive: setActiveId,
    open: (id, focus = "first") => {
      pending.current = id ? { id, focus } : null;
      setOpenId(id);
    },
    takeFocus: (id) => {
      const p = pending.current;
      if (p?.id !== id) return null;
      pending.current = null;
      return p.focus;
    },
    closeIf: (id) => setOpenId((current) => (current === id ? null : current)),
    step: (from, delta, focus = "first") => {
      const all = triggers();
      const i = all.indexOf(from);
      const n =
        delta === "first" ? 0 : delta === "last" ? all.length - 1 : (i + delta + all.length) % all.length;
      const next = all[n];
      if (!next) return;
      next.focus();
      if (openId !== null) {
        pending.current = { id: next.dataset.menuId ?? "", focus };
        setOpenId(next.dataset.menuId ?? null);
      }
    },
  };

  return (
    <MenubarContext value={ctx}>
      <div
        role="menubar"
        aria-orientation="horizontal"
        {...rest}
        ref={root}
        className={cx("rk-menubar", className)}
        data-open={openId !== null || undefined}
      >
        {children}
      </div>
    </MenubarContext>
  );
}

export interface MenubarMenuProps {
  /** Title in the bar ("File"). */
  label: ReactNode;
  /** MenuItem, MenuSub, MenuCheckboxItem, MenuSeparator, MenuLabel. */
  children: ReactNode;
  disabled?: boolean;
  /** Class for the dropdown panel. */
  className?: string;
}

export function MenubarMenu({ label, children, disabled, className }: MenubarMenuProps) {
  const bar = useContext(MenubarContext);
  if (!bar) throw new Error("MenubarMenu must be inside a Menubar");
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const isOpen = bar.openId === id;

  // focus the requested item once the panel is shown and positioned
  useEffect(() => {
    if (!isOpen) return;
    const focus = bar.takeFocus(id);
    if (!focus) return;
    const frame = requestAnimationFrame(() => {
      const items = panel.current?.querySelectorAll<HTMLElement>(ITEM);
      (focus === "last" ? items?.[items.length - 1] : items?.[0])?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, bar, id]);

  const close = () => {
    bar.closeIf(id);
    trigger.current?.focus();
  };
  const openAt = (focus: "first" | "last") => {
    if (disabled) return;
    if (!isOpen) return bar.open(id, focus);
    // already open (hovered): step into it
    const items = panel.current?.querySelectorAll<HTMLElement>(ITEM);
    (focus === "last" ? items?.[items.length - 1] : items?.[0])?.focus();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const el = event.currentTarget;
    let handled = true;
    switch (event.key) {
      case "ArrowRight":
        bar.step(el, 1);
        break;
      case "ArrowLeft":
        bar.step(el, -1);
        break;
      case "Home":
        bar.step(el, "first");
        break;
      case "End":
        bar.step(el, "last");
        break;
      case "ArrowDown":
      case "Enter":
      case " ":
        openAt("first");
        break;
      case "ArrowUp":
        openAt("last");
        break;
      default:
        handled = false;
        if (event.key.length === 1 && PRINTABLE.test(event.key) && !event.ctrlKey && !event.metaKey) {
          const all = Array.from(el.closest(".rk-menubar")?.querySelectorAll<HTMLElement>(TRIGGER) ?? []);
          const i = all.indexOf(el);
          const k = event.key.toLowerCase();
          [...all.slice(i + 1), ...all.slice(0, i + 1)]
            .find((t) => t.textContent?.trim().toLowerCase().startsWith(k))
            ?.focus();
        }
    }
    if (handled) event.preventDefault();
  };

  return (
    <MenuContext value={{ close }}>
      <button
        ref={trigger}
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={id}
        aria-disabled={disabled || undefined}
        tabIndex={bar.activeId === id ? 0 : -1}
        className="rk-menubar-trigger"
        data-menu-id={id}
        onFocus={() => bar.setActive(id)}
        onClick={() => {
          if (!disabled) bar.open(isOpen ? null : id, "first");
        }}
        onPointerEnter={(event) => {
          // once any menu is open, the bar tracks the pointer (focus stays on the title)
          if (bar.openId === null || isOpen || disabled) return;
          event.currentTarget.focus();
          bar.open(id, null);
        }}
        onKeyDown={onTriggerKeyDown}
      >
        {label}
      </button>
      <Floating
        ref={panel}
        id={id}
        role="menu"
        aria-label={typeof label === "string" ? label : undefined}
        anchor={trigger}
        open={isOpen}
        onOpenChange={(next) => {
          if (next) return;
          // Esc / light dismiss: hand focus back only if it was inside this menu
          if (panel.current?.contains(document.activeElement)) trigger.current?.focus();
          bar.closeIf(id);
        }}
        placement="bottom-start"
        offset={4}
        className={cx("rk-menu", className)}
        onKeyDown={(event) => {
          // submenus stop propagation, so ←/→ here are the menu's own: move along the bar
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            const from = trigger.current;
            if (from) bar.step(from, event.key === "ArrowRight" ? 1 : -1);
            return;
          }
          onMenuKeyDown(event, close);
        }}
      >
        {children}
      </Floating>
    </MenuContext>
  );
}
