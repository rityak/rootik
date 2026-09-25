type Politeness = "polite" | "assertive";

const regions: Partial<Record<Politeness, HTMLElement>> = {};

function region(politeness: Politeness): HTMLElement {
  let el = regions[politeness];
  if (!el) {
    el = document.createElement("div");
    el.setAttribute("aria-live", politeness);
    el.setAttribute("aria-atomic", "true");
    el.className = "rk-sr-only";
    // inline too: the region must stay invisible even before kit styles load
    el.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);";
    regions[politeness] = el;
  }
  // everything outside an open modal dialog is inert, including live regions
  const host = document.querySelector("dialog:modal") ?? document.body;
  if (el.parentElement !== host) host.append(el);
  return el;
}

/**
 * Speak a message to screen readers without moving focus: "Copied", "Saved", "12 results".
 * Repeating the same text is announced again.
 */
export function announce(message: string, politeness: Politeness = "polite") {
  if (typeof document === "undefined") return;
  const el = region(politeness);
  el.textContent = "";
  requestAnimationFrame(() => {
    el.textContent = message;
  });
}
