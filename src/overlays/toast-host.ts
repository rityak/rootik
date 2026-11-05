import { type RefObject, useLayoutEffect, useRef, useState } from "react";
import { useAppearanceValue } from "../theme/provider";

/** Move a stable portal container into the active modal so notification actions escape page inertness. */
export function useToastHost(toaster: RefObject<HTMLDivElement | null>) {
  const origin = useRef<HTMLSpanElement>(null);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  useAppearanceValue("palette");
  useLayoutEffect(() => {
    const container = document.createElement("div");
    container.className = "rk-toast-host";
    const place = () => {
      const modal =
        document.activeElement?.closest<HTMLDialogElement>("dialog:modal") ??
        [...document.querySelectorAll<HTMLDialogElement>("dialog:modal")].at(-1);
      const parent = modal ?? origin.current?.parentElement;
      if (!parent || container.parentElement === parent) return;
      const panel = toaster.current;
      const shown = panel?.matches(":popover-open");
      if (shown) panel?.hidePopover();
      if (modal) modal.append(container);
      else origin.current?.after(container);
      if (panel?.isConnected && panel.querySelector(".rk-toast")) panel.showPopover();
    };
    place();
    setHost(container);
    const observer = new MutationObserver(place);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["open"],
    });
    document.addEventListener("focusin", place);
    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", place);
      container.remove();
    };
  }, [toaster]);

  // The portal keeps its owner's appearance even inside a differently themed modal.
  useLayoutEffect(() => {
    if (!host || !origin.current) return;
    const source = origin.current;
    const copy = () => {
      const computed = getComputedStyle(source);
      for (const name of Array.from(host.style)) {
        if (name.startsWith("--")) host.style.removeProperty(name);
      }
      for (const name of Array.from(computed)) {
        if (name.startsWith("--")) host.style.setProperty(name, computed.getPropertyValue(name));
      }
      for (const name of ["font-family", "font-size", "line-height", "color", "color-scheme"]) {
        host.style.setProperty(name, computed.getPropertyValue(name));
      }
      for (const attr of Array.from(host.attributes)) {
        if (attr.name.startsWith("data-rk-")) host.removeAttribute(attr.name);
      }
      const scope = source.closest("[data-rk-scope]") ?? document.documentElement;
      for (const attr of Array.from(scope.attributes)) {
        if (attr.name.startsWith("data-rk-")) host.setAttribute(attr.name, attr.value);
      }
    };
    copy();
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    media.addEventListener("change", copy);
    return () => media.removeEventListener("change", copy);
  });
  return { host, origin };
}
