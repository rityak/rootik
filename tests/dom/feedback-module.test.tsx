import { expect, test } from "bun:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { Callout as LegacyCallout, EmptyState as LegacyEmpty } from "../../src/components/card";
import { Badge as LegacyBadge } from "../../src/components/display";
import { Progress as LegacyProgress } from "../../src/components/progress";
import {
  Badge,
  BusyOverlay,
  Callout,
  DataState,
  EmptyState,
  Meter,
  Progress,
  ProgressRing,
} from "../../src/feedback/index";
import { Progress as RootProgress } from "../../src/index";
import { Scope } from "../../src/theme/provider";

test("feedback entry preserves legacy and root component identities", () => {
  expect(Progress).toBe(LegacyProgress);
  expect(Progress).toBe(RootProgress);
  expect(Badge).toBe(LegacyBadge);
  expect(Callout).toBe(LegacyCallout);
  expect(EmptyState).toBe(LegacyEmpty);
});

test("progress exposes the same bounded finite value that it draws and names React labels", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(() =>
      root.render(
        <Progress value={150} label={<strong>Processed files</strong>} showValue decoration="segments" />,
      ),
    );
    const bar = container.querySelector('[role="progressbar"]');
    expect(bar?.getAttribute("aria-valuenow")).toBe("100");
    expect(container.querySelector<HTMLElement>(".rk-progress-bar")?.style.width).toBe("100%");
    expect(document.getElementById(bar?.getAttribute("aria-labelledby") ?? "")?.textContent).toBe(
      "Processed files",
    );
    await act(() => root.render(<Progress value={Number.NaN} max={-2} aria-label="Work" />));
    expect(bar?.getAttribute("aria-valuenow")).toBe("0");
    expect(bar?.getAttribute("aria-valuemax")).toBe("100");
    await act(() => root.render(<Progress aria-label="Waiting" animation="off" />));
    expect(bar?.hasAttribute("aria-valuenow")).toBe(false);
    expect(bar?.getAttribute("data-indeterminate")).toBe("true");
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("segmented rings isolate mask IDs and fall back without invalid SVG geometry", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const render = (svgShapes: boolean) =>
    root.render(
      <Scope values={{ svgShapes }}>
        <ProgressRing value={500} size={0} thickness={100} variant="segmented" aria-label="One" />
        <ProgressRing value={32} variant="segmented" aria-label="Two" />
      </Scope>,
    );
  try {
    await act(() => render(true));
    const masks = [...container.querySelectorAll("mask")];
    expect(masks.length).toBe(2);
    expect(new Set(masks.map((node) => node.id)).size).toBe(2);
    expect(container.querySelector('[aria-label="One"]')?.getAttribute("aria-valuenow")).toBe("100");
    for (const circle of container.querySelectorAll("circle"))
      expect(Number(circle.getAttribute("r"))).toBeGreaterThan(0);
    const label = container.querySelector(".rk-ring-label");
    await act(() => render(false));
    expect(container.querySelector("mask")).toBeNull();
    expect(container.querySelector(".rk-ring-label") === label).toBe(true);
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("meters keep sections inside their range and assign explicit labels to the meter", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(() =>
      root.render(
        <Meter
          aria-label="Storage categories"
          sections={[{ value: 20 }, { value: 200 }, { value: -50 }, { value: Number.NaN }]}
          decoration="ticks"
        />,
      ),
    );
    const meter = container.querySelector('[role="meter"]');
    expect(meter?.getAttribute("aria-label")).toBe("Storage categories");
    expect(meter?.getAttribute("aria-valuenow")).toBe("100");
    expect(
      [...container.querySelectorAll<HTMLElement>(".rk-meter-bar")].map((node) => node.style.width),
    ).toEqual(["20%", "80%", "0%", "0%"]);
    await act(() =>
      root.render(<Meter min={10} max={110} sections={[{ value: 20 }]} label={<em>Capacity</em>} />),
    );
    expect(meter?.getAttribute("aria-valuenow")).toBe("30");
    expect(document.getElementById(meter?.getAttribute("aria-labelledby") ?? "")?.textContent).toBe(
      "Capacity",
    );
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("busy content, badge actions and message actions keep their nodes across appearance changes", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let removes = 0,
    dismisses = 0;
  const render = (busy: boolean, svgShapes: boolean) =>
    root.render(
      <Scope values={{ svgShapes }}>
        <BusyOverlay busy={busy} svgBorder="ticket">
          <input aria-label="Profile" defaultValue="North" />
        </BusyOverlay>
        <Badge
          svgBorder="cut"
          onRemove={() => {
            removes++;
          }}
          removeLabel="Remove profile"
        >
          Profile
        </Badge>
        <Callout
          surface={{ shape: "bevel" }}
          title="Warning"
          onDismiss={() => {
            dismisses++;
          }}
        >
          Review routing
        </Callout>
      </Scope>,
    );
  try {
    await act(() => render(false, true));
    const input = container.querySelector<HTMLInputElement>("input");
    const remove = container.querySelector<HTMLButtonElement>(".rk-badge-remove");
    const dismiss = container.querySelector<HTMLButtonElement>(".rk-callout-close");
    if (!input || !remove || !dismiss) throw new Error("Missing feedback controls");
    input.value = "Edited";
    await act(() => render(true, false));
    expect(container.querySelector("input") === input).toBe(true);
    expect(input.value).toBe("Edited");
    expect(container.querySelector(".rk-busy-content")?.hasAttribute("inert")).toBe(true);
    expect(container.querySelector(".rk-badge-remove") === remove).toBe(true);
    expect(container.querySelector(".rk-callout-close") === dismiss).toBe(true);
    expect(container.querySelector(".rk-svg-control-frame")).toBeNull();
    await act(() => {
      remove.click();
      dismiss.click();
    });
    expect(removes).toBe(1);
    expect(dismisses).toBe(1);
    await act(() => render(false, true));
    expect(container.querySelector(".rk-busy-content")?.hasAttribute("inert")).toBe(false);
    expect(container.querySelector("input") === input).toBe(true);
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("data states defer content until ready and keep retry owned by the caller", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let reads = 0,
    retries = 0;
  const render = (status: "loading" | "error" | "ready") =>
    root.render(
      <DataState
        status={status}
        error="Offline"
        surface={{ shape: "ticket" }}
        svgBorder="cut"
        onRetry={() => {
          retries++;
        }}
      >
        {() => {
          reads++;
          return "Ready content";
        }}
      </DataState>,
    );
  try {
    await act(() => render("loading"));
    expect(reads).toBe(0);
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
    await act(() => render("error"));
    await act(() => container.querySelector<HTMLButtonElement>(".rk-button")?.click());
    expect(retries).toBe(1);
    expect(reads).toBe(0);
    await act(() => render("ready"));
    expect(reads).toBe(1);
    expect(container.textContent).toBe("Ready content");
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});
