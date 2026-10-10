import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ru } from "../labels/ru";
import { RootikProvider } from "../theme/provider";
import { DataTable, defineColumns } from "./data";

test("legacy object cells cannot crash React; explicit renderers and scalar columns keep working", () => {
  const row = { id: "one", name: "First", meta: { count: 3 }, enabled: true };
  const columns = defineColumns<typeof row>()([
    { key: "name", header: "Name" },
    { key: "meta", header: "Count", cell: (item) => item.meta.count },
    { key: "computed", header: "Computed", value: (item) => item.meta.count * 2 },
  ]);
  const html = renderToStaticMarkup(<DataTable rows={[row]} rowKey={(item) => item.id} columns={columns} />);
  expect(html).toContain("First");
  expect(html).toContain(">3<");
  expect(html).toContain(">6<");
  expect(() =>
    renderToStaticMarkup(
      <DataTable rows={[row]} rowKey={(item) => item.id} columns={[{ key: "meta", header: "Meta" }]} />,
    ),
  ).not.toThrow();
});

test("DataTable translates its default empty copy and preserves an explicit empty override", () => {
  const props = { rows: [] as { id: string }[], rowKey: (item: { id: string }) => item.id, columns: [] };
  expect(
    renderToStaticMarkup(
      <RootikProvider labels={ru}>
        <DataTable {...props} />
      </RootikProvider>,
    ),
  ).toContain(ru.noData);
  expect(renderToStaticMarkup(<DataTable {...props} empty="Custom empty" />)).toContain("Custom empty");
  expect(renderToStaticMarkup(<DataTable {...props} empty={null} />)).not.toContain("No data");
});
