import { expect, test } from "bun:test";
import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { DataTable as LegacyTable } from "../../src/components/data";
import { ItemGroup as LegacyList } from "../../src/components/item";
import { Tree as LegacyTree } from "../../src/components/tree";
import {
  DataTable,
  ItemGroup,
  Scroller,
  SelectionBar,
  SortableList,
  Tree,
  useSelection,
  useVirtual,
} from "../../src/data/index";
import {
  DataTable as RootTable,
  Tree as RootTree,
  useSelection as rootSelection,
  useVirtual as rootVirtual,
} from "../../src/index";
import { Scope } from "../../src/theme/provider";

test("data entry preserves root, legacy and hook identities", () => {
  expect(DataTable).toBe(RootTable);
  expect(Tree).toBe(RootTree);
  expect(useSelection).toBe(rootSelection);
  expect(useVirtual).toBe(rootVirtual);
  expect(LegacyTable).toBe(DataTable);
  expect(LegacyList).toBe(ItemGroup);
  expect(LegacyTree).toBe(Tree);
});

test("table sorting, selection and native content survive SVG and material changes", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const render = (svgShapes: boolean, style: "rootik" | "fluent" = "rootik") =>
    root.render(
      <Scope values={{ svgShapes, style, effects: "expressive", motion: "full" }}>
        <DataTable
          aria-label="Gateways"
          surface={{ shape: "ticket" }}
          columns={[{ key: "name", header: "Name", sortable: true }]}
          rows={[{ name: "Tokyo" }, { name: "Berlin" }]}
          rowKey={(row) => row.name}
          selection="multiple"
          pinFirstColumn
        />
      </Scope>,
    );
  try {
    await act(() => render(true));
    const sort = container.querySelector<HTMLButtonElement>(".rk-th-sort");
    if (!sort) throw new Error("Missing sort control");
    await act(() => sort.click());
    expect(container.querySelector("tbody tr")?.getAttribute("data-key")).toBe("Berlin");
    expect(container.querySelector("th[data-col]")?.getAttribute("aria-sort")).toBe("ascending");
    const row = container.querySelector<HTMLTableRowElement>('tr[data-key="Berlin"]');
    if (!row) throw new Error("Missing row");
    await act(() => row.click());
    expect(row.getAttribute("aria-selected")).toBe("true");
    const wrap = container.querySelector<HTMLDivElement>(".rk-table-wrap");
    if (!wrap) throw new Error("Missing scroll viewport");
    wrap.scrollLeft = 87;
    sort.focus();
    await act(() => render(false));
    expect(container.querySelector('tr[data-key="Berlin"]') === row).toBe(true);
    expect(container.querySelector(".rk-th-sort") === sort).toBe(true);
    expect(document.activeElement === sort).toBe(true);
    expect(wrap.scrollLeft).toBe(87);
    expect(row.getAttribute("aria-selected")).toBe("true");
    expect(container.querySelector(".rk-svg-surface-frame")).toBeNull();
    expect(container.querySelector(".rk-motion-layer")).toBeNull();
    await act(() => render(true, "fluent"));
    expect(container.querySelector(".rk-svg-surface-frame")).toBeNull();
    expect(container.querySelector("tbody tr") === row).toBe(true);
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("tree keyboard checks leaves, skips disabled nodes and filters with ancestors", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let checked: string[] = [];
  const items = [
    {
      id: "asia",
      label: "Asia",
      children: [
        { id: "tokyo", label: "Tokyo" },
        { id: "locked", label: "Locked", disabled: true },
      ],
    },
  ];
  const render = (filter = "") =>
    root.render(
      <Tree
        aria-label="Regions"
        items={items}
        checkable
        defaultChecked={["locked"]}
        filter={filter}
        onCheckedChange={(keys) => {
          checked = keys;
        }}
      />,
    );
  try {
    await act(() => render());
    const parent = container.querySelector<HTMLElement>('[data-id="asia"]');
    if (!parent) throw new Error("Missing tree parent");
    await act(() => parent.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
    expect(container.querySelectorAll('[role="treeitem"]').length).toBe(3);
    await act(() => parent.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true })));
    expect(checked).toEqual(["locked", "tokyo"]);
    await act(() => parent.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true })));
    expect(checked).toEqual(["locked"]);
    await act(() => parent.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true })));
    await act(() => render("Tokyo"));
    expect(container.querySelectorAll('[role="treeitem"]').length).toBe(2);
    expect(container.querySelector('[data-id="tokyo"]')?.getAttribute("aria-checked")).toBe("true");
    expect(container.querySelector('[data-id="locked"]')).toBeNull();
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("sortable list commits with Space and cancels with Escape", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let committed: string[] = [];
  function Harness() {
    const [items, setItems] = useState(["Tokyo", "Berlin", "Helsinki"]);
    return (
      <SortableList
        items={items}
        getKey={(item) => item}
        getLabel={(item) => item}
        renderItem={(item) => item}
        onReorder={(next) => {
          committed = next;
          setItems(next);
        }}
      />
    );
  }
  try {
    await act(() => root.render(<Harness />));
    const grip = container.querySelector<HTMLButtonElement>(".rk-sortable-grip");
    if (!grip) throw new Error("Missing grip");
    const key = async (value: string) =>
      act(() => grip.dispatchEvent(new KeyboardEvent("keydown", { key: value, bubbles: true })));
    await key(" ");
    await key("ArrowDown");
    await key(" ");
    expect(committed).toEqual(["Berlin", "Tokyo", "Helsinki"]);
    await key(" ");
    await key("ArrowDown");
    await key("Escape");
    expect(
      [...container.querySelectorAll(".rk-sortable-item")].map((row) => row.getAttribute("data-key")),
    ).toEqual(committed);
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("selection toolbar composes Escape handlers and keeps a native top layer", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let clears = 0;
  let cancel = true;
  try {
    await act(() =>
      root.render(
        <SelectionBar
          count={2}
          surface={{ shape: "ticket", padding: 12 }}
          onClear={() => {
            clears++;
          }}
          onKeyDown={(event) => {
            if (cancel) event.preventDefault();
          }}
        />,
      ),
    );
    const bar = container.querySelector<HTMLElement>('[role="toolbar"]');
    if (!bar) throw new Error("Missing toolbar");
    expect(bar.matches(":popover-open")).toBe(true);
    expect(bar.querySelector(".rk-overlay-surface")).not.toBeNull();
    await act(() =>
      bar.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })),
    );
    expect(clears).toBe(0);
    cancel = false;
    await act(() =>
      bar.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })),
    );
    expect(clears).toBe(1);
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("virtual table renders a bounded window and declares the complete row count", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(() =>
      root.render(
        <DataTable
          aria-label="Events"
          virtual
          maxHeight={240}
          surface={{ shape: "bevel" }}
          columns={[{ key: "id", header: "ID" }]}
          rows={Array.from({ length: 10000 }, (_, id) => ({ id }))}
          rowKey={(row) => String(row.id)}
        />,
      ),
    );
    expect(container.querySelector("table")?.getAttribute("aria-rowcount")).toBe("10001");
    expect(container.querySelectorAll("tbody tr[data-key]").length).toBeLessThan(50);
    expect(container.querySelectorAll("tbody tr[data-key]").length).toBeGreaterThan(0);
    expect(container.querySelector(".rk-table-spacer")).not.toBeNull();
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("horizontal scroller is keyboard reachable and respects Motion Off", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const width = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");
  const scroll = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollWidth");
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 100 });
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", { configurable: true, get: () => 500 });
  try {
    await act(() =>
      root.render(
        <Scope values={{ motion: "off" }}>
          <Scroller aria-label="Locations">
            <button type="button">Tokyo</button>
          </Scroller>
        </Scope>,
      ),
    );
    const viewport = container.querySelector<HTMLElement>(".rk-scroller-viewport");
    const forward = container.querySelector<HTMLButtonElement>('[data-dir="forward"]');
    if (!viewport || !forward) throw new Error("Missing scroller controls");
    let behavior: ScrollBehavior | undefined;
    viewport.scrollBy = (options?: ScrollToOptions | number) => {
      if (options && typeof options !== "number") behavior = options.behavior;
    };
    expect(viewport.tabIndex).toBe(0);
    expect(viewport.getAttribute("aria-label")).toBe("Locations");
    await act(() => forward.click());
    expect(behavior).toBe("auto");
  } finally {
    await act(() => root.unmount());
    if (width) Object.defineProperty(HTMLElement.prototype, "clientWidth", width);
    else Reflect.deleteProperty(HTMLElement.prototype, "clientWidth");
    if (scroll) Object.defineProperty(HTMLElement.prototype, "scrollWidth", scroll);
    else Reflect.deleteProperty(HTMLElement.prototype, "scrollWidth");
    container.remove();
  }
});
