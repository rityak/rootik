import { expect, test } from "bun:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart,
  ChartPanel,
  Gauge,
  Heatmap,
  LineChart,
  niceTicks,
  seriesColor,
  Tracker,
} from "../../src/charts/index";
import { BarChart as LegacyBar, Gauge as LegacyGauge } from "../../src/components/charts";
import { ChartPanel as RootPanel } from "../../src/index";
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

test("charts entry preserves root and legacy component identities", () => {
  expect(BarChart).toBe(LegacyBar);
  expect(Gauge).toBe(LegacyGauge);
  expect(ChartPanel).toBe(RootPanel);
});

test("tick and categorical helpers stay finite and bounded for degenerate input", () => {
  for (const args of [
    [0, 100, 4],
    [10, 10, 0],
    [Number.NaN, Number.POSITIVE_INFINITY, Number.NaN],
    [9, 1, 8],
    [1e-12, 2e-12, 4],
    [1e20, 1e20 + 1, 4],
  ]) {
    const ticks = niceTicks(args[0] ?? 0, args[1] ?? 1, args[2]);
    expect(ticks.length).toBeGreaterThan(0);
    expect(ticks.length).toBeLessThanOrEqual(104);
    expect(ticks.every(Number.isFinite)).toBe(true);
  }
  expect(niceTicks(0, 10)).toEqual([0, 2.5, 5, 7.5, 10]);
  expect(seriesColor(-2)).toBe("var(--rk-chart-1)");
  expect(seriesColor(Number.NaN)).toBe("var(--rk-chart-1)");
  expect(seriesColor(10)).toBe("var(--rk-chart-6)");
});

test("gauge clamps geometry and exposes the drawn finite value with a React label", async () => {
  const { container, root, dispose } = mount();
  try {
    await act(() =>
      root.render(
        <Gauge value={500} min={0} max={100} segments={1} size={0} label={<strong>Capacity</strong>} />,
      ),
    );
    const meter = container.querySelector('[role="meter"]');
    expect(meter?.getAttribute("aria-valuenow")).toBe("100");
    expect(container.querySelectorAll("svg line").length).toBe(2);
    expect(container.innerHTML.includes("NaN")).toBe(false);
    expect(document.getElementById(meter?.getAttribute("aria-labelledby") ?? "")?.textContent).toBe(
      "Capacity",
    );
    await act(() =>
      root.render(<Gauge value={Number.NaN} min={10} max={-5} segments={Number.POSITIVE_INFINITY} />),
    );
    expect(meter?.getAttribute("aria-valuenow")).toBe("10");
    expect(meter?.getAttribute("aria-valuemax")).toBe("110");
  } finally {
    await dispose();
  }
});

test("chart decoration and replay keep table state, native children and focus mounted", async () => {
  const { container, root, dispose } = mount();
  let changes = 0;
  const render = (svgShapes: boolean, revision: number, motion: "full" | "off" = "full") =>
    root.render(
      <Scope values={{ svgShapes, motion, effects: "expressive" }}>
        <ChartPanel
          title="Traffic"
          description="Last day"
          shape="saddle"
          animation="once"
          revision={revision}
        >
          <input aria-label="Query" onChange={() => changes++} />
          <BarChart data={[{ label: "North", value: 42 }]} tableView aria-label="Routes" />
        </ChartPanel>
      </Scope>,
    );
  try {
    await act(() => render(true, 0));
    const input = container.querySelector("input");
    const toggle = container.querySelector<HTMLButtonElement>('[aria-label="Show as table"]');
    await act(() => toggle?.click());
    expect(container.querySelector("table")).not.toBeNull();
    await act(() => input?.focus());
    if (input) input.value = "Retained";
    await act(() => render(false, 1));
    expect(container.querySelector("input") === input).toBe(true);
    expect(document.activeElement === input).toBe(true);
    expect(input?.value).toBe("Retained");
    expect(container.querySelector("table")).not.toBeNull();
    expect(container.querySelector(".rk-chart-panel")?.getAttribute("data-animation")).toBe("off");
    expect(
      container.querySelectorAll(".rk-svg-surface-frame,.rk-chart-panel-body > .rk-motion-layer").length,
    ).toBe(0);
    await act(() => render(true, 2, "off"));
    expect(container.querySelector(".rk-chart-panel")?.getAttribute("data-animation")).toBe("off");
    expect(changes).toBe(0);
  } finally {
    await dispose();
  }
});

