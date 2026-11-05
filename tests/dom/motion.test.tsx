import { expect, test } from "bun:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { Button, PowerButton } from "../../src/controls/index";
import { cancelThemeTransition, MotionLayer, startThemeTransition } from "../../src/motion/index";
import { Scope } from "../../src/theme/provider";

test("reactor status follows its fixed contour while signal keeps its circular orbit", async () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  try {
    await act(() =>
      root.render(
        <>
          <PowerButton variant="reactor" label="Reactor" pending />
          <PowerButton variant="signal" label="Signal" pending />
        </>,
      ),
    );
    const [reactor, signal] = container.querySelectorAll("button");
    const contour = reactor?.querySelector(".rk-power-track");
    expect(contour?.tagName.toLowerCase()).toBe("path");
    expect(reactor?.querySelector(".rk-power-status")?.getAttribute("d")).toBe(contour?.getAttribute("d"));
    expect(reactor?.querySelector(".rk-power-ticks")?.getAttribute("d")).toBe(contour?.getAttribute("d"));
    expect(reactor?.querySelector(".rk-power-orbit")).toBeNull();
    expect(signal?.querySelector(".rk-power-status")?.tagName.toLowerCase()).toBe("circle");
    expect(signal?.querySelector(".rk-power-orbit")).not.toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});

test("decorative layers isolate SVG ids and disappear without replacing controls or status", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let requests = 0;
  const content = (
    <>
      <Button svgBorder="cut">Save</Button>
      <PowerButton variant="signal" label="VPN" pending onChange={() => requests++} />
      <MotionLayer effect="ripple" active />
    </>
  );
  try {
    await act(() => root.render(<Scope values={{ effects: "expressive", motion: "full" }}>{content}</Scope>));
    const buttons = [...container.querySelectorAll("button")];
    expect(container.querySelectorAll(".rk-motion-layer").length).toBe(3);
    const ids = [...container.querySelectorAll("[id]")].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const layer of container.querySelectorAll(".rk-motion-layer"))
      expect(layer.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".rk-power")?.getAttribute("aria-busy")).toBe("true");
    buttons[1]?.focus();
    await act(() => buttons[1]?.click());
    expect(requests).toBe(1);
    for (const values of [
      { effects: "off" },
      { effects: "expressive", motion: "off" },
      { effects: "expressive", svgShapes: false },
      { effects: "expressive", style: "fluent" },
    ] as const) {
      await act(() => root.render(<Scope values={values}>{content}</Scope>));
      expect(container.querySelectorAll(".rk-motion-layer").length).toBe(0);
      buttons.forEach((button, index) => {
        expect(container.querySelectorAll("button")[index]).toBe(button);
      });
      expect(document.activeElement).toBe(buttons[1] ?? null);
      expect(buttons[1]?.getAttribute("aria-busy")).toBe("true");
      expect(buttons[1]?.getAttribute("aria-pressed")).toBe("true");
      if ("svgShapes" in values || "style" in values)
        expect(container.querySelector(".rk-power-dial")).toBeNull();
    }
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("theme transitions commit once, honor effects/motion/reduced-motion, and degrade without the browser API", () => {
  const original = Object.getOwnPropertyDescriptor(document, "startViewTransition");
  const media = Object.getOwnPropertyDescriptor(globalThis, "matchMedia");
  let calls = 0;
  let updates = 0;
  let reduced = false;
  const types = new Set<string>();
  const canvas = document.createElement("div");
  canvas.className = "rk-svg-backdrop";
  document.body.append(canvas);
  try {
    Object.defineProperty(globalThis, "matchMedia", {
      configurable: true,
      value: () => ({ matches: reduced }),
    });
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: (commit: () => void) => {
        calls++;
        commit();
        return {
          types,
          skipTransition: () => undefined,
          ready: Promise.resolve(),
          finished: Promise.resolve(),
          updateCallbackDone: Promise.resolve(),
        };
      },
    });
    const update = () => {
      updates++;
    };
    startThemeTransition(update, { effects: "off" });
    startThemeTransition(update, { effects: "expressive", motion: "off" });
    reduced = true;
    startThemeTransition(update, { effects: "expressive", motion: "full" });
    expect(calls).toBe(0);
    reduced = false;
    startThemeTransition(update, { effects: "expressive", themeTransition: "iris" });
    expect(types.has("rk-iris")).toBe(true);
    expect(document.documentElement.style.viewTransitionName).toBe("none");
    expect(canvas.style.viewTransitionName).toContain("rk-canvas-");
    cancelThemeTransition();
    expect(canvas.style.viewTransitionName).toBe("");
    types.clear();
    startThemeTransition(update, { effects: "subtle", themeTransition: "wipe", svgShapes: false });
    expect(types.has("rk-fade")).toBe(true);
    Object.defineProperty(document, "startViewTransition", { configurable: true, value: undefined });
    startThemeTransition(update, { effects: "expressive" });
    expect(calls).toBe(2);
    expect(updates).toBe(6);
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: () => {
        throw new Error("Unavailable compositor");
      },
    });
    startThemeTransition(update, { effects: "expressive" });
    expect(updates).toBe(7);
    expect(canvas.style.viewTransitionName).toBe("");
    expect(document.documentElement.hasAttribute("data-rk-theme-transition")).toBe(false);
  } finally {
    canvas.remove();
    if (original) Object.defineProperty(document, "startViewTransition", original);
    else Reflect.deleteProperty(document, "startViewTransition");
    if (media) Object.defineProperty(globalThis, "matchMedia", media);
    else Reflect.deleteProperty(globalThis, "matchMedia");
  }
});
