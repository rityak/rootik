import { expect, test } from "bun:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { Button, IconButton } from "../../src/components/button";
import { Input } from "../../src/components/input";
import { AppShell as LegacyAppShell } from "../../src/components/layout";
import { Dock } from "../../src/components/nav";
import { SvgSurface as LegacySurface } from "../../src/components/svg-surface";
import { AppShell, ResizablePanel, SvgBackdrop, SvgSurface, Toolbar } from "../../src/layout/index";
import { Scope, useAppearanceValue } from "../../src/theme/provider";

function PaletteProbe() {
  return (
    <output>
      {useAppearanceValue("palette")}/{useAppearanceValue("colorMode")}/{useAppearanceValue("font")}
    </output>
  );
}

test("layout module retains compatibility, isolated appearance, shaped islands and native interactions", async () => {
  expect(AppShell).toBe(LegacyAppShell);
  expect(SvgSurface).toBe(LegacySurface);
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let clicks = 0;
  try {
    await act(() =>
      root.render(
        <>
          <Scope values={{ palette: "maomao", colorMode: "light", font: "rubik" }}>
            <AppShell
              surface={{ shape: "bevel", padding: 12 }}
              backdrop={<SvgBackdrop pattern="stripes" />}
              sidebar={<nav>Navigation</nav>}
              header={<span>Header</span>}
              footer={<span>Footer</span>}
            >
              <PaletteProbe />
              <Toolbar>
                <button type="button" onClick={() => clicks++}>
                  Apply
                </button>
                <button type="button">Reset</button>
              </Toolbar>
              <ResizablePanel defaultSize={260}>
                <input aria-label="Name" defaultValue="Москва" />
              </ResizablePanel>
            </AppShell>
          </Scope>
          <Scope values={{ palette: "albedo", colorMode: "dark", font: "onest" }}>
            <AppShell
              variant="inset"
              dockPlacement="bar"
              dock={<Dock items={[{ value: "one", label: "One", icon: "1" }]} value="one" />}
              surface={{ shape: "ticket" }}
              aside={<span>Inspector</span>}
            >
              <PaletteProbe />
            </AppShell>
          </Scope>
        </>,
      ),
    );
    expect([...container.querySelectorAll("output")].map((el) => el.textContent)).toEqual([
      "maomao/light/rubik",
      "albedo/dark/onest",
    ]);
    const shells = container.querySelectorAll(".rk-shell");
    expect(shells[0]?.querySelectorAll(".rk-svg-surface")).toHaveLength(3);
    expect(shells[1]?.querySelectorAll(".rk-svg-surface")).toHaveLength(0);
    expect(shells[1]?.querySelector(".rk-shell-dockbar .rk-dock")?.getAttribute("data-shape")).toBe("bar");
    expect(shells[0]?.querySelector(".rk-shell-backdrop")?.getAttribute("aria-hidden")).toBe("true");
    expect(shells[0]?.querySelector(".rk-shell-header .rk-svg-surface-content")?.textContent).toBe("Header");
    const controls = container.querySelectorAll<HTMLButtonElement>('[role="toolbar"] button');
    const apply = controls[0],
      reset = controls[1];
    if (!apply || !reset) throw new Error("Missing toolbar controls");
    await act(() => apply.click());
    expect(clicks).toBe(1);
    apply.focus();
    await act(() => apply.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
    expect(document.activeElement).toBe(reset);
    const separator = container.querySelector<HTMLElement>('[role="separator"]');
    if (!separator) throw new Error("Missing resize handle");
    await act(() =>
      separator.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", shiftKey: true, bubbles: true }),
      ),
    );
    expect(separator.getAttribute("aria-valuenow")).toBe("308");
    const ids = [...container.querySelectorAll("[id]")].map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    const skip = shells[0]?.querySelector<HTMLAnchorElement>(".rk-skip");
    expect(skip?.hash).toBe(`#${shells[0]?.querySelector("main")?.id}`);
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("appearance removes SVG dents from surfaces, buttons, inputs and icon buttons without losing content", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    for (const values of [{ svgShapes: false }, { style: "fluent" }] as const) {
      await act(() =>
        root.render(
          <Scope values={values}>
            <SvgSurface shape="saddle" padding={24}>
              <Button svgBorder="notch">Apply</Button>
              <Input svgBorder="ticket" aria-label="Name" defaultValue="Москва" />
              <IconButton svgBorder="cut" icon="+" label="Add" tooltip={false} />
            </SvgSurface>
            <Scope values={{ svgShapes: true, style: "rootik" }}>
              <Button svgBorder="cut">Nested contour</Button>
            </Scope>
          </Scope>,
        ),
      );
      const surface = container.querySelector(".rk-svg-surface");
      expect(surface?.hasAttribute("data-flat")).toBe(true);
      expect(surface?.querySelectorAll("svg")).toHaveLength(0);
      expect(surface?.querySelectorAll("[data-svg-border]")).toHaveLength(0);
      expect(surface?.querySelector("input")?.value).toBe("Москва");
      expect(surface?.querySelector<HTMLElement>(".rk-svg-surface-content")?.style.padding).toContain(
        "--rk-svg-pad-top",
      );
      expect(container.querySelectorAll(".rk-svg-control-frame")).toHaveLength(1);
    }
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("capsule dock omits the shell contour while preserving other panels and navigation", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let selection = "one";
  try {
    for (const override of [undefined, "surface", "capsule"] as const) {
      await act(() =>
        root.render(
          <Scope values={{ dockShape: "capsule" }}>
            <AppShell
              surface={{ shape: "wave", padding: 20 }}
              dockShape={override}
              header="Header"
              dock={
                <Dock
                  value="one"
                  onChange={(value) => {
                    selection = value;
                  }}
                  items={[
                    { value: "one", label: "One", icon: "1" },
                    { value: "two", label: "Two", icon: "2" },
                  ]}
                />
              }
            >
              Content
            </AppShell>
          </Scope>,
        ),
      );
      expect(container.querySelector(".rk-shell-header .rk-svg-surface-frame")).not.toBeNull();
      expect(Boolean(container.querySelector(".rk-shell-dock .rk-svg-surface"))).toBe(override === "surface");
      const item = container.querySelector<HTMLButtonElement>('.rk-dock-item[data-value="two"]');
      if (!item) throw new Error("Missing dock item");
      selection = "one";
      await act(() => item.click());
      expect(selection).toBe("two");
    }
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});