test("heatmap treats absent and non-finite values as no data in grid and table", async () => {
  const { container, root, dispose } = mount();
  try {
    await act(() =>
      root.render(
        <Heatmap
          rows={["North", "South"]}
          columns={["Now", "Next"]}
          values={[[Number.NaN, 42], []]}
          showValues
        />,
      ),
    );
    expect(container.querySelectorAll("[data-empty]").length).toBe(3);
    expect(container.innerHTML.includes("NaN")).toBe(false);
    const first = container.querySelector<HTMLElement>('[data-cell="0:0"]');
    await act(() => first?.focus());
    await act(() => first?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
    expect(document.activeElement === container.querySelector('[data-cell="0:1"]')).toBe(true);
    await act(() => container.querySelector<HTMLButtonElement>('[aria-label="Show as table"]')?.click());
    expect(container.querySelector("table")?.textContent?.includes("42")).toBe(true);
    expect(container.querySelector("table")?.textContent?.match(/No data/g)?.length).toBe(3);
  } finally {
    await dispose();
  }
});

test("tracker retains a keyboard tab stop when the history shrinks", async () => {
  const { container, root, dispose } = mount();
  try {
    await act(() =>
      root.render(<Tracker items={Array.from({ length: 30 }, (_, i) => ({ label: String(i) }))} />),
    );
    await act(() => root.render(<Tracker items={[{ label: "Today" }, { label: "Yesterday" }]} />));
    const item = container.querySelector<HTMLElement>('[tabindex="0"]');
    expect(item?.textContent).toBe("");
    expect(item?.getAttribute("aria-label")).toBe("Yesterday");
    await act(() => item?.focus());
    await act(() => item?.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true })));
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Today");
  } finally {
    await dispose();
  }
});

test("chart measurement reconnects after switching from a resized table to its SVG", async () => {
  const NativeObserver = globalThis.ResizeObserver;
  const observations: {
    target: Element;
    callback: ResizeObserverCallback;
    observer: ResizeObserver;
    active: boolean;
  }[] = [];
  globalThis.ResizeObserver = class extends NativeObserver {
    callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
      super(callback);
      this.callback = callback;
    }
    override observe(target: Element) {
      observations.push({ target, callback: this.callback, observer: this, active: true });
    }
    override disconnect() {
      for (const observation of observations) if (observation.observer === this) observation.active = false;
    }
  };
  const { container, root, dispose } = mount();
  const measure = async (width: number) =>
    act(() => {
      for (const observation of observations.filter((entry) => entry.active))
        observation.callback(
          [{ contentRect: { width, height: 200 } } as ResizeObserverEntry],
          observation.observer,
        );
    });
  try {
    await act(() => root.render(<BarChart data={[{ label: "North", value: 42 }]} tableView />));
    const chart = container.querySelector(".rk-chart");
    await measure(320);
    expect(container.querySelector(".rk-chart svg")?.getAttribute("width")).toBe("320");
    await act(() => container.querySelector<HTMLButtonElement>('[aria-label="Show as table"]')?.click());
    expect(observations.some((entry) => entry.target === chart && entry.active)).toBe(false);
    await act(() => container.querySelector<HTMLButtonElement>('[aria-label="Show as chart"]')?.click());
    await measure(480);
    expect(container.querySelector(".rk-chart svg")?.getAttribute("width")).toBe("480");
    await act(() => root.render(<LineChart series={[{ name: "Missing", data: [null, null] }]} area />));
    await measure(480);
    expect(container.innerHTML.includes("NaN") || container.innerHTML.includes("Infinity")).toBe(false);
    expect(container.querySelectorAll('.rk-chart svg path[opacity="0.1"]').length).toBe(0);
  } finally {
    await dispose();
    globalThis.ResizeObserver = NativeObserver;
  }
});
