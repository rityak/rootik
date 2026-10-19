import { expect, test } from "bun:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { SelectPanel } from "../../src/data/select-panel";
import { FloatingWindow } from "../../src/layout/floating-window";
import { Splitter } from "../../src/layout/splitter";
import { Stepper } from "../../src/navigation/stepper";
import { Tour } from "../../src/overlays/tour";
import { Scope } from "../../src/theme/provider";

function mount() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  return {
    container,
    root,
    dispose: async () => {
      await act(() => root.unmount());
      container.remove();
    },
  };
}

test("floating windows stay inside a resized visual viewport without remounting their fields", async () => {
  const { container, root, dispose } = mount();
  const saved = Object.getOwnPropertyDescriptor(window, "visualViewport");
  const viewport = Object.assign(new EventTarget(), { width: 320, height: 240, offsetLeft: 0, offsetTop: 0 });
  Object.defineProperty(window, "visualViewport", { configurable: true, value: viewport });
  try {
    await act(() =>
      root.render(
        <FloatingWindow title="Inspector" defaultPosition={{ x: 900, y: 900 }}>
          <input defaultValue="Retained" />
        </FloatingWindow>,
      ),
    );
    const panel = container.querySelector<HTMLElement>(".rk-floating-window");
    const input = container.querySelector("input");
    expect(panel?.style.left).toBe("8px");
    expect(panel?.style.top).toBe("8px");
    expect(panel?.style.getPropertyValue("--rk-floating-max-w")).toBe("304px");
    await act(() => input?.focus());
    viewport.width = 240;
    viewport.height = 180;
    viewport.offsetTop = 60;
    await act(() => {
      viewport.dispatchEvent(new Event("resize"));
    });
    expect(panel?.style.left).toBe("8px");
    expect(panel?.style.top).toBe("68px");
    expect(panel?.style.getPropertyValue("--rk-floating-max-h")).toBe("164px");
    expect(container.querySelector("input") === input).toBe(true);
    expect(document.activeElement === input).toBe(true);
    expect(input?.value).toBe("Retained");
  } finally {
    await dispose();
    if (saved) Object.defineProperty(window, "visualViewport", saved);
    else Reflect.deleteProperty(window, "visualViewport");
  }
});

test("floating surfaces preserve the native window, position, field and composed Escape handler", async () => {
  const { container, root, dispose } = mount();
  let closed = 0;
  const render = (svgShapes: boolean, style: "rootik" | "fluent" = "rootik") =>
    root.render(
      <Scope values={{ svgShapes, style, effects: "subtle" }}>
        <FloatingWindow
          title="Inspector"
          surface={{ shape: "bevel", padding: 20 }}
          onClose={() => closed++}
          onKeyDown={(event) => {
            if (event.key === "Escape") event.preventDefault();
          }}
        >
          <input aria-label="Window field" defaultValue="Retained" />
        </FloatingWindow>
      </Scope>,
    );
  try {
    await act(() => render(true));
    const panel = container.querySelector<HTMLElement>(".rk-floating-window");
    const input = container.querySelector("input");
    const title = container.querySelector(".rk-floating-window-title");
    await act(() => title?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
    expect(panel?.style.left).toBe("96px");
    await act(() =>
      panel?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })),
    );
    expect(closed).toBe(0);
    await act(() => input?.focus());
    await act(() => render(false));
    expect(container.querySelector("input") === input).toBe(true);
    expect(document.activeElement === input).toBe(true);
    expect(panel?.style.left).toBe("96px");
    expect(panel?.querySelectorAll(".rk-svg-surface-frame").length).toBe(0);
    await act(() => render(true, "fluent"));
    expect(panel?.querySelector(".rk-overlay-surface")?.hasAttribute("data-flat")).toBe(true);
    expect(input?.value).toBe("Retained");
  } finally {
    await dispose();
  }
});

test("splitter grip is decorative and preserves the separator and keyboard sizing across SVG Off", async () => {
  const { container, root, dispose } = mount();
  const render = (svgShapes: boolean) =>
    root.render(
      <Scope values={{ svgShapes }}>
        <Splitter grip handleLabel="Resize preview">
          {[<input key="field" defaultValue="Value" />, <p key="preview">Preview</p>]}
        </Splitter>
      </Scope>,
    );
  try {
    await act(() => render(true));
    const handle = container.querySelector<HTMLElement>('[role="separator"]');
    const input = container.querySelector("input");
    await act(() => handle?.focus());
    await act(() =>
      handle?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })),
    );
    expect(handle?.getAttribute("aria-valuenow")).toBe("52");
    expect(handle?.querySelector(".rk-splitter-grip")).not.toBeNull();
    await act(() => render(false));
    expect(container.querySelector('[role="separator"]') === handle).toBe(true);
    expect(document.activeElement === handle).toBe(true);
    expect(handle?.querySelector(".rk-splitter-grip")).toBeNull();
    expect(container.querySelector("input") === input).toBe(true);
    expect(container.querySelector(".rk-splitter")?.hasAttribute("data-grip")).toBe(true);
  } finally {
    await dispose();
  }
});

