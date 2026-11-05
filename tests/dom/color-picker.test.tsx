import { expect, test } from "bun:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { ColorPicker } from "../../src/controls/color-picker";

test("color area paints every pixel while preserving out-of-gamut selections", async () => {
  const original = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, "getContext");
  const frames: Uint8ClampedArray[] = [];
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: () => ({
      createImageData: (width: number, height: number) => ({
        data: new Uint8ClampedArray(width * height * 4),
      }),
      putImageData: (image: { data: Uint8ClampedArray }) => frames.push(image.data),
    }),
  });
  const container = document.createElement("div");
  const root = createRoot(container);
  try {
    await act(() => root.render(<ColorPicker value="oklch(1 0.37 294 / 0.62)" alpha />));
    const frame = frames[0];
    expect(frame?.length).toBe(240 * 160 * 4);
    expect(frame?.every((channel, index) => index % 4 !== 3 || channel === 255)).toBe(true);
    expect(container.querySelector(".rk-cp-thumb")?.hasAttribute("data-outside")).toBe(true);
    expect(container.querySelector<HTMLInputElement>(".rk-cp-text input")?.value).toBe(
      "oklch(1 0.37 294 / 0.62)",
    );
  } finally {
    await act(() => root.unmount());
    if (original) Object.defineProperty(HTMLCanvasElement.prototype, "getContext", original);
    else Reflect.deleteProperty(HTMLCanvasElement.prototype, "getContext");
  }
});
