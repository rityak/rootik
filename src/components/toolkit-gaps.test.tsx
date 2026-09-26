import { expect, test } from "bun:test";
import { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ru, ruTranslate } from "../labels/ru";
import { THEMES } from "../theme/schema";
import { CodeEditor } from "./code-block";
import { DataTable } from "./data";
import { TitleBar } from "./layout";
import { filterLog } from "./log-view";
import { Dock } from "./nav";
import { PowerButton } from "./power-button";
import { Select } from "./select";
import { Text } from "./text";

test("Text exposes shared tone, size and truncation", () => {
  const html = renderToStaticMarkup(
    <Text as="p" tone="muted" size="sm" truncate>
      Hint
    </Text>,
  );
  expect(html).toContain('class="rk-text rk-truncate"');
  expect(html).toContain('data-text-tone="muted"');
});

test("TitleBar renders restore state and accepts a ref", () => {
  const html = renderToStaticMarkup(
    <TitleBar ref={createRef<HTMLElement>()} maximized onMaximize={() => undefined} />,
  );
  expect(html).toContain('aria-label="Restore"');
  expect(html).toContain('title="Restore"');
});

test("PowerButton supports compact danger state", () => {
  const html = renderToStaticMarkup(<PowerButton label="Service" size="xs" tone="danger" on />);
  expect(html).toContain('data-size="xs"');
  expect(html).toContain('data-tone="danger"');
});

test("DataTable forwards native row attributes", () => {
  const html = renderToStaticMarkup(
    <DataTable
      columns={[{ key: "name", header: "Name" }]}
      rows={[{ id: "a", name: "Alpha" }]}
      rowKey={(row) => row.id}
      rowProps={() => ({ className: "custom-row", "data-kind": "node" })}
    />,
  );
  expect(html).toContain('class="custom-row"');
  expect(html).toContain('data-kind="node"');
});

test("Dock exposes a tab contract when requested", () => {
  const html = renderToStaticMarkup(
    <Dock
      mode="tabs"
      value="logs"
      items={[{ value: "logs", label: "Logs", icon: "L", id: "logs-tab", controls: "logs-panel" }]}
    />,
  );
  expect(html).toContain('role="tablist"');
  expect(html).toContain('role="tab"');
  expect(html).toContain('aria-controls="logs-panel"');
  expect(html).toContain('aria-selected="true"');
});

test("Select supports groups, null and values outside options", () => {
  const html = renderToStaticMarkup(
    <Select
      clearable
      value="custom"
      renderValue={(value) => `External: ${value}`}
      options={[
        {
          label: "Servers",
          options: [{ value: "local", label: "Local" }],
        },
      ]}
    />,
  );
  expect(html).toContain("External: custom");
  expect(html).toContain("<fieldset");
  expect(html).toContain("Servers");
});

test("Russian labels and appearance translations are ready to import", () => {
  expect(ru.close).toBe("Закрыть");
  expect(ru.none).toBe("— нет —");
  expect(ruTranslate("appearance.color.title", "Color")).toBe("Цвет");
});

test("named themes and the lightweight code editor are public primitives", () => {
  expect(THEMES.ocean.material).toBe("frost");
  const html = renderToStaticMarkup(<CodeEditor defaultValue="const ready = true;" />);
  expect(html).toContain("rk-code-editor-theme");
  expect(html).toContain("const ready = true;");
});

test("LogView can hide unlevelled raw output", () => {
  const lines = [{ message: "raw" }, { level: "error" as const, message: "boom" }];
  expect(filterLog(lines, null, null, false)).toEqual([1]);
});
