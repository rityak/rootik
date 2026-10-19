import { expect, test } from "bun:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { DesignLab } from "../../src/stories/design-lab";

test("design comparison keeps baseline data isolated and validates a newly added node", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const button = (scope: Element, text: string) => {
    const control = Array.from(scope.querySelectorAll("button")).find(
      (item) => item.textContent?.trim() === text,
    );
    if (!control) throw new Error(`Missing button: ${text}`);
    return control;
  };
  try {
    await act(() => root.render(<DesignLab />));
    const compare = container.querySelectorAll<HTMLInputElement>(".rd-lab-options input")[1];
    if (!compare) throw new Error("Missing comparison control");
    await act(() => compare.click());
    const baseline = container.querySelector('.rd-app[data-direction="signal-dark"]');
    const experiment = container.querySelector('.rd-app[data-direction="signal-light"]');
    if (!baseline || !experiment) throw new Error("Missing comparison previews");
    await act(() => button(experiment, "Add node").click());
    const form = experiment.querySelector("dialog form");
    const input = form?.querySelector<HTMLInputElement>('input[name="locationName"]');
    if (!form || !input) throw new Error("Missing node form");
    const submit = () => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await act(() => {
      submit();
    });
    expect(experiment.querySelector("dialog")).not.toBeNull();
    input.value = "Copenhagen";
    await act(() => {
      submit();
    });
    expect(experiment.querySelector("dialog")).toBeNull();
    expect(experiment.querySelector(".rd-inspector h2")?.textContent).toContain("Copenhagen");
    expect(experiment.querySelectorAll("tbody tr")).toHaveLength(7);
    expect(baseline.querySelectorAll("tbody tr")).toHaveLength(6);
    expect(baseline.textContent).not.toContain("Copenhagen");
    await act(() => button(experiment, "Disconnect").click());
    expect(experiment.querySelector(".rd-connected")?.textContent).toBe("Disconnected");
    expect(baseline.querySelector(".rd-connected")?.textContent).toBe("Connected");
    const darkTheme = container.querySelector<HTMLButtonElement>(
      '.rd-direction-picker button[data-direction="signal-dark"]',
    );
    if (!darkTheme) throw new Error("Missing dark theme control");
    await act(() => darkTheme.click());
    const changed = container.querySelector(".rd-preview:last-child .rd-app");
    expect(changed?.getAttribute("data-direction")).toBe("signal-dark");
    expect(changed?.querySelectorAll("tbody tr")).toHaveLength(7);
    expect(changed?.querySelector(".rd-inspector h2")?.textContent).toContain("Copenhagen");
    expect(changed?.querySelector(".rd-connected")?.textContent).toBe("Disconnected");
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});
