import { expect, test } from "bun:test";
import { act, createRef } from "react";
import { createRoot } from "react-dom/client";
import { Card as LegacyCard } from "../../src/components/card";
import {
  Avatar,
  AvatarGroup,
  Card,
  CodeBlock,
  CodeEditor,
  Disclosure,
  ImageGrid,
  JsonView,
  Lightbox,
  LogView,
  StickToBottom,
  type StickToBottomHandle,
  Text,
  TextShimmer,
  Thumbnail,
} from "../../src/content/index";
import { Disclosure as LayoutDisclosure } from "../../src/layout/disclosure";
import { Scope } from "../../src/theme/provider";

function mount() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  return {
    container,
    root,
    dispose: async () => {
      await act(() => root.unmount());
      container.remove();
    },
  };
}

test("content module exports retain root, legacy and layout identities", async () => {
  const content = await import("../../src/content/index");
  const kit = await import("../../src/index");
  for (const [name, value] of Object.entries(content))
    expect(value === (kit as Record<string, unknown>)[name]).toBe(true);
  expect(Card).toBe(LegacyCard);
  expect(Disclosure).toBe(LayoutDisclosure);
});

test("shaped cards keep native children, collapse state and independent actions across material changes", async () => {
  const { container, root, dispose } = mount();
  let actions = 0,
    inside = 0;
  const render = (svgShapes: boolean) =>
    root.render(
      <Scope values={{ svgShapes }}>
        <Card title="Parameters" collapsible surface={{ shape: "saddle", padding: 24 }}>
          <input aria-label="Profile" defaultValue="North" />
        </Card>
        <Card title="Select" surface={{ shape: "ticket" }} onAction={() => actions++} selected>
          <button type="button" onClick={() => inside++}>
            Inner action
          </button>
        </Card>
      </Scope>,
    );
  try {
    await act(() => render(true));
    const input = container.querySelector("input");
    await act(() => input?.focus());
    if (input) input.value = "Retained";
    await act(() => render(false));
    expect(container.querySelector("input") === input).toBe(true);
    expect(document.activeElement === input).toBe(true);
    expect(input?.value).toBe("Retained");
    const collapse = container.querySelector<HTMLButtonElement>(".rk-card-toggle[aria-expanded]");
    await act(() => collapse?.click());
    expect(collapse?.getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector(".rk-card-collapse")?.hasAttribute("inert")).toBe(true);
    await act(() => render(true));
    expect(collapse?.getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector("input") === input).toBe(true);
    await act(() => container.querySelector<HTMLButtonElement>(".rk-card-hit")?.click());
    expect(actions).toBe(1);
    await act(() =>
      Array.from(container.querySelectorAll("button"))
        .find((button) => button.textContent === "Inner action")
        ?.click(),
    );
    expect(inside).toBe(1);
    expect(actions).toBe(1);
  } finally {
    await dispose();
  }
});

test("disclosure stays a native details and preserves expansion and form state", async () => {
  const { container, root, dispose } = mount();
  const render = (svgShapes: boolean, surface = true, style: "rootik" | "fluent" = "rootik") =>
    root.render(
      <Scope values={{ svgShapes, style }}>
        <Disclosure title="Details" surface={surface ? { shape: "ticket", padding: 16 } : undefined}>
          <input defaultValue="Value" />
        </Disclosure>
      </Scope>,
    );
  try {
    await act(() => render(true));
    const details = container.querySelector("details");
    const input = container.querySelector("input");
    const wrapper = details?.parentElement;
    expect(wrapper?.querySelectorAll(":scope > .rk-overlay-surface").length).toBe(1);
    expect(details?.querySelector(".rk-overlay-surface")).toBeNull();
    if (details) details.open = true;
    if (input) input.value = "Changed";
    await act(() => render(false));
    expect(container.querySelector("details") === details).toBe(true);
    expect(details?.open).toBe(true);
    expect(input?.value).toBe("Changed");
    await act(() => render(true, true, "fluent"));
    expect(wrapper?.querySelector(":scope > .rk-overlay-surface")?.hasAttribute("data-flat")).toBe(true);
    expect(details?.style.getPropertyValue("--rk-overlay-pad")).toBe("16px 16px 16px 16px");
    await act(() => render(true, false));
    expect(container.querySelector("details") === details).toBe(true);
    expect(container.querySelector("input") === input).toBe(true);
    expect(details?.open).toBe(true);
    expect(input?.value).toBe("Changed");
    expect(wrapper?.querySelector(".rk-overlay-surface")).toBeNull();
  } finally {
    await dispose();
  }
});

