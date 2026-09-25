import type { Story } from "@ladle/react";
import { useState } from "react";
import { Badge, Button, Card, type ColumnWidths, DataTable } from "..";

export default { title: "Data" };

const files = Array.from({ length: 30 }, (_, i) => ({
  id: `f${i}`,
  name: `${["portrait", "landscape", "closeup", "full_body", "street"][i % 5]}_${String(i + 1).padStart(4, "0")}.png`,
  size: `${1024 + ((i * 131) % 1024)}×${768 + ((i * 97) % 768)}`,
  caption: [
    "1girl, solo, long hair, looking at viewer, smile, outdoors, cherry blossoms",
    "mountain lake at sunrise, mist, pine forest, reflection",
    "close-up of an eye, macro, detailed iris",
    "full body, standing, city street at night, neon lights, rain",
    "street market, crowd, afternoon light",
  ][i % 5] as string,
  tags: 8 + ((i * 7) % 30),
}));

export const ResizableColumns: Story = () => {
  const [widths, setWidths] = useState<ColumnWidths | null>(null);
  return (
    <div className="story-col" style={{ maxWidth: 900 }}>
      <p style={{ margin: 0, color: "var(--rk-text-3)" }}>
        Drag a header edge, or focus it and use ←/→ (Shift = 50px), Home/End; double-click or Enter fits the
        content. Widths persist in localStorage (<code>persistWidths</code>).
      </p>
      <Card padding="none">
        <DataTable
          resizable
          persistWidths="story-dataset-files"
          sticky
          maxHeight={380}
          selection="multiple"
          rows={files}
          rowKey={(r) => r.id}
          onColumnWidthsChange={setWidths}
          columns={[
            { key: "name", header: "File", sortable: true, mono: true, minWidth: 120 },
            { key: "size", header: "Size", mono: true, align: "end" },
            { key: "caption", header: "Caption" },
            {
              key: "tags",
              header: "Tags",
              sortable: true,
              align: "end",
              resizable: false,
              cell: (r) => <Badge size="sm">{r.tags}</Badge>,
            },
          ]}
        />
      </Card>
      <div className="story-row">
        <code style={{ color: "var(--rk-text-3)" }}>{widths ? JSON.stringify(widths) : "auto layout"}</code>
      </div>
    </div>
  );
};

export const ControlledWidths: Story = () => {
  const [widths, setWidths] = useState<ColumnWidths | null>({ name: 220, size: 110, caption: 320 });
  return (
    <div className="story-col" style={{ maxWidth: 900 }}>
      <div className="story-row">
        <Button size="sm" onClick={() => setWidths(null)}>
          Reset to auto
        </Button>
      </div>
      <Card padding="none">
        <DataTable
          resizable
          rows={files.slice(0, 6)}
          rowKey={(r) => r.id}
          columnWidths={widths}
          onColumnWidthsChange={setWidths}
          columns={[
            { key: "name", header: "File", mono: true },
            { key: "size", header: "Size", mono: true, align: "end" },
            { key: "caption", header: "Caption" },
          ]}
        />
      </Card>
    </div>
  );
};
