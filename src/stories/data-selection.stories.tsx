import type { Story } from "@ladle/react";
import { useState } from "react";
import { Badge, type Column, DataTable } from "..";

export default { title: "Data" };

interface Img {
  id: string;
  size: number;
  tags: number;
  status: "tagged" | "untagged" | "flagged";
}

const images: Img[] = Array.from({ length: 24 }, (_, i) => ({
  id: `img_${String(i + 1).padStart(4, "0")}.png`,
  size: 180 + ((i * 37) % 900),
  tags: (i * 7) % 23,
  status: i % 9 === 0 ? "flagged" : i % 4 === 0 ? "untagged" : "tagged",
}));

const columns: Column<Img>[] = [
  { key: "id", header: "File", mono: true, sortable: true },
  { key: "size", header: "KB", align: "end", sortable: true },
  { key: "tags", header: "Tags", align: "end", sortable: true },
  {
    key: "status",
    header: "Status",
    cell: (r) => (
      <Badge tone={r.status === "flagged" ? "warn" : r.status === "untagged" ? "neutral" : "success"}>
        {r.status}
      </Badge>
    ),
  },
];

export const RowSelection: Story = () => {
  const [picked, setPicked] = useState<string[]>(["img_0003.png"]);
  return (
    <div className="story-col" style={{ maxWidth: 620 }}>
      <div style={{ color: "var(--rk-text-2)" }}>
        {picked.length} selected — click selects one, Ctrl/⌘ toggles, Shift extends; checkboxes toggle. The
        table scrolls, so Tab reaches its scroll region.
      </div>
      <DataTable
        aria-label="Images"
        framed
        sticky
        density="compact"
        maxHeight={320}
        columns={columns}
        rows={images}
        rowKey={(r) => r.id}
        selection="multiple"
        selected={picked}
        onSelectedChange={setPicked}
      />
    </div>
  );
};
