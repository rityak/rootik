import { expect, test } from "bun:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { SvgArtwork } from "../../src/components/svg-artwork";
import { SvgBackdrop } from "../../src/components/svg-backdrop";
import { SvgSurface } from "../../src/components/svg-surface";

const localReference = /url\(#([^)]*)\)/g;

test("composed SVG layers isolate references, expose real stripe geometry and leave HTML controls operable", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let clicks = 0;
  try {
    await act(() =>
      root.render(
        [0, 1].map((value) => (
          <SvgSurface
            key={value}
            shape="ticket"
            edge="left"
            padding={{ left: 64, top: 24 }}
            depth={1}
            showSafeArea
            background={
              <SvgBackdrop pattern="stripes">
                {({ id }) => (
                  <>
                    <defs>
                      <linearGradient id={`${id}-custom`}>
                        <stop stopColor="currentColor" />
                      </linearGradient>
                    </defs>
                    <circle cx="20" cy="20" r="12" fill={`url(#${id}-custom)`} />
                  </>
                )}
              </SvgBackdrop>
            }
          >
            <button type="button" onClick={() => clicks++}>
              Open
            </button>
            <input aria-label={`Panel ${value}`} defaultValue="Safe" />
            <SvgArtwork motion="drift" variant="ribbons" />
          </SvgSurface>
        )),
      ),
    );
    const ids = Array.from(container.querySelectorAll("[id]")).map((node) => node.id);
    const glass = container.querySelector<HTMLElement>(".rk-svg-surface-glass");
    expect(glass?.style.clipPath.startsWith("path(")).toBe(true);
    expect(glass?.querySelector(".rk-svg-surface-blur")).not.toBeNull();
    expect(ids.length).toBe(new Set(ids).size);
    for (const node of container.querySelectorAll("[fill],[stroke],[filter],[clip-path],use")) {
      for (const attribute of Array.from(node.attributes))
        for (const match of attribute.value.matchAll(localReference)) {
          const owner = node.closest("svg");
          expect(
            Array.from(owner?.querySelectorAll("[id]") ?? []).some((element) => element.id === match[1]),
          ).toBe(true);
        }
      const href = node.getAttribute("href");
      if (href?.startsWith("#")) expect(ids).toContain(href.slice(1));
    }
    expect(container.querySelectorAll('pattern[patternTransform="rotate(35)"] path')).toHaveLength(2);
    expect(container.querySelectorAll(".rk-svg-surface-guide")).toHaveLength(2);
    const surface = container.querySelector<HTMLElement>(".rk-svg-surface");
    expect(surface?.style.getPropertyValue("--rk-svg-pad-left")).toBe("64px");
    expect(surface?.style.getPropertyValue("--rk-svg-pad-top")).toBe("24px");
    await act(() => container.querySelector("button")?.click());
    expect(clicks).toBe(1);
    expect(container.querySelector<HTMLInputElement>("input")?.value).toBe("Safe");
    await act(() =>
      root.render(
        <SvgSurface padding={8} contours>
          Small padding
        </SvgSurface>,
      ),
    );
    expect(container.querySelectorAll("g[clip-path] path")).toHaveLength(0);
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});
