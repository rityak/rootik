import { expect, test } from "bun:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { Field as LegacyField } from "../../src/components/field";
import { Form as LegacyForm } from "../../src/components/form";
import { Button } from "../../src/controls/button";
import { Input } from "../../src/controls/input";
import { Field, Fieldset, Form, type Schema, SchemaForm } from "../../src/forms/index";
import { Fieldset as RootFieldset, SchemaForm as RootSchemaForm } from "../../src/index";
import { Scope } from "../../src/theme/provider";

test("forms entry preserves root and legacy identities", () => {
  expect(RootFieldset).toBe(Fieldset);
  expect(RootSchemaForm).toBe(SchemaForm);
  expect(LegacyForm).toBe(Form);
  expect(LegacyField).toBe(Field);
});

test("native forms compose handlers, focus errors, skip disabled fields and clear custom validity on reset", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let submitted: FormData | undefined;
  let inputs = 0;
  let resets = 0;
  let cancelReset = true;
  try {
    await act(() =>
      root.render(
        <Form
          onInput={() => inputs++}
          onReset={(event) => {
            resets++;
            if (cancelReset) event.preventDefault();
          }}
          validate={(data) => ({ gateway: data.get("gateway") === "reserved" ? "Reserved name" : undefined })}
          onSubmit={(data) => {
            submitted = data;
          }}
        >
          <Field id="gateway" label="Gateway" hint="Use a unique name" required>
            <Input name="gateway" required defaultValue="reserved" />
          </Field>
          <Fieldset legend="Locked" disabled surface={{ shape: "bevel" }}>
            <Field label="Locked name">
              {/* Happy DOM does not inherit fieldset disabled; the real browser verifies that path. */}
              <Input name="locked" required disabled />
            </Field>
          </Fieldset>
        </Form>,
      ),
    );
    const form = container.querySelector("form");
    const input = container.querySelector<HTMLInputElement>("#gateway");
    if (!form || !input) throw new Error("Missing form controls");
    const submit = () => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await act(() => {
      submit();
    });
    expect(submitted).toBeUndefined();
    expect(document.activeElement).toBe(input);
    expect(input.validationMessage).toBe("Reserved name");
    expect(container.querySelector('[role="alert"]')?.id).toBe(
      input.getAttribute("aria-describedby") ?? undefined,
    );
    await act(() => form.reset());
    expect(resets).toBe(1);
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
    cancelReset = false;
    await act(() => form.reset());
    expect(input.validity.customError).toBe(false);
    expect(container.querySelector('[role="alert"]')).toBeNull();
    input.value = "north";
    await act(() => input.dispatchEvent(new Event("input", { bubbles: true })));
    expect(inputs).toBe(1);
    await act(() => {
      submit();
    });
    expect(submitted?.get("gateway")).toBe("north");
    expect(submitted?.has("locked")).toBe(false);
    expect(container.querySelector("fieldset")?.firstElementChild?.tagName).toBe("LEGEND");
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("schema fields, section padding and native focus survive SVG, corner, motion and Fluent changes", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let saved = 0;
  const schema: Schema = [
    {
      id: "profile",
      title: "Profile",
      fields: [
        { key: "name", type: "string", label: "Profile name", default: "", required: true },
        {
          key: "enabled",
          type: "boolean",
          label: "Retry",
          default: true,
          children: [{ key: "tries", type: "number", label: "Attempts", default: 3, min: 1 }],
        },
        {
          key: "region",
          type: "select",
          label: "Region",
          default: "north",
          options: [{ value: "north", label: "North" }],
        },
      ],
    },
  ];
  const content = (
    <>
      <SchemaForm
        schema={schema}
        surface={{ shape: "saddle", padding: 24 }}
        svgBorder="notch"
        onSubmit={() => saved++}
        actions={
          <>
            <Button type="reset">Reset</Button>
            <Button type="submit">Save</Button>
          </>
        }
      />
      <Fieldset
        legend="Stable native group"
        surface={{ shape: "bevel", padding: { left: 32, right: 24, top: 24, bottom: 24 } }}
      >
        <Field label="Ordinary name">
          <Input defaultValue="Keep me" />
        </Field>
      </Fieldset>
    </>
  );
  try {
    await act(() => root.render(<Scope values={{ effects: "expressive", motion: "full" }}>{content}</Scope>));
    const form = container.querySelector("form");
    const name = form?.querySelector<HTMLInputElement>('[data-key="name"] input');
    if (!form || !name) throw new Error("Missing schema name");
    name.focus();
    await act(() => form.querySelector<HTMLButtonElement>('[type="submit"]')?.focus());
    expect(container.querySelector('[role="alert"]')).toBeNull();
    await act(() => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    expect(saved).toBe(0);
    expect(name.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(name);
    const nodes = [...container.querySelectorAll("input,button")];
    const pad = container.querySelector(".rk-settings-content")?.getAttribute("style");
    const nativePad = container.querySelector(".rk-fieldset[data-surface]")?.getAttribute("style");
    for (const values of [
      { svgShapes: false },
      { corners: "square" },
      { effects: "off" },
      { motion: "off" },
      { style: "fluent" },
    ] as const) {
      await act(() => root.render(<Scope values={values}>{content}</Scope>));
      nodes.forEach((node, index) => {
        expect(container.querySelectorAll("input,button")[index]).toBe(node);
      });
      expect(document.activeElement).toBe(name);
      expect(name.getAttribute("aria-invalid")).toBe("true");
      expect(container.querySelector(".rk-settings-content")?.getAttribute("style")).toBe(pad);
      expect(container.querySelector(".rk-fieldset[data-surface]")?.getAttribute("style")).toBe(nativePad);
      if ("svgShapes" in values || "style" in values) {
        expect(container.querySelectorAll(".rk-svg-control-frame, .rk-svg-surface-frame").length).toBe(0);
        expect(container.querySelectorAll(".rk-motion-layer").length).toBe(0);
      }
    }
    await act(() => form.reset());
    expect(container.querySelector('[role="alert"]')).toBeNull();
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});
