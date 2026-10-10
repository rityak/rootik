import { type KeyboardEvent, type RefObject, useLayoutEffect, useRef } from "react";
import { isTypingTarget } from "./hooks";

const ITEMS =
  'button, a[href], input, select, textarea, [role="button"], [role="checkbox"], [role="switch"], [role="menuitem"]';

/** Descendants that own the arrow keys themselves: fields, radios, sliders, composite widgets. */
const OWNS_ARROWS =
  'input[type="radio"], input[type="range"], [role="radiogroup"], [role="tablist"], [role="listbox"], [role="grid"], [role="slider"], [role="spinbutton"], [role="menu"], [aria-expanded="true"]';

const isRadio = (el: Element): el is HTMLInputElement =>
  el instanceof HTMLInputElement && el.type === "radio";

/** Radios of the same group as `radio` inside `root`, in DOM order. */
const groupOf = (root: HTMLElement, radio: HTMLInputElement) =>
  Array.from(root.querySelectorAll<HTMLInputElement>('input[type="radio"]')).filter(
    (r) => r.name === radio.name,
  );

/** Restore focus after a focused roving item is removed or natively disabled, without stealing it. */
export function useFocusRecovery(ref: RefObject<HTMLElement | null>) {
  const focused = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const onFocus = (event: FocusEvent) => {
      focused.current = event.target instanceof HTMLElement ? event.target : null;
    };
    const onBlur = (event: FocusEvent) => {
      if (root.contains(event.relatedTarget as Node | null)) return;
      if (event.relatedTarget) focused.current = null;
      else {
        // React blurs a removed node while it is still connected; wait for the commit.
        const leaving = focused.current;
        queueMicrotask(() => {
          if (focused.current === leaving && leaving?.ownerDocument.activeElement !== leaving)
            focused.current = null;
        });
      }
    };
    root.addEventListener("focusin", onFocus);
    root.addEventListener("focusout", onBlur);
    return () => {
      root.removeEventListener("focusin", onFocus);
      root.removeEventListener("focusout", onBlur);
    };
  }, [ref]);
  useLayoutEffect(() => {
    const node = focused.current;
    const root = ref.current;
    if (!node || !root || (root.contains(node) && !node.matches(":disabled"))) return;
    focused.current = null;
    root.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
  });
}

function itemsOf(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(ITEMS)).filter((el) => {
    if ((el as HTMLButtonElement).disabled || el.getAttribute("aria-disabled") === "true") return false;
    if (el.closest("[popover]") || el.getClientRects().length === 0) return false;
    // a radio group is one stop: its checked radio (or the first one)
    if (isRadio(el)) {
      const group = groupOf(root, el);
      return el.checked || (!group.some((r) => r.checked) && group[0] === el);
    }
    return true;
  });
}

/**
 * Roving tab stop for a composite widget (APG toolbar): one Tab stop for the group, arrows move between
 * items, Home/End jump to the ends, and the last focused item is remembered. Descendants that use arrows
 * themselves (text fields, radio groups, sliders, open popups) keep them.
 */
export function useRovingFocus(
  ref: RefObject<HTMLElement | null>,
  orientation: "horizontal" | "vertical" = "horizontal",
) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    let active: HTMLElement | null = null;
    const apply = () => {
      const items = itemsOf(root);
      if (!active || !items.includes(active)) active = items[0] ?? null;
      for (const item of items) item.tabIndex = item === active ? 0 : -1;
    };
    const onFocusIn = (event: FocusEvent) => {
      const item = (event.target as HTMLElement).closest<HTMLElement>(ITEMS);
      if (item && root.contains(item) && itemsOf(root).includes(item)) {
        active = item;
        apply();
      }
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "aria-disabled", "hidden"],
    });
    root.addEventListener("focusin", onFocusIn);
    return () => {
      observer.disconnect();
      root.removeEventListener("focusin", onFocusIn);
    };
  }, [ref]);

  return (event: KeyboardEvent<HTMLElement>) => {
    const root = ref.current;
    const target = event.target as HTMLElement;
    if (!root || isTypingTarget(target)) return;
    const [prev, next] = orientation === "vertical" ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];
    if (isRadio(target)) {
      // radios move the selection inside their group; at its edges the arrow leaves for the next control
      const group = groupOf(root, target);
      const edge =
        (event.key === next && group.at(-1) === target) || (event.key === prev && group[0] === target);
      if (!edge && event.key !== "Home" && event.key !== "End") return;
    } else if (target.closest(OWNS_ARROWS)) return;
    const items = itemsOf(root);
    const at = items.findIndex(
      (el) =>
        el === target || el.contains(target) || (isRadio(el) && isRadio(target) && el.name === target.name),
    );
    let to: HTMLElement | undefined;
    if (event.key === next) to = items[(at + 1) % items.length];
    else if (event.key === prev) to = items[(at - 1 + items.length) % items.length];
    else if (event.key === "Home") to = items[0];
    else if (event.key === "End") to = items.at(-1);
    if (!to) return;
    event.preventDefault();
    to.focus();
  };
}
