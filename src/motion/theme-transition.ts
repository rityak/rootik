import { flushSync } from "react-dom";

export type ThemeTransition = "fade" | "wipe" | "iris";
export interface ThemeTransitionOptions {
  effects?: "off" | "subtle" | "expressive";
  motion?: "system" | "full" | "off";
  themeTransition?: ThemeTransition;
  svgShapes?: boolean;
  style?: "rootik" | "fluent";
}

let active: { transition: ViewTransition; restore: () => void } | undefined;
let serial = 0;

export function cancelThemeTransition() {
  active?.transition.skipTransition();
  active?.restore();
}

/** Call from an event handler; unsupported/reduced-motion environments commit synchronously. */
export function startThemeTransition(update: () => void, options: ThemeTransitionOptions = {}) {
  if (
    typeof document === "undefined" ||
    !document.startViewTransition ||
    !options.effects ||
    options.effects === "off" ||
    options.motion === "off" ||
    (typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce), (forced-colors: active)").matches)
  ) {
    update();
    return;
  }
  const kind =
    options.style === "fluent" || options.svgShapes === false ? "fade" : (options.themeTransition ?? "fade");
  const canvases = [...document.querySelectorAll<HTMLElement>(".rk-svg-backdrop, [data-rk-motion-canvas]")];
  if (canvases.length === 0) {
    update();
    return;
  }
  cancelThemeTransition();
  const root = document.documentElement;
  const cleanup: (() => void)[] = [];
  const assign = (element: HTMLElement, name: string) => {
    const previous = element.style.getPropertyValue("view-transition-name");
    const priority = element.style.getPropertyPriority("view-transition-name");
    element.style.setProperty("view-transition-name", name);
    cleanup.push(() => {
      if (element.style.getPropertyValue("view-transition-name") !== name) return;
      if (previous) element.style.setProperty("view-transition-name", previous, priority);
      else element.style.removeProperty("view-transition-name");
    });
  };
  // Capturing the document root makes native controls inert during the animation.
  assign(root, "none");
  const id = ++serial;
  canvases.forEach((canvas, index) => {
    assign(canvas, `rk-canvas-${id}-${index}`);
  });
  const previousKind = root.getAttribute("data-rk-theme-transition");
  root.setAttribute("data-rk-theme-transition", kind);
  let restored = false;
  const restore = () => {
    if (restored) return;
    restored = true;
    for (const undo of cleanup) undo();
    if (root.getAttribute("data-rk-theme-transition") === kind) {
      if (previousKind === null) root.removeAttribute("data-rk-theme-transition");
      else root.setAttribute("data-rk-theme-transition", previousKind);
    }
    if (active?.restore === restore) active = undefined;
  };
  let committed = false;
  let transition: ViewTransition;
  try {
    transition = document.startViewTransition(() => {
      committed = true;
      flushSync(update);
    });
  } catch (error) {
    restore();
    if (committed) throw error;
    update();
    return;
  }
  active = { transition, restore };
  void transition.finished.then(restore, restore);
  transition.types?.add(`rk-${kind}`);
  // Skipping a visual transition must not create an unhandled ready rejection.
  void transition.ready.catch(() => undefined);
  return transition;
}
