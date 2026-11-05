import { expect, test } from "bun:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { TypographyLab } from "../../src/stories/typography-lab";

test("type specimens keep independent selections, real italic availability and working native controls", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(() =>
      root.render(
        <>
          <TypographyLab />
          <TypographyLab />
        </>,
      ),
    );
    const labs = container.querySelectorAll<HTMLElement>(".rt-lab");
    const first = labs[0];
    const second = labs[1];
    if (!first || !second) throw new Error("Missing type studies");
    const button = (text: string) => {
      const found = [...first.querySelectorAll<HTMLButtonElement>("button")].find(
        (item) => item.textContent === text,
      );
      if (!found) throw new Error(`Missing ${text}`);
      return found;
    };
    expect(first.dataset.family).toBe("system");
    expect(first.querySelectorAll(".rt-font-card")).toHaveLength(8);
    await act(() => button("Rubik + JetBrains").click());
    expect(first.dataset.family).toBe("rubik");
    const precisionFamily = first.dataset.family;
    expect(first.dataset.mono).toBe("jetbrains");
    expect(first.dataset.display).toBe("ui");
    expect(first.dataset.italic).toBe("true");
    expect(second.dataset.family).toBe("system");
    await act(() => button("Onest + Literata").click());
    expect(first.dataset.family).toBe("onest");
    expect(first.dataset.family).not.toBe(precisionFamily);
    expect(first.dataset.mono).toBe("jetbrains");
    expect(first.dataset.display).toBe("literata");
    expect(first.dataset.italic).toBe("true");
    await act(() => button("Rubik + JetBrains").click());
    expect(first.dataset.family).toBe("rubik");
    expect(first.dataset.display).toBe("ui");
    expect(first.dataset.italic).toBe("true");
    await act(() => button("Системные").click());
    await act(() => button("Применить Golos Text").click());
    expect(first.dataset.family).toBe("golos");
    expect(first.dataset.italic).toBe("false");
    expect(first.querySelector('[data-specimen="golos"] em')).toBeNull();
    expect(first.querySelector('[data-specimen="onest"] em')).toBeNull();
    expect(first.querySelector('[data-specimen="inter"] em')?.textContent).toContain("Настоящий курсив");
    expect(first.querySelector('[data-specimen="rubik"] em')?.textContent).toContain("Настоящий курсив");
    expect(first.querySelector('[data-specimen="rubik"] .rt-bold-italic')?.textContent).toContain(
      "Жирный курсив",
    );
    expect(first.textContent).toContain("Ёё");
    expect(first.textContent).toContain("№ ₽");
    await act(() => button("Сохранить").click());
    expect(button("Сохранено")).toBeTruthy();
    const input = first.querySelector<HTMLInputElement>(".rt-form input");
    expect(input?.value).toBe("Северный шлюз · Москва");
    expect(input?.labels?.[0]?.textContent).toBe("Имя подключения");
    const ids = [...container.querySelectorAll("[id]")].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});
