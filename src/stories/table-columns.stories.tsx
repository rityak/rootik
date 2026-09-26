import type { Story } from "@ladle/react";
import { useState } from "react";
import { Card, type Column, ColumnsMenu, DataTable } from "..";

export default { title: "Data" };

interface Run {
  id: string;
  name: string;
  model: string;
  steps: number;
  loss: number;
  lr: string;
  batch: number;
  started: string;
}

const RUNS: Run[] = Array.from({ length: 8 }, (_, i) => ({
  id: `r${i}`,
  name: `anima-v${4 + i}`,
  model: ["SDXL", "Flux", "SD 1.5"][i % 3] as string,
  steps: 2000 + i * 750,
  loss: Number((0.42 - i * 0.03).toFixed(3)),
  lr: ["1e-4", "5e-5", "2e-4"][i % 3] as string,
  batch: [4, 8, 16][i % 3] as number,
  started: `2026-09-${String(10 + i).padStart(2, "0")} 14:0${i}`,
}));

export const ColumnsAndEditing: Story = () => {
  const [rows, setRows] = useState(RUNS);
  const [hidden, setHidden] = useState<string[]>(["lr"]);
  const columns: Column<Run>[] = [
    {
      key: "name",
      header: "Run",
      value: (r) => r.name,
      sortable: true,
      hideable: false,
      onEdit: (r, name) => setRows((list) => list.map((x) => (x.id === r.id ? { ...x, name } : x))),
    },
    { key: "model", header: "Model", value: (r) => r.model, sortable: true },
    { key: "steps", header: "Steps", value: (r) => r.steps, sortable: true, align: "end", mono: true },
    { key: "loss", header: "Loss", value: (r) => r.loss, sortable: true, align: "end", mono: true },
    { key: "lr", header: "LR", value: (r) => r.lr, mono: true },
    { key: "batch", header: "Batch", value: (r) => r.batch, align: "end" },
    { key: "started", header: "Started", value: (r) => r.started, mono: true },
  ];
  return (
    <Card
      title="Runs"
      description="Pinned first column, click a name to rename, columns menu on the right"
      actions={<ColumnsMenu columns={columns} hidden={hidden} onHiddenChange={setHidden} />}
      padding="none"
      style={{ maxWidth: 560 }}
    >
      <DataTable
        aria-label="Runs"
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        hiddenColumns={hidden}
        pinFirstColumn
        selection="multiple"
        style={{ minWidth: 820 }}
      />
    </Card>
  );
};