test("avatar images fall back to initials and recover for a new source; max zero hides the group", async () => {
  const { container, root, dispose } = mount();
  try {
    await act(() =>
      root.render(<Avatar name="Anna North" src="bad.svg" status="success" statusLabel="Online" />),
    );
    const avatar = container.querySelector(".rk-avatar");
    await act(() => container.querySelector("img")?.dispatchEvent(new Event("error")));
    expect(avatar?.textContent).toBe("AN");
    expect(avatar?.getAttribute("aria-label")).toBe("Anna North, Online");
    await act(() => root.render(<Avatar name="Anna North" src="good.svg" />));
    expect(container.querySelector(".rk-avatar") === avatar).toBe(true);
    expect(container.querySelector("img")?.getAttribute("src")).toBe("good.svg");
    await act(() =>
      root.render(
        <AvatarGroup max={0}>
          {[<Avatar key="one" name="One" />, <Avatar key="two" name="Two" />]}
        </AvatarGroup>,
      ),
    );
    expect(container.querySelectorAll(".rk-avatar:not(.rk-avatar-more)").length).toBe(0);
    expect(container.querySelector(".rk-avatar-more")?.textContent).toBe("+2");
  } finally {
    await dispose();
  }
});

test("missing thumbnails keep their textual image alternative", async () => {
  const { container, root, dispose } = mount();
  try {
    await act(() => root.render(<Thumbnail src="bad.svg" alt="Contour study" />));
    await act(() => container.querySelector("img")?.dispatchEvent(new Event("error")));
    expect(container.querySelector('[role="img"]')?.getAttribute("aria-label")).toBe("Contour study");
  } finally {
    await dispose();
  }
});

test("text shimmer exposes one-pass and off states without replacing text", async () => {
  const { container, root, dispose } = mount();
  const render = (motion: "full" | "off", animation: "once" | "off") =>
    root.render(
      <Scope values={{ motion, effects: "expressive" }}>
        <TextShimmer animation={animation}>Preparing</TextShimmer>
      </Scope>,
    );
  try {
    await act(() => render("full", "once"));
    const span = container.querySelector(".rk-text-shimmer");
    expect(span?.getAttribute("data-animation")).toBe("once");
    expect(span?.hasAttribute("data-active")).toBe(true);
    await act(() => render("full", "off"));
    expect(container.querySelector(".rk-text-shimmer") === span).toBe(true);
    expect(span?.hasAttribute("data-active")).toBe(false);
    await act(() => render("off", "once"));
    expect(span?.hasAttribute("data-active")).toBe(false);
    expect(span?.textContent).toBe("Preparing");
  } finally {
    await dispose();
  }
});

test("code wrap and editor state survive appearance changes with their native nodes", async () => {
  const { container, root, dispose } = mount();
  let code = "Initial";
  const render = (svgShapes: boolean) =>
    root.render(
      <Scope values={{ svgShapes }}>
        <Card surface={{ shape: "corner" }}>
          <CodeBlock title="config.ts" code="const value = 42;" lineNumbers />
          <CodeEditor title="Editor" value={code} />
        </Card>
      </Scope>,
    );
  try {
    await act(() => render(true));
    const editor = container.querySelector("textarea");
    code = "Edited";
    await act(() => render(true));
    await act(() => container.querySelector<HTMLButtonElement>('[aria-label="Wrap lines"]')?.click());
    expect(container.querySelector("pre")?.hasAttribute("data-wrap")).toBe(true);
    await act(() => editor?.focus());
    await act(() => render(false));
    expect(container.querySelector("textarea") === editor).toBe(true);
    expect(editor?.value).toBe("Edited");
    expect(document.activeElement === editor).toBe(true);
    expect(container.querySelector("pre")?.hasAttribute("data-wrap")).toBe(true);
    expect(editor?.className).toBe("rk-code-editor-input");
  } finally {
    await dispose();
  }
});

test("image grid retains keyboard selection and opens through its existing callback", async () => {
  const { container, root, dispose } = mount();
  let opened = -1;
  const items = [
    { key: "one", src: "one.svg", alt: "One" },
    { key: "two", src: "two.svg", alt: "Two" },
  ];
  try {
    await act(() =>
      root.render(
        <ImageGrid
          items={items}
          selectable
          onOpen={(_, index) => {
            opened = index;
          }}
        />,
      ),
    );
    const options = container.querySelectorAll<HTMLElement>('[role="option"]');
    await act(() => options[0]?.focus());
    await act(() => options[0]?.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true })));
    expect(options[0]?.getAttribute("aria-selected")).toBe("true");
    await act(() => options[0]?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
    expect(opened).toBe(0);
  } finally {
    await dispose();
  }
});

test("log filtering preserves its native query and reports an empty result", async () => {
  const { container, root, dispose } = mount();
  try {
    await act(() =>
      root.render(
        <LogView
          lines={[
            { message: "Network ready", level: "info" },
            { message: "Timeout", level: "warn" },
          ]}
          query="unmatched"
          label="Profile log"
        />,
      ),
    );
    expect(container.textContent?.includes("No results")).toBe(true);
    expect(container.querySelector('[role="log"]')?.getAttribute("aria-label")).toBe("Profile log");
    expect(container.querySelector("input")?.value).toBe("unmatched");
  } finally {
    await dispose();
  }
});

