import { expect, test } from "bun:test";
import { act, createRef } from "react";
import { createRoot } from "react-dom/client";
import { Field } from "../../src/components/input";
import {
  Button,
  Checkbox,
  ChipGroup,
  ChoiceCards,
  Input,
  NativeSelect,
  NumberInput,
  PasswordInput,
  SearchInput,
  Select,
  SplitButton,
  Switch,
  Textarea,
  TokenField,
} from "../../src/controls/index";
import { Scope } from "../../src/theme/provider";

test("control contours preserve native nodes, field wiring, values and focus across appearance changes", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const inputRef = createRef<HTMLInputElement>();
  const textareaRef = createRef<HTMLTextAreaElement>();
  const content = (
    <form>
      <Field label="Gateway" hint="Local only">
        <Input name="gateway" ref={inputRef} svgBorder="cut" defaultValue="north" />
      </Field>
      <Field label="Notes" error="Required">
        <Textarea name="notes" ref={textareaRef} svgBorder="notch" defaultValue="Keep me" />
      </Field>
      <SearchInput svgBorder="cut" aria-label="Search" defaultValue="Find me" />
      <PasswordInput svgBorder="notch" aria-label="Password" defaultValue="demo-only" />
      <NativeSelect
        aria-label="Native"
        svgBorder="ticket"
        name="region"
        defaultValue="east"
        options={[{ value: "east", label: "East" }]}
      />
      <Select
        aria-label="Region"
        svgBorder="notch"
        defaultValue="one"
        options={[
          { value: "one", label: "One" },
          { value: "two", label: "Two" },
        ]}
      />
      <TokenField aria-label="Tags" svgBorder="cut" defaultValue={["env:dev"]} />
      <ChoiceCards
        aria-label="Mode"
        svgBorder="ticket"
        options={[{ value: "auto", label: "Automatic" }]}
        defaultValue="auto"
      />
      <ChipGroup
        aria-label="Filters"
        svgBorder="cut"
        options={[{ value: "all", label: "All" }]}
        defaultValue={["all"]}
      />
      <Button svgBorder="cut">Save</Button>
    </form>
  );
  try {
    await act(() => root.render(<Scope values={{ svgShapes: true }}>{content}</Scope>));
    const nodes = [...container.querySelectorAll("input, textarea, select, button")];
    const frames = container.querySelectorAll(".rk-svg-control-frame").length;
    expect(frames).toBe(10);
    expect(textareaRef.current?.getAttribute("aria-invalid")).toBe("true");
    expect(container.querySelector("label")?.htmlFor).toBe(inputRef.current?.id);
    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(1, 3);
    for (const values of [
      { svgShapes: false },
      { svgShapes: true, style: "fluent" },
      { svgShapes: true, style: "rootik", corners: "square" },
    ] as const) {
      await act(() => root.render(<Scope values={values}>{content}</Scope>));
      const currentNodes = [...container.querySelectorAll("input, textarea, select, button")];
      expect(currentNodes.length).toBe(nodes.length);
      nodes.forEach((node, index) => {
        expect(currentNodes[index]).toBe(node);
      });
      expect(document.activeElement).toBe(inputRef.current);
      expect(inputRef.current?.selectionStart).toBe(1);
      expect(textareaRef.current?.value).toBe("Keep me");
      expect(container.querySelector(".rk-choice-card input:checked")?.getAttribute("value")).toBe("auto");
      expect(container.querySelector(".rk-chip")?.getAttribute("aria-pressed")).toBe("true");
      expect(container.querySelectorAll(".rk-svg-control-frame").length).toBe(
        values.svgShapes && values.style === "rootik" ? frames : 0,
      );
      const form = container.querySelector("form");
      if (!form) throw new Error("Missing form");
      expect(new FormData(form).get("gateway")).toBe("north");
      expect(new FormData(form).get("region")).toBe("east");
    }
    for (const frame of container.querySelectorAll(".rk-svg-control-frame")) {
      expect(frame.getAttribute("aria-hidden")).toBe("true");
      expect(frame.querySelector("path")?.getAttribute("d")).not.toContain("NaN");
    }
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

test("migrated controls keep disabled, keyboard, loading and native-class contracts", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let selected = "";
  let number: number | null = null;
  try {
    await act(() =>
      root.render(
        <>
          <Select
            svgBorder="cut"
            aria-label="Region"
            defaultValue="one"
            onChange={(value) => {
              selected = value;
            }}
            options={[
              { value: "one", label: "One" },
              { value: "locked", label: "Locked", disabled: true },
              { value: "two", label: "Two" },
            ]}
          />
          <NumberInput
            svgBorder="notch"
            aria-label="Count"
            defaultValue={8}
            min={2}
            max={32}
            step={2}
            onChange={(value) => {
              number = value;
            }}
          />
          <Checkbox aria-label="Bare checkbox" className="custom-check" indeterminate />
          <Switch aria-label="Bare switch" className="custom-switch" />
          <SplitButton svgBorder="cut" loading menu={<span>Export</span>}>
            Saving
          </SplitButton>
        </>,
      ),
    );
    const select = container.querySelector<HTMLButtonElement>('[role="combobox"]');
    const spin = container.querySelector<HTMLInputElement>('[role="spinbutton"]');
    if (!select || !spin) throw new Error("Missing keyboard controls");
    select.focus();
    for (const key of ["ArrowDown", "ArrowDown", "Enter"])
      await act(() => select.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true })));
    expect(selected).toBe("two");
    expect(select.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(select);
    await act(() => spin.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })));
    expect<number | null>(number).toBe(32);
    expect(spin.getAttribute("aria-valuenow")).toBe("32");
    expect(container.querySelector<HTMLInputElement>(".custom-check")?.indeterminate).toBe(true);
    expect(container.querySelector(".custom-switch")?.getAttribute("role")).toBe("switch");
    expect(
      [...container.querySelectorAll<HTMLButtonElement>(".rk-split-button button")].every(
        (button) => button.disabled,
      ),
    ).toBe(true);
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});