test("stepper selection retains its button focus and semantic state when SVG decoration changes", async () => {
  const { container, root, dispose } = mount();
  let current = 1;
  const render = (svgShapes: boolean) =>
    root.render(
      <Scope values={{ svgShapes, effects: "subtle" }}>
        <Stepper
          svgBorder="cut"
          current={current}
          linear={false}
          onStepClick={(index) => {
            current = index;
            render(true);
          }}
          steps={[
            { id: "one", label: "One" },
            { id: "two", label: "Two" },
            { id: "three", label: "Three", disabled: true },
          ]}
        />
      </Scope>,
    );
  try {
    await act(() => render(true));
    const button = container.querySelector<HTMLButtonElement>("button");
    await act(() => button?.focus());
    await act(() => button?.click());
    expect(current).toBe(0);
    expect(container.querySelector("button") === button).toBe(true);
    expect(document.activeElement === button).toBe(true);
    expect(button?.closest("li")?.getAttribute("aria-current")).toBe("step");
    expect(container.querySelectorAll(".rk-svg-control-frame").length).toBe(3);
    expect(container.querySelectorAll("button").length).toBe(2);
    await act(() => render(false));
    expect(container.querySelector("button") === button).toBe(true);
    expect(container.querySelectorAll(".rk-svg-control-frame").length).toBe(0);
  } finally {
    await dispose();
  }
});

test("select panel keeps deferred choices through material changes and commits only on Apply", async () => {
  const { container, root, dispose } = mount();
  let selected: string[] = [];
  const render = (svgShapes: boolean) =>
    root.render(
      <Scope values={{ svgShapes }}>
        <SelectPanel
          title="Protocols"
          surface={{ shape: "ticket", padding: 20 }}
          searchable={false}
          deferred
          trigger={<button type="button">Choose protocols</button>}
          options={[
            { value: "one", label: "One" },
            { value: "two", label: "Two" },
          ]}
          onChange={(values) => {
            selected = values;
          }}
        />
      </Scope>,
    );
  try {
    await act(() => render(true));
    await act(() => container.querySelector<HTMLButtonElement>("button")?.click());
    const option = container.querySelector<HTMLElement>('[role="option"]');
    await act(() => option?.click());
    expect(selected).toEqual([]);
    expect(option?.getAttribute("aria-selected")).toBe("true");
    await act(() => render(false));
    expect(container.querySelector('[role="option"]') === option).toBe(true);
    expect(option?.getAttribute("aria-selected")).toBe("true");
    expect(container.querySelector(".rk-overlay-surface")?.hasAttribute("data-flat")).toBe(true);
    await act(() =>
      Array.from(container.querySelectorAll("button"))
        .find((button) => button.textContent === "Apply")
        ?.click(),
    );
    expect(selected).toEqual(["one"]);
  } finally {
    await dispose();
  }
});

test("tour surfaces preserve the dialog and return focus to the launcher on close", async () => {
  const { container, root, dispose } = mount();
  const launcher = document.createElement("button");
  launcher.textContent = "Start tour";
  document.body.append(launcher);
  let chosen = 0;
  const render = (open: boolean, svgShapes: boolean) =>
    root.render(
      <Scope values={{ svgShapes }}>
        <Tour
          steps={[
            { target: () => launcher, title: "Introduction", content: <input defaultValue="Retained" /> },
            { target: () => launcher, title: "Next step" },
          ]}
          step={0}
          onStepChange={(index) => {
            chosen = index;
          }}
          open={open}
          onClose={() => undefined}
          surface={{ shape: "bevel", padding: 24 }}
        />
      </Scope>,
    );
  try {
    await act(() => launcher.focus());
    await act(() => render(true, true));
    const panel = container.querySelector<HTMLElement>('[role="dialog"]');
    const input = panel?.querySelector("input");
    await act(() => input?.focus());
    await act(() => render(true, false));
    await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    await act(() => input?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
    expect(chosen).toBe(0);
    expect(container.querySelector('[role="dialog"]') === panel).toBe(true);
    expect(document.activeElement === input).toBe(true);
    expect(panel?.querySelectorAll(".rk-svg-surface-frame").length).toBe(0);
    await act(() => render(false, false));
    expect(document.activeElement === launcher).toBe(true);
  } finally {
    await dispose();
    launcher.remove();
  }
});
