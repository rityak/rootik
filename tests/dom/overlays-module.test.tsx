import { expect, test } from "bun:test";
import { act, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { CommandPalette as LegacyCommand, Dialog as LegacyDialog } from "../../src/components/dialog";
import { Button } from "../../src/controls/button";
import { Input } from "../../src/controls/input";
import { Field } from "../../src/forms/field";
import { Dialog as RootDialog, Popover as RootPopover } from "../../src/index";
import { CommandPalette, Dialog, Popover, Toaster, toast } from "../../src/overlays/index";
import { Scope } from "../../src/theme/provider";

test("overlays entry preserves root and legacy identities", () => {
  expect(RootDialog).toBe(Dialog);
  expect(LegacyDialog).toBe(Dialog);
  expect(LegacyCommand).toBe(CommandPalette);
  expect(RootPopover).toBe(Popover);
});

test("native dialog content, labels, selection and focus survive SVG and material changes", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let closes = 0;
  let clicks = 0;
  let cancel = true;
  const content = (
    <>
      <p id="external-description">External instructions</p>
      <Dialog
        title="Profile"
        description="Local instructions"
        aria-describedby="external-description"
        surface={{ shape: "bevel", padding: 24 }}
        onClose={() => closes++}
        onCancel={(event) => {
          if (cancel) event.preventDefault();
        }}
        onClick={() => clicks++}
      >
        <Field label="Gateway">
          <Input defaultValue="north" svgBorder="notch" />
        </Field>
      </Dialog>
    </>
  );
  try {
    await act(() => root.render(<Scope values={{ effects: "expressive", motion: "full" }}>{content}</Scope>));
    const dialog = container.querySelector("dialog"),
      input = container.querySelector("input");
    if (!dialog || !input) throw new Error("Missing dialog controls");
    input.focus();
    input.setSelectionRange(1, 3);
    const padding = container.querySelector(".rk-dialog-panel")?.getAttribute("style");
    expect(dialog.open).toBe(true);
    expect(dialog.getAttribute("aria-describedby")).toContain("external-description");
    expect(container.querySelectorAll(".rk-overlay-surface").length).toBe(1);
    for (const values of [
      { svgShapes: false },
      { corners: "square" },
      { style: "fluent" },
      { motion: "off" },
    ] as const) {
      await act(() => root.render(<Scope values={values}>{content}</Scope>));
      expect(container.querySelector("dialog")).toBe(dialog);
      expect(container.querySelector("input")).toBe(input);
      expect(input.value).toBe("north");
      expect(document.activeElement).toBe(input);
      expect(input.selectionStart).toBe(1);
      expect(container.querySelector(".rk-dialog-panel")?.getAttribute("style")).toBe(padding);
      if ("svgShapes" in values || "style" in values)
        expect(container.querySelectorAll(".rk-svg-surface-frame, .rk-svg-control-frame").length).toBe(0);
    }
    await act(() => dialog.dispatchEvent(new Event("cancel", { bubbles: true, cancelable: true })));
    expect(closes).toBe(0);
    cancel = false;
    await act(() => dialog.dispatchEvent(new Event("cancel", { bubbles: true, cancelable: true })));
    expect(closes).toBe(1);
    await act(() => {
      dialog.dispatchEvent(new Event("pointerdown", { bubbles: true }));
      dialog.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(closes).toBe(2);
    expect(clicks).toBe(1);
    await act(() => root.render(null));
    expect(dialog.open).toBe(false);
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("command palette exposes a named combobox and rejects disabled commands", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let runs = 0,
    closes = 0;
  try {
    await act(() =>
      root.render(
        <CommandPalette
          open
          surface={{ shape: "saddle" }}
          onClose={() => closes++}
          commands={[
            {
              id: "locked",
              label: "Locked",
              disabled: true,
              run: () => {
                throw new Error("Disabled command ran");
              },
            },
            { id: "save", label: "Save", run: () => runs++ },
          ]}
        />,
      ),
    );
    const search = container.querySelector<HTMLInputElement>('[role="combobox"]');
    if (!search) throw new Error("Missing command search");
    expect(search.getAttribute("aria-label")).toBeTruthy();
    expect(search.classList.contains("rk-command-input")).toBe(true);
    expect(search.getAttribute("aria-autocomplete")).toBe("list");
    await act(() => search.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
    expect(runs).toBe(0);
    expect(closes).toBe(0);
    await act(() => search.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })));
    await act(() => search.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
    expect(runs).toBe(1);
    expect(closes).toBe(1);
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("popover names React titles and toast SVG changes keep the same action buttons", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let actions = 0;
  const content = (
    <>
      <Popover
        open
        surface={{ shape: "ticket" }}
        title={<strong>Filters</strong>}
        trigger={<Button>Open</Button>}
      >
        <Input aria-label="Filter" />
      </Popover>
      <Toaster surface={{ shape: "bevel" }} />
    </>
  );
  try {
    await act(() => root.render(<Scope values={{ effects: "subtle" }}>{content}</Scope>));
    const popover = container.querySelector('[role="dialog"]');
    const labelId = popover?.getAttribute("aria-labelledby");
    expect(labelId).toBeTruthy();
    expect(document.getElementById(labelId ?? "")?.textContent).toBe("Filters");
    await act(() => {
      toast({ id: "overlay-test", title: "Saved", action: { label: "Undo", onClick: () => actions++ } });
    });
    const action = container.querySelector<HTMLButtonElement>(".rk-toast-action");
    if (!action) throw new Error("Missing toast action");
    await act(() => action.focus());
    await act(() => root.render(<Scope values={{ svgShapes: false, motion: "off" }}>{content}</Scope>));
    expect(container.querySelector(".rk-toast-action")).toBe(action);
    expect(document.activeElement).toBe(action);
    await act(() => action.click());
    expect(actions).toBe(1);
    expect(container.querySelector(".rk-toast")).toBeNull();
  } finally {
    await act(() => {
      toast.dismiss("overlay-test");
      root.unmount();
    });
    container.remove();
  }
});

test("notification controls remain mounted while their portal container follows modal dialogs", async () => {
  const query = document.querySelectorAll.bind(document);
  const descriptor = Object.getOwnPropertyDescriptor(document, "querySelectorAll");
  const computed = getComputedStyle;
  const computedDescriptor = Object.getOwnPropertyDescriptor(globalThis, "getComputedStyle");
  // Happy DOM omits inherited custom properties on the hidden origin span.
  Object.defineProperty(globalThis, "getComputedStyle", {
    configurable: true,
    value: (element: Element, pseudo?: string | null) =>
      computed(
        element instanceof HTMLSpanElement && element.hidden && element.parentElement
          ? element.parentElement
          : element,
        pseudo,
      ),
  });
  // Happy DOM does not implement :modal; dialog[open] models this test's native modal hosts.
  Object.defineProperty(document, "querySelectorAll", {
    configurable: true,
    value: (selector: string) => query(selector === "dialog:modal" ? "dialog[open]" : selector),
  });
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const render = (open: boolean) => (
    <Scope
      values={{ palette: "maomao", effects: "off" }}
      style={{ "--rk-portal-proof": "owner" } as CSSProperties}
    >
      {open && (
        <Scope values={{ palette: "makima" }} style={{ "--rk-portal-proof": "modal" } as CSSProperties}>
          <Dialog title="Modal host" surface={{ shape: "bevel" }} onClose={() => undefined}>
            Content
          </Dialog>
        </Scope>
      )}
      <Toaster surface={{ shape: "ticket" }} />
    </Scope>
  );
  try {
    await act(() => root.render(render(false)));
    await act(() => {
      toast({
        id: "modal-toast-test",
        title: "Notification",
        duration: 0,
        action: { label: "Action", onClick: () => undefined },
      });
    });
    const action = container.querySelector<HTMLButtonElement>(".rk-toast-action");
    if (!action) throw new Error("Missing notification action");
    await act(() => root.render(render(true)));
    expect(container.querySelector(".rk-toast-action")).toBe(action);
    expect(action.closest("dialog") === container.querySelector("dialog")).toBe(true);
    expect(action.closest<HTMLElement>(".rk-toast-host")?.style.getPropertyValue("--rk-portal-proof")).toBe(
      "owner",
    );
    expect(action.closest(".rk-toast-host")?.getAttribute("data-rk-palette")).toBe("maomao");
    expect(action.closest(".rk-toast-host")).not.toBeNull();
    await act(() => root.render(render(false)));
    expect(container.querySelector(".rk-toast-action")).toBe(action);
    expect(action.isConnected).toBe(true);
    expect(container.querySelector(".rk-toaster")?.matches(":popover-open")).toBe(true);
  } finally {
    await act(() => {
      toast.dismiss("modal-toast-test");
      root.unmount();
    });
    container.remove();
    if (descriptor) Object.defineProperty(document, "querySelectorAll", descriptor);
    else Reflect.deleteProperty(document, "querySelectorAll");
    if (computedDescriptor) Object.defineProperty(globalThis, "getComputedStyle", computedDescriptor);
    else Reflect.deleteProperty(globalThis, "getComputedStyle");
  }
});
