import type { Story } from "@ladle/react";
import { useMemo, useState } from "react";
import { Badge, Card, DataTable } from "..";

export default { title: "Data" };

interface Sample {
  id: string;
  file: string;
  width: number;
  height: number;
  score: number;
  split: string;
}

const makeRows = (count: number): Sample[] =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i),
    file: `img_${String(i + 1).padStart(6, "0")}.webp`,
    width: 512 + ((i * 37) % 8) * 128,
    height: 512 + ((i * 53) % 8) * 128,
    score: Math.round(((i * 7919) % 1000) / 10) / 10,
    split: ["train", "train", "train", "val", "test"][i % 5] as string,
  }));

export const VirtualRows: Story = () => {
  const rows = useMemo(() => makeRows(50_000), []);
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div className="story-col" style={{ maxWidth: 820 }}>
      <p style={{ margin: 0, color: "var(--rk-text-3)" }}>
        50 000 rows, only the ones in view are mounted. Sort, select (Shift ranges across unmounted rows),
        resize columns. {selected.length > 0 && `${selected.length} selected.`}
      </p>
      <Card padding="none">
        <DataTable
          aria-label="Dataset samples"
          virtual
          maxHeight={420}
          zebra
          density="compact"
          resizable
          selection="multiple"
          selected={selected}
          onSelectedChange={setSelected}
          rows={rows}
          rowKey={(r) => r.id}
          columns={[
            { key: "file", header: "File", sortable: true, mono: true },
            {
              key: "size",
              header: "Size",
              align: "end",
              mono: true,
              value: (r) => r.width * r.height,
              sortable: true,
              cell: (r) => `${r.width}×${r.height}`,
            },
            { key: "score", header: "Aesthetic", sortable: true, align: "end" },
            {
              key: "split",
              header: "Split",
              cell: (r) => (
                <Badge size="sm" tone={r.split === "train" ? "neutral" : r.split === "val" ? "info" : "warn"}>
                  {r.split}
                </Badge>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

interface Node {
  id: string;
  name: string;
  items: number;
  children?: Node[];
}

const TREE: Node[] = Array.from({ length: 200 }, (_group, a) => ({
  id: `g${a}`,
  name: `group_${a + 1}`,
  items: 50,
  children: Array.from({ length: 50 }, (_item, b) => ({
    id: `g${a}.${b}`,
    name: `item_${a + 1}.${b + 1}`,
    items: 0,
  })),
}));

/** Tree rows + virtualization: keyboard focus follows into rows that weren't mounted yet. */
export const VirtualTreeRows: Story = () => (
  <Card padding="none" style={{ maxWidth: 560 }}>
    <DataTable
      aria-label="Groups"
      virtual
      maxHeight={360}
      density="compact"
      rows={TREE}
      rowKey={(r) => r.id}
      getChildren={(r) => r.children}
      defaultExpanded={["g0", "g1", "g2", "g3"]}
      columns={[
        { key: "name", header: "Name", mono: true },
        { key: "items", header: "Items", align: "end" },
      ]}
    />
  </Card>
);