test("lightbox navigation buttons bypass stage pointer capture and unmount closes its modal", async () => {
  const { container, root, dispose } = mount();
  let index = 0,
    captures = 0,
    closes = 0;
  try {
    await act(() =>
      root.render(
        <Lightbox
          images={[
            { src: "one.svg", alt: "One" },
            { src: "two.svg", alt: "Two" },
          ]}
          onClose={() => undefined}
          onIndexChange={(value) => {
            index = value;
          }}
        />,
      ),
    );
    const dialog = container.querySelector("dialog");
    const stage = container.querySelector<HTMLElement>(".rk-lightbox-stage");
    if (stage)
      stage.setPointerCapture = () => {
        captures++;
      };
    const next = container.querySelector<HTMLButtonElement>('[aria-label="Next"]');
    await act(() =>
      next?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0, pointerId: 1 })),
    );
    expect(captures).toBe(0);
    await act(() => next?.click());
    expect(index).toBe(1);
    if (dialog) {
      const close = dialog.close.bind(dialog);
      dialog.close = () => {
        closes++;
        close();
      };
    }
    await act(() => root.render(null));
    expect(closes).toBe(1);
    expect(dialog?.open).toBe(false);
  } finally {
    await dispose();
  }
});

test("follow-tail scrolling honors the appearance motion switch", async () => {
  const { container, root, dispose } = mount();
  const handle = createRef<StickToBottomHandle>();
  let behavior: ScrollBehavior | undefined;
  const render = (motion: "off" | "full") =>
    root.render(
      <Scope values={{ motion }}>
        <StickToBottom ref={handle}>
          <p>Latest event</p>
        </StickToBottom>
      </Scope>,
    );
  try {
    await act(() => render("off"));
    const viewport = container.querySelector<HTMLElement>(".rk-stick-viewport");
    if (viewport)
      viewport.scrollTo = (options?: ScrollToOptions | number) => {
        if (typeof options === "object") behavior = options.behavior;
      };
    await act(() => handle.current?.scrollToBottom(true));
    expect(behavior).toBe("auto");
    await act(() => render("full"));
    await act(() => handle.current?.scrollToBottom(true));
    expect(behavior).toBe("smooth");
  } finally {
    await dispose();
  }
});

test("text roles keep native tags, attributes and explicit typographic state", async () => {
  const { container, root, dispose } = mount();
  try {
    await act(() =>
      root.render(
        <Text as="p" family="mono" weight="semibold" italic lang="ru">
          Точные значения
        </Text>,
      ),
    );
    const text = container.querySelector("p");
    expect(text?.getAttribute("data-family")).toBe("mono");
    expect(text?.getAttribute("data-weight")).toBe("semibold");
    expect(text?.getAttribute("data-italic")).toBe("true");
    expect(text?.lang).toBe("ru");
    await act(() =>
      root.render(
        <Text as="p" family="display" italic={false}>
          Точные значения
        </Text>,
      ),
    );
    expect(container.querySelector("p") === text).toBe(true);
    expect(text?.getAttribute("data-italic")).toBe("false");
  } finally {
    await dispose();
  }
});

test("explicit card surfaces own material without leaking inverse ink; legacy variants remain available", async () => {
  const { container, root, dispose } = mount();
  try {
    await act(() => root.render(<Card variant="inverse">Readable content</Card>));
    const card = container.querySelector(".rk-card");
    expect(card?.getAttribute("data-variant")).toBe("inverse");
    await act(() =>
      root.render(
        <Card variant="inverse" surface={{ shape: "ticket" }}>
          Readable content
        </Card>,
      ),
    );
    expect(container.querySelector(".rk-card") === card).toBe(true);
    expect(card?.getAttribute("data-variant")).toBe("default");
    expect(card?.textContent).toBe("Readable content");
  } finally {
    await dispose();
  }
});

test("JSON copy actions distinguish values from paths and omit the redundant root path", async () => {
  const { container, root, dispose } = mount();
  const clipboard = navigator.clipboard;
  const original = clipboard.writeText;
  const written: string[] = [];
  clipboard.writeText = (text) => {
    written.push(text);
    return Promise.resolve();
  };
  try {
    await act(() => root.render(<JsonView data={{ host: "north" }} />));
    const rows = container.querySelectorAll<HTMLElement>('[role="treeitem"]');
    await act(() => rows[0]?.focus());
    expect(rows[0]?.querySelectorAll("button").length).toBe(1);
    expect(rows[0]?.querySelector('[aria-label="Copy path"]')).toBeNull();
    await act(() => {
      rows[0]?.querySelector<HTMLButtonElement>("button")?.click();
    });
    expect(written[0]).toBe(JSON.stringify({ host: "north" }, null, 2));
    await act(() => rows[1]?.focus());
    const value = rows[1]?.querySelector<HTMLButtonElement>('[aria-label="Copy value"]');
    const path = rows[1]?.querySelector<HTMLButtonElement>('[aria-label="Copy path"]');
    expect(value?.querySelector("svg")?.innerHTML === path?.querySelector("svg")?.innerHTML).toBe(false);
    await act(() => {
      path?.click();
    });
    expect(written[1]).toBe("$.host");
    expect(path?.hasAttribute("data-copied")).toBe(true);
    await act(() => {
      value?.click();
    });
    expect(written[2]).toBe('"north"');
  } finally {
    clipboard.writeText = original;
    await dispose();
  }
});
