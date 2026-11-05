import { expect, test } from "bun:test";
import { act, createRef } from "react";
import { createRoot } from "react-dom/client";
import { Button, IconButton } from "../../src/components/button";
import { Field, Input } from "../../src/components/input";
import { SVG_CONTROL_BORDERS } from "../../src/lib/svg-geometry";

test("SVG control borders preserve native actions, refs, field wiring and disabled states", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const buttonRef = createRef<HTMLButtonElement>();
  const inputRef = createRef<HTMLInputElement>();
  let clicks = 0;
  try {
    await act(() =>
      root.render(
        <>
          <Button ref={buttonRef} svgBorder="cut" onClick={() => clicks++}>
            Save
          </Button>
          <Button svgBorder="notch" loading onClick={() => clicks++}>
            Saving
          </Button>
          <Button svgBorder="ticket" disabled onClick={() => clicks++}>
            Unavailable
          </Button>
          <IconButton
            svgBorder="ticket"
            label="Add gateway"
            tooltip={false}
            icon={<span>+</span>}
            onClick={() => clicks++}
          />
          <Field label="Gateway" error="Required">
            <Input svgBorder="notch" ref={inputRef} />
          </Field>
          <Button>Default</Button>
          <Input aria-label="Default input" />
          {SVG_CONTROL_BORDERS.map((border) => (
            <Input key={border} svgBorder={border} aria-label={border} />
          ))}
        </>,
      ),
    );
    const buttons = container.querySelectorAll("button");
    expect(buttonRef.current).toBe(buttons[0] ?? null);
    await act(() => {
      for (const button of buttons) button.click();
    });
    expect(clicks).toBe(2);
    expect(buttons[1]?.disabled).toBe(true);
    expect(buttons[1]?.getAttribute("aria-busy")).toBe("true");
    expect(buttons[3]?.getAttribute("aria-label")).toBe("Add gateway");
    expect(buttons[4]?.querySelector("svg")).toBeNull();
    expect(inputRef.current?.getAttribute("aria-invalid")).toBe("true");
    expect(container.querySelector("label")?.htmlFor).toBe(inputRef.current?.id);
    expect(
      document.getElementById(inputRef.current?.getAttribute("aria-describedby") ?? "")?.textContent,
    ).toBe("Required");
    await act(() => inputRef.current?.focus());
    expect(document.activeElement).toBe(inputRef.current);
    for (const frame of container.querySelectorAll(".rk-svg-control-frame")) {
      expect(frame.getAttribute("aria-hidden")).toBe("true");
      expect(frame.getAttribute("focusable")).toBe("false");
      expect(frame.querySelector("path")?.getAttribute("d")).not.toContain("NaN");
    }
    expect(
      container.querySelector('[aria-label="Default input"]')?.parentElement?.querySelector("svg"),
    ).toBeNull();
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});
