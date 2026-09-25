import type { Story } from "@ladle/react";
import { Box, Layers } from "lucide-react";
import { useState } from "react";
import { Badge, Card, DataTable } from "..";

export default { title: "Data" };

interface Tensor {
  name: string;
  path: string;
  shape?: string;
  dtype?: string;
  params: number;
  children?: Tensor[];
}

const block = (path: string, i: number): Tensor => ({
  name: `blocks.${i}`,
  path: `${path}.blocks.${i}`,
  params: 7_080_960,
  children: [
    {
      name: "attn",
      path: `${path}.blocks.${i}.attn`,
      params: 4_722_432,
      children: [
        {
          name: "to_q.weight",
          path: `${path}.blocks.${i}.attn.to_q`,
          shape: "1280×1280",
          dtype: "bf16",
          params: 1_638_400,
        },
        {
          name: "to_k.weight",
          path: `${path}.blocks.${i}.attn.to_k`,
          shape: "1280×640",
          dtype: "bf16",
          params: 819_200,
        },
        {
          name: "to_v.weight",
          path: `${path}.blocks.${i}.attn.to_v`,
          shape: "1280×640",
          dtype: "bf16",
          params: 819_200,
        },
        {
          name: "to_out.weight",
          path: `${path}.blocks.${i}.attn.to_out`,
          shape: "1280×1130",
          dtype: "bf16",
          params: 1_445_632,
        },
      ],
    },
    { name: "norm.weight", path: `${path}.blocks.${i}.norm`, shape: "1280", dtype: "fp32", params: 1280 },
    {
      name: "ff.weight",
      path: `${path}.blocks.${i}.ff`,
      shape: "1280×1843",
      dtype: "bf16",
      params: 2_357_248,
    },
  ],
});

const MODEL: Tensor[] = [
  {
    name: "unet",
    path: "unet",
    params: 21_243_520,
    children: [block("unet", 0), block("unet", 1), block("unet", 2)],
  },
  {
    name: "text_encoder",
    path: "text_encoder",
    params: 1_310_720,
    children: [
      { name: "embeddings.weight", path: "te.emb", shape: "49408×768", dtype: "fp16", params: 1_310_720 },
    ],
  },
  { name: "logit_scale", path: "logit_scale", shape: "1", dtype: "fp32", params: 1 },
];

const fmt = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export const TreeRows: Story = () => {
  const [expanded, setExpanded] = useState<string[]>(["unet", "unet.blocks.0"]);
  return (
    <div className="story-col" style={{ maxWidth: 820 }}>
      <p style={{ margin: 0, color: "var(--rk-text-3)" }}>
        Tab into the table, ↑/↓ between rows, → expands / enters, ← collapses / goes to the parent. Siblings
        sort within their level.
      </p>
      <Card padding="none">
        <DataTable
          aria-label="Model tensors"
          density="compact"
          rows={MODEL}
          rowKey={(r) => r.path}
          getChildren={(r) => r.children}
          expanded={expanded}
          onExpandedChange={setExpanded}
          resizable
          columns={[
            {
              key: "name",
              header: "Tensor",
              sortable: true,
              mono: true,
              cell: (r) => (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {r.children ? <Layers size={14} opacity={0.6} /> : <Box size={14} opacity={0.6} />}
                  {r.name}
                </span>
              ),
            },
            { key: "shape", header: "Shape", mono: true },
            {
              key: "dtype",
              header: "Dtype",
              cell: (r) => (r.dtype ? <Badge size="sm">{r.dtype}</Badge> : null),
            },
            {
              key: "params",
              header: "Params",
              sortable: true,
              align: "end",
              value: (r) => r.params,
              cell: (r) => fmt.format(r.params),
            },
          ]}
        />
      </Card>
    </div>
  );
};

interface Folder {
  id: string;
  name: string;
  files: number;
  loaded?: Folder[];
}

/** Children load on expand: `hasChildren` shows the toggle, onExpandedChange fetches. */
export const LazyTreeRows: Story = () => {
  const [roots, setRoots] = useState<Folder[]>([
    { id: "/datasets", name: "datasets", files: 3 },
    { id: "/outputs", name: "outputs", files: 2 },
  ]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const load = (id: string) => {
    const attach = (list: Folder[]): Folder[] =>
      list.map((f) =>
        f.id === id
          ? {
              ...f,
              loaded: Array.from({ length: f.files }, (_, i) => ({
                id: `${id}/${f.name}-${i + 1}`,
                name: `${f.name}-${i + 1}`,
                files: i === 0 ? 2 : 0,
              })),
            }
          : { ...f, loaded: f.loaded && attach(f.loaded) },
      );
    setTimeout(() => setRoots((r) => attach(r)), 300);
  };
  return (
    <Card padding="none" style={{ maxWidth: 520 }}>
      <DataTable
        aria-label="Folders"
        rows={roots}
        rowKey={(r) => r.id}
        getChildren={(r) => r.loaded}
        hasChildren={(r) => r.files > 0}
        expanded={expanded}
        onExpandedChange={(next) => {
          for (const id of next) if (!expanded.includes(id)) load(id);
          setExpanded(next);
        }}
        columns={[
          { key: "name", header: "Folder", mono: true },
          { key: "files", header: "Items", align: "end" },
        ]}
      />
    </Card>
  );
};
