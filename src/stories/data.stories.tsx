import type { Story } from "@ladle/react";
import { Box, File, FileImage, Folder, Layers } from "lucide-react";
import { useState } from "react";
import { Badge, Card, DataTable, IconButton, Table, Tree, type TreeNode } from "..";

export default { title: "Data" };

export const PlainTable: Story = () => (
  <Card padding="none" style={{ maxWidth: 640 }}>
    <Table>
      <thead>
        <tr>
          <th>Tag</th>
          <th style={{ textAlign: "end" }}>Count</th>
          <th style={{ textAlign: "end" }}>Share</th>
        </tr>
      </thead>
      <tbody>
        {[
          ["1girl", 812, "33.8%"],
          ["solo", 640, "26.6%"],
          ["long_hair", 402, "16.7%"],
          ["smile", 377, "15.7%"],
        ].map(([t, c, s]) => (
          <tr key={t}>
            <td>{t}</td>
            <td style={{ textAlign: "end" }}>{c}</td>
            <td style={{ textAlign: "end" }}>{s}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Card>
);

const nodes = Array.from({ length: 24 }, (_, i) => ({
  id: `n${i}`,
  name:
    ["JP · Tokyo", "DE · Frankfurt", "NL · Amsterdam", "US · Ashburn", "SG · Singapore"][i % 5] +
    ` 0${(i % 9) + 1}`,
  type: ["vless", "trojan", "hysteria2", "ss"][i % 4] as string,
  delay: i % 7 === 0 ? null : 40 + ((i * 37) % 260),
  traffic: (i * 7919) % 5000,
}));

export const Sortable: Story = () => {
  const [selected, setSelected] = useState<string | null>("n3");
  return (
    <Card padding="none" style={{ maxWidth: 720 }}>
      <DataTable
        sticky
        maxHeight={360}
        rows={nodes}
        rowKey={(r) => r.id}
        selectedKey={selected}
        onRowClick={(r) => setSelected(r.id)}
        defaultSort={{ key: "delay", dir: "asc" }}
        columns={[
          { key: "name", header: "Node", sortable: true },
          { key: "type", header: "Type", cell: (r) => <Badge size="sm">{r.type}</Badge> },
          {
            key: "delay",
            header: "Delay",
            sortable: true,
            align: "end",
            mono: true,
            cell: (r) =>
              r.delay === null ? (
                <Badge size="sm" tone="danger">
                  timeout
                </Badge>
              ) : (
                <span
                  style={{
                    color:
                      r.delay < 120
                        ? "var(--rk-success)"
                        : r.delay < 220
                          ? "var(--rk-warn)"
                          : "var(--rk-danger)",
                  }}
                >
                  {r.delay} ms
                </span>
              ),
          },
          {
            key: "traffic",
            header: "Traffic",
            sortable: true,
            align: "end",
            cell: (r) => `${(r.traffic / 1000).toFixed(1)} GB`,
          },
        ]}
      />
    </Card>
  );
};

const tree: TreeNode[] = [
  {
    id: "datasets",
    label: "datasets",
    icon: <Folder />,
    trailing: "3",
    children: [
      {
        id: "anima",
        label: "anima_v4",
        icon: <Folder />,
        trailing: "2,412",
        children: [
          { id: "a1", label: "0001.png", icon: <FileImage /> },
          { id: "a2", label: "0001.txt", icon: <File /> },
          { id: "a3", label: "0002.png", icon: <FileImage /> },
        ],
      },
      { id: "seed", label: "seed2", icon: <Folder />, trailing: "812", lazy: true },
      { id: "empty", label: "empty", icon: <Folder />, disabled: true },
    ],
  },
  {
    id: "model",
    label: "model.safetensors",
    icon: <Box />,
    children: [
      { id: "unet", label: "unet", icon: <Layers />, trailing: "2.6B" },
      { id: "te", label: "text_encoder", icon: <Layers />, trailing: "123M" },
    ],
  },
];

export const TreeView: Story = () => {
  const [selected, setSelected] = useState<string | null>("a1");
  return (
    <Card
      style={{ maxWidth: 320 }}
      title="Files"
      actions={<IconButton size="sm" icon={<Folder />} label="Open" />}
    >
      <Tree
        aria-label="Files"
        items={tree}
        selected={selected}
        onSelect={setSelected}
        defaultExpanded={["datasets", "anima"]}
      />
    </Card>
  );
};
