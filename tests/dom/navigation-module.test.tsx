import { expect, test } from "bun:test";
import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { SegmentedControl as LegacySegmented } from "../../src/components/choice";
import { Menu as LegacyMenu } from "../../src/components/menu";
import { Dock as LegacyDock, Tabs as LegacyTabs } from "../../src/components/nav";
import {
  Dock,
  Menu,
  MenuCheckboxItem,
  MenuItem,
  NavItem,
  SegmentedControl,
  TabPanel,
  Tabs,
} from "../../src/navigation/index";
import { Scope } from "../../src/theme/provider";

const items = [
  { value: "locked", label: "Locked", disabled: true },
  { value: "one", label: "One" },
  { value: "two", label: "Two" },
];

test("vertical shaped tabs reserve the contour for selection and retain native keyboard focus", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const render = (svgShapes: boolean) =>
    root.render(
      <Scope values={{ svgShapes }}>
        <Tabs orientation="vertical" variant="pill" svgBorder="ticket" items={items} aria-label="Settings" />
      </Scope>,
    );
  try {
    await act(() => render(true));
    const buttons = [...container.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    expect(container.querySelectorAll(".rk-tab .rk-svg-control-frame").length).toBe(1);
    const first = buttons[1];
    if (!first) throw new Error("Missing enabled tab");
    await act(() => first.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })));
    expect(buttons[2]?.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement === buttons[2]).toBe(true);
    expect(container.querySelectorAll(".rk-tab .rk-svg-control-frame").length).toBe(1);
    await act(() => render(false));
    expect(container.querySelector(".rk-svg-control-frame")).toBeNull();
    expect(container.querySelectorAll('[role="tab"]')[2] === buttons[2]).toBe(true);
    expect(document.activeElement === buttons[2]).toBe(true);
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

function NavigationHarness({ removed = false }: { removed?: boolean }) {
  const [selected, setSelected] = useState("one");
  const [checked, setChecked] = useState(false);
  return (
    <>
      <Tabs
        variant="pill"
        svgBorder="cut"
        aria-label="Sections"
        idPrefix="navigation-test"
        items={items}
        value={selected}
        onChange={setSelected}
      />
      <TabPanel idPrefix="navigation-test" value={selected}>
        {selected}
      </TabPanel>
      <SegmentedControl svgBorder="notch" aria-label="View" options={items} />
      <NavItem svgBorder="ticket" href="https://example.invalid" label="Disabled link" disabled />
      <Dock
        mode="tabs"
        aria-label="Dock tabs"
        value="one"
        items={(removed ? items.slice(2) : items.slice(1)).map((item) => ({ ...item, icon: item.label }))}
      />
      <Menu trigger={<button type="button">Actions</button>}>
        <MenuItem>Apply</MenuItem>
        <MenuItem disabled>Locked action</MenuItem>
        <MenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
          Pinned
        </MenuCheckboxItem>
      </Menu>
    </>
  );
}

test("navigation exports retain identities and native keyboard, disabled, selection and focus contracts", async () => {
  expect(Tabs).toBe(LegacyTabs);
  expect(Dock).toBe(LegacyDock);
  expect(Menu).toBe(LegacyMenu);
  expect(SegmentedControl).toBe(LegacySegmented);
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(() => root.render(<NavigationHarness />));
    const first = container.querySelector<HTMLButtonElement>('.rk-tab[data-value="one"]');
    if (!first) throw new Error("Missing initial tab");
    first.focus();
    await act(() => first.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })));
    expect(container.querySelector('[role="tabpanel"]')?.textContent).toBe("two");
    expect(document.activeElement?.getAttribute("aria-controls")).toBe(
      container.querySelector('[role="tabpanel"]')?.id ?? "",
    );
    expect(container.querySelector<HTMLInputElement>(".rk-segmented input:checked")?.value).toBe("one");
    const disabled = container.querySelector<HTMLElement>('.rk-nav-link[aria-disabled="true"]');
    if (!disabled) throw new Error("Missing disabled link");
    expect(disabled.hasAttribute("href")).toBe(false);
    expect(disabled.tabIndex).toBe(-1);
    expect(disabled.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }))).toBe(false);
    const dockTab = container.querySelector<HTMLButtonElement>('.rk-dock-item[data-value="one"]');
    if (!dockTab) throw new Error("Missing dock tab");
    dockTab.focus();
    await act(() => root.render(<NavigationHarness removed />));
    expect(document.activeElement?.getAttribute("data-value")).toBe("two");
    expect(document.activeElement?.classList.contains("rk-dock-item")).toBe(true);
    const trigger = container.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]');
    if (!trigger) throw new Error("Missing menu trigger");
    await act(async () => {
      trigger.click();
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    const menu = container.querySelector<HTMLElement>('[role="menu"]');
    if (!menu) throw new Error("Missing menu");
    expect(menu.hasAttribute("data-test-popover")).toBe(true);
    const checkbox = menu.querySelector<HTMLElement>('[role="menuitemcheckbox"]');
    if (!checkbox) throw new Error("Missing menu checkbox");
    await act(() => menu.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })));
    expect(document.activeElement).toBe(checkbox);
    await act(() => checkbox.click());
    expect(checkbox.getAttribute("aria-checked")).toBe("true");
    expect(menu.hasAttribute("data-test-popover")).toBe(true);
    const apply = menu.querySelector<HTMLButtonElement>('[role="menuitem"]');
    if (!apply) throw new Error("Missing menu action");
    await act(() => apply.click());
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("SVG navigation toggles preserve native controls, selection and ARIA links", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    const render = (svgShapes: boolean, style: "rootik" | "fluent" = "rootik") =>
      root.render(
        <Scope values={{ svgShapes, style }}>
          <NavigationHarness />
        </Scope>,
      );
    await act(() => render(true));
    const tab = container.querySelector<HTMLButtonElement>('.rk-tab[data-value="one"]');
    if (!tab) throw new Error("Missing SVG tab");
    expect(container.querySelectorAll(".rk-svg-control-frame").length).toBeGreaterThan(0);
    await act(() => tab.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })));
    for (const [enabled, style] of [
      [false, "rootik"],
      [true, "fluent"],
      [true, "rootik"],
    ] as const) {
      await act(() => render(enabled, style));
      expect(container.querySelector('.rk-tab[data-value="one"]')).toBe(tab);
      expect(container.querySelector('[role="tabpanel"]')?.textContent).toBe("two");
      expect(container.querySelectorAll(".rk-svg-control-frame").length > 0).toBe(
        enabled && style === "rootik",
      );
      expect(container.querySelector('.rk-tab[aria-selected="true"]')?.getAttribute("aria-controls")).toBe(
        container.querySelector('[role="tabpanel"]')?.id ?? "",
      );
    }
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});
