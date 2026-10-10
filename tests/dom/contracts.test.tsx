import { afterEach, expect, jest, test } from "bun:test";
import { act, type ReactNode, StrictMode } from "react";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { Combobox } from "../../src/components/combobox";
import { ConfirmHost, confirm, prompt } from "../../src/components/confirm";
import { DataTable } from "../../src/components/data";
import { Form } from "../../src/components/form";
import { Input } from "../../src/components/input";
import { Tabs } from "../../src/components/nav";
import { Toaster, toast } from "../../src/components/toast";
import { Tree } from "../../src/components/tree";
import { cloneTrigger } from "../../src/lib/hooks";
import { RootikProvider, useAppearanceValue } from "../../src/theme/provider";

const roots: { root: Root; container: HTMLDivElement }[] = [];
async function mount(children: ReactNode) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  roots.push({ root, container });
  await act(() => root.render(children));
  return { root, container };
}
afterEach(async () => {
  for (const { root, container } of roots.splice(0)) {
    await act(() => root.unmount());
    container.remove();
  }
  localStorage.clear();
  toast.dismiss();
  jest.useRealTimers();
});

test("Form blocks an invalid native control without id and permits valid submission", async () => {
  let submitted = 0;
  const { container } = await mount(
    <Form onSubmit={() => submitted++}>
      <Input name="name" required />
    </Form>,
  );
  const input = container.querySelector("input");
  const form = container.querySelector("form");
  if (!input || !form) throw new Error("Missing native controls");
  await act(() => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  expect(submitted).toBe(0);
  expect(document.activeElement).toBe(input);
  input.value = "Valid";
  await act(() => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  expect(submitted).toBe(1);
});

test("DataTable composes row handlers before its action and honors cancellation/native tabIndex", async () => {
  const events: string[] = [];
  const row = { id: "one", name: "First" };
  const { container } = await mount(
    <DataTable
      rows={[row]}
      rowKey={(item) => item.id}
      columns={[{ key: "name", header: "Name" }]}
      onRowClick={() => events.push("internal")}
      rowProps={() => ({ tabIndex: 4, onClick: () => events.push("custom") })}
    />,
  );
  const tr = container.querySelector<HTMLTableRowElement>("tr[data-key]");
  if (!tr) throw new Error("Missing row");
  expect(tr.tabIndex).toBe(4);
  await act(() => {
    tr.click();
  });
  expect(events).toEqual(["custom", "internal"]);
  await act(() =>
    roots[0]?.root.render(
      <DataTable
        rows={[row]}
        rowKey={(item) => item.id}
        columns={[{ key: "name", header: "Name" }]}
        onRowClick={() => events.push("internal")}
        rowProps={() => ({
          onClick: (event) => {
            events.push("cancelled");
            event.preventDefault();
          },
        })}
      />,
    ),
  );
  await act(() => {
    tr.click();
  });
  expect(events).toEqual(["custom", "internal", "cancelled"]);
});

test("Tabs recover focus after removal and controlled arrows move from actual focus", async () => {
  const items = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
    { value: "c", label: "Gamma" },
  ];
  const { root, container } = await mount(<Tabs value="a" items={items} />);
  const alpha = container.querySelector<HTMLButtonElement>('[data-value="a"]');
  const beta = container.querySelector<HTMLButtonElement>('[data-value="b"]');
  if (!alpha || !beta) throw new Error("Missing tabs");
  alpha.focus();
  await act(() => {
    alpha.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  });
  expect(document.activeElement).toBe(beta);
  await act(() => {
    beta.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  });
  expect(document.activeElement?.textContent).toBe("Gamma");
  await act(() => root.render(<Tabs value="a" items={items.slice(0, 2)} />));
  expect(document.activeElement).toBe(alpha);
  expect(alpha.getAttribute("aria-selected")).toBe("true");
});

test("last ConfirmHost unmount cancels queued requests, including StrictMode", async () => {
  const { root } = await mount(
    <StrictMode>
      <ConfirmHost />
    </StrictMode>,
  );
  let confirmed: Promise<boolean> | undefined;
  let prompted: Promise<string | null> | undefined;
  await act(() => {
    confirmed = confirm({ title: "Confirm" });
    prompted = prompt({ title: "Prompt" });
  });
  await act(() => root.render(null));
  expect(await confirmed).toBe(false);
  expect(await prompted).toBeNull();
});

test("cloneTrigger keeps existing accessible descriptions while attaching an overlay", () => {
  const cloned = cloneTrigger(
    <button type="button" aria-describedby="hint shared">
      Action
    </button>,
    {
      "aria-describedby": "overlay shared",
    },
  );
  expect((cloned.props as { "aria-describedby": string })["aria-describedby"]).toBe("hint shared overlay");
});

test("Combobox refreshes a changed label without changing a controlled value", async () => {
  const { root, container } = await mount(
    <Combobox value="one" options={[{ value: "one", label: "Original" }]} />,
  );
  await act(() => root.render(<Combobox value="one" options={[{ value: "one", label: "Updated" }]} />));
  expect(container.querySelector("input")?.value).toBe("Updated");
});

test("hidden transient toasts expire and updates restart the queue timer", async () => {
  jest.useFakeTimers();
  const { container } = await mount(<Toaster max={1} />);
  await act(() => {
    toast({ id: "old", title: "Old", duration: 100 });
    toast({ id: "new", title: "New", duration: 0 });
    jest.advanceTimersByTime(100);
    toast.dismiss("new");
  });
  expect(container.querySelectorAll(".rk-toast")).toHaveLength(0);
  await act(() => {
    toast({ id: "update", title: "Before", duration: 100 });
    jest.advanceTimersByTime(80);
    toast({ id: "update", title: "After", duration: 100 });
    jest.advanceTimersByTime(80);
  });
  expect(container.querySelector(".rk-toast-title")?.textContent).toBe("After");
  await act(() => {
    jest.advanceTimersByTime(20);
  });
  expect(container.querySelectorAll(".rk-toast")).toHaveLength(0);
});

test("toast timers preserve remaining time while focus pauses the stack", async () => {
  jest.useFakeTimers();
  const { container } = await mount(<Toaster />);
  await act(() => {
    toast({ title: "Paused", duration: 100 });
  });
  const close = container.querySelector<HTMLButtonElement>(".rk-toast-close");
  if (!close) throw new Error("Missing close button");
  await act(() => {
    jest.advanceTimersByTime(40);
    close.focus();
  });
  await act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(container.querySelectorAll(".rk-toast")).toHaveLength(1);
  await act(() => {
    close.blur();
  });
  await act(() => {
    jest.advanceTimersByTime(59);
  });
  expect(container.querySelectorAll(".rk-toast")).toHaveLength(1);
  await act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(container.querySelectorAll(".rk-toast")).toHaveLength(0);
});

test("provider restores prior target values and preserves later external writes", async () => {
  const target = document.createElement("div");
  target.style.setProperty("--rk-accent", "red", "important");
  target.setAttribute("data-rk-style", "original");
  document.body.append(target);
  const { root } = await mount(
    <StrictMode>
      <RootikProvider target={target}>
        <span>Scoped</span>
      </RootikProvider>
    </StrictMode>,
  );
  expect(target.hasAttribute("data-rk-scope")).toBe(true);
  target.style.setProperty("--rk-radius", "77px");
  await act(() => root.render(null));
  expect(target.style.getPropertyValue("--rk-accent")).toBe("red");
  expect(target.style.getPropertyPriority("--rk-accent")).toBe("important");
  expect(target.style.getPropertyValue("--rk-radius")).toBe("77px");
  expect(target.getAttribute("data-rk-style")).toBe("original");
  expect(target.hasAttribute("data-rk-scope")).toBe(false);
  target.remove();
});

test("persisted appearance hydrates without a server/client mismatch", async () => {
  function Value() {
    return <span>{useAppearanceValue("fontSize")}</span>;
  }
  const app = (
    <RootikProvider storageKey="hydrate">
      <Value />
    </RootikProvider>
  );
  localStorage.setItem("hydrate", JSON.stringify({ fontSize: 18, density: "broken" }));
  const container = document.createElement("div");
  container.innerHTML = renderToString(app);
  document.body.append(container);
  expect(container.textContent).toBe("13");
  const errors: unknown[] = [];
  let root: Root | undefined;
  await act(() => {
    root = hydrateRoot(container, app, { onRecoverableError: (error) => errors.push(error) });
  });
  if (!root) throw new Error("Missing hydration root");
  roots.push({ root, container });
  expect(container.textContent).toBe("16");
  expect(errors).toEqual([]);
});

test("Combobox reports a failed loader instead of an empty search result", async () => {
  jest.useFakeTimers();
  const failure = new Error("Offline");
  const errors: unknown[] = [];
  const { container } = await mount(
    <Combobox
      loadOptions={() => Promise.reject(failure)}
      debounce={10}
      onLoadError={(error) => errors.push(error)}
      errorText="Unavailable"
    />,
  );
  const input = container.querySelector("input");
  if (!input) throw new Error("Missing combobox input");
  await act(() => {
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
  });
  await act(async () => {
    jest.advanceTimersByTime(10);
    await Promise.resolve();
  });
  expect(errors).toEqual([failure]);
  expect(container.querySelector(".rk-combobox-empty")?.textContent).toBe("Unavailable");
});

test("React 19 merged refs balance every StrictMode attachment with a cleanup", async () => {
  let attached = 0,
    cleaned = 0,
    nulled = 0;
  const active = new Set<HTMLInputElement>();
  const ref = (node: HTMLInputElement | null) => {
    if (!node) {
      nulled++;
      return;
    }
    attached++;
    active.add(node);
    return () => {
      cleaned++;
      active.delete(node);
    };
  };
  const { root } = await mount(
    <StrictMode>
      <Input ref={ref} />
    </StrictMode>,
  );
  await act(() =>
    root.render(
      <StrictMode>
        <Input ref={ref} disabled />
      </StrictMode>,
    ),
  );
  await act(() => root.render(null));
  expect(attached).toBeGreaterThan(0);
  expect(cleaned).toBe(attached);
  expect(nulled).toBe(0);
  expect(active.size).toBe(0);
});

test("Tree recovers focus when a controlled selection is hidden by a filter", async () => {
  const items = [
    { id: "one", label: "First" },
    { id: "two", label: "Second" },
  ];
  const { root, container } = await mount(<Tree items={items} selected="one" />);
  const first = container.querySelector<HTMLElement>('[role="treeitem"]');
  if (!first) throw new Error("Missing tree entry");
  await act(() => first.focus());
  await act(() => root.render(<Tree items={items} selected="one" filter="Second" />));
  const second = container.querySelector<HTMLElement>('[role="treeitem"]');
  expect(second?.textContent).toBe("Second");
  expect(second?.tabIndex).toBe(0);
  expect(document.activeElement).toBe(second);
});
