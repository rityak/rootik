import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register({ url: "http://localhost:61000", width: 1024, height: 768 });
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

// Happy DOM has no Popover implementation; top-layer geometry is checked in the real browser.
const matches = HTMLElement.prototype.matches;
Object.defineProperty(HTMLElement.prototype, "matches", {
  configurable: true,
  writable: true,
  value(this: HTMLElement, selector: string) {
    return selector === ":popover-open" ? this.hasAttribute("data-test-popover") : matches.call(this, selector);
  },
});
HTMLElement.prototype.showPopover = function () {
  this.setAttribute("data-test-popover", "");
  this.dispatchEvent(Object.assign(new Event("toggle"), { newState: "open", oldState: "closed" }));
};
HTMLElement.prototype.hidePopover = function () {
  this.removeAttribute("data-test-popover");
  this.dispatchEvent(Object.assign(new Event("toggle"), { newState: "closed", oldState: "open" }));
};
