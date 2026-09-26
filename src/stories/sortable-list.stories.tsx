import type { Story } from "@ladle/react";
import { useState } from "react";
import { Badge, SortableList } from "..";

export default { title: "Data" };

const NODES = [
  { id: "fra", city: "Frankfurt", ping: 18 },
  { id: "ams", city: "Amsterdam", ping: 24 },
  { id: "hel", city: "Helsinki", ping: 41 },
  { id: "nyc", city: "New York", ping: 96 },
];

export const SortableLists: Story = () => {
  const [nodes, setNodes] = useState(NODES);
  return (
    <div className="story-col" style={{ maxWidth: 360 }}>
      <SortableList
        aria-label="Failover order"
        items={nodes}
        getKey={(n) => n.id}
        getLabel={(n) => n.city}
        onReorder={setNodes}
        renderItem={(n) => (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{n.city}</span>
            <Badge size="sm">{n.ping} ms</Badge>
          </div>
        )}
      />
      <span style={{ color: "var(--rk-text-3)" }}>Order: {nodes.map((n) => n.id).join(" → ")}</span>
    </div>
  );
};
