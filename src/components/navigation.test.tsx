import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Tabs } from "./nav";
import { Tree } from "./tree";

const TAB_TAG = /<button[^>]*role="tab"[^>]*>/g;
const TREE_TAG = /<div[^>]*role="treeitem"[^>]*>/g;
const tabs = [
  { value: "locked", label: "Locked", disabled: true },
  { value: "first", label: "First" },
  { value: "last", label: "Last" },
];
const nodes = [
  { id: "alpha", label: "Alpha" },
  { id: "beta", label: "Beta" },
];

test("Tabs keep one enabled entry for disabled or missing selection, including the default", () => {
  for (const value of [undefined, "locked", "removed"]) {
    const tags = renderToStaticMarkup(<Tabs items={tabs} value={value} />).match(TAB_TAG) ?? [];
    const stops = tags.filter((tag) => tag.includes('tabindex="0"'));
    expect(stops).toHaveLength(1);
    expect(stops[0]).toContain('data-value="first"');
    if (value === undefined) expect(stops[0]).toContain('aria-selected="true"');
  }
  expect(
    renderToStaticMarkup(<Tabs items={[{ value: "locked", label: "Locked", disabled: true }]} />),
  ).not.toContain('tabindex="0"');
  expect(renderToStaticMarkup(<Tabs items={[]} />)).not.toContain('tabindex="0"');
});

test("Tree preserves entry when selection is filtered, collapsed or removed", () => {
  const filtered = renderToStaticMarkup(<Tree items={nodes} selected="alpha" filter="beta" />);
  const stops = (filtered.match(TREE_TAG) ?? []).filter((tag) => tag.includes('tabindex="0"'));
  expect(stops).toHaveLength(1);
  expect(stops[0]).toContain('data-id="beta"');
  expect(stops[0]).toContain('aria-selected="false"');
  const collapsed = renderToStaticMarkup(
    <Tree items={[{ id: "parent", label: "Parent", children: nodes }]} selected="alpha" />,
  );
  expect(collapsed.match(TREE_TAG)?.[0]).toContain('tabindex="0"');
  expect(renderToStaticMarkup(<Tree items={nodes} selected="removed" />).match(TREE_TAG)?.[0]).toContain(
    'tabindex="0"',
  );
  expect(renderToStaticMarkup(<Tree items={nodes} selected="alpha" filter="missing" />)).not.toContain(
    'tabindex="0"',
  );
});

test("Virtual Tree exposes a rendered entry even when selection is outside the viewport", () => {
  const items = Array.from({ length: 100 }, (_, i) => ({ id: `node-${i}`, label: `Node ${i}` }));
  const html = renderToStaticMarkup(<Tree items={items} height={120} selected="node-99" />);
  const stops = (html.match(TREE_TAG) ?? []).filter((tag) => tag.includes('tabindex="0"'));
  expect(stops).toHaveLength(1);
  expect(stops[0]).toContain('data-id="node-0"');
});
