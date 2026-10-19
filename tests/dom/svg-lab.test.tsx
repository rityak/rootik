import { expect, test } from "bun:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { SvgLab } from "../../src/stories/svg-lab";

test("SVG surfaces keep unique filter references across previews and preserve working HTML controls", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(() =>
      root.render(
        <>
          <SvgLab />
          <SvgLab />
        </>,
      ),
    );
    const ids = Array.from(container.querySelectorAll("[id]")).map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const element of container.querySelectorAll("use")) {
      const href = element.getAttribute("href");
      if (!href?.startsWith("#")) throw new Error("Missing local SVG reference");
      expect(ids).toContain(href.slice(1));
    }
    const specimen = container.querySelector<HTMLButtonElement>('[aria-label="Select Contour strata"]');
    if (!specimen) throw new Error("Missing contour specimen");
    await act(() => specimen.click());
    const surfaces = container.querySelectorAll(".rx-hero");
    expect(surfaces[0]?.getAttribute("data-shape")).toBe("scoop");
    expect(surfaces[1]?.getAttribute("data-shape")).toBe("saddle");
    const labs = container.querySelectorAll(".rx-lab");
    const makima = Array.from(labs[0]?.querySelectorAll("button") ?? []).find((button) =>
      button.textContent?.includes("Makima"),
    );
    if (!makima) throw new Error("Missing Makima palette");
    await act(() => makima.click());
    expect(labs[0]?.getAttribute("data-palette")).toBe("makima");
    expect(labs[1]?.getAttribute("data-palette")).toBe("cobalt");
    expect(labs[0]?.querySelectorAll(".rx-theme-choice")).toHaveLength(6);
    for (const choice of labs[0]?.querySelectorAll<HTMLButtonElement>(".rx-theme-choice") ?? []) {
      await act(() => choice.click());
      expect(labs[0]?.getAttribute("data-palette")).toBe(choice.dataset.palette);
      expect(labs[1]?.getAttribute("data-palette")).toBe("cobalt");
    }
    expect(surfaces[0]?.getAttribute("data-shape")).toBe("scoop");
    expect(container.textContent).not.toContain("Угол света");
    expect(container.querySelector("feSpecularLighting")).toBeNull();
    const connect = Array.from(surfaces[0]?.querySelectorAll("button") ?? []).find(
      (button) => button.textContent === "Disconnect",
    );
    if (!connect) throw new Error("Missing connection control");
    await act(() => connect.click());
    expect(connect.textContent).toBe("Connect");
    expect(surfaces[0]?.querySelector(".rx-live")?.textContent).toContain("STANDBY");
    const labels = Array.from(container.querySelectorAll("label"));
    const wireframe = labels
      .find((label) => label.textContent?.includes("Показать пути"))
      ?.querySelector("input");
    if (!wireframe) throw new Error("Missing path inspection control");
    await act(() => wireframe.click());
    expect(surfaces[0]?.hasAttribute("data-wireframe")).toBe(true);
    expect(surfaces[1]?.hasAttribute("data-wireframe")).toBe(false);
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});
