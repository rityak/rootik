import type { Story } from "@ladle/react";
import { Globe } from "lucide-react";
import { useState } from "react";
import { Card, EmptyState, Item, ItemGroup, KeyValue, MasterDetail } from "..";

export default { title: "Layout" };

const NODES = [
  { id: "fra", city: "Frankfurt", host: "n3-fra-01", proto: "WireGuard", ping: 18 },
  { id: "ams", city: "Amsterdam", host: "n1-ams-02", proto: "VLESS Reality", ping: 24 },
  { id: "hel", city: "Helsinki", host: "n2-hel-01", proto: "WireGuard", ping: 41 },
  { id: "nyc", city: "New York", host: "n7-nyc-03", proto: "Hysteria 2", ping: 96 },
];

export const MasterDetails: Story = () => {
  const [id, setId] = useState<string | null>(null);
  const node = NODES.find((n) => n.id === id);
  return (
    <div
      style={{
        resize: "horizontal",
        overflow: "auto",
        width: 860,
        minWidth: 320,
        maxWidth: "100%",
        paddingBottom: 12,
      }}
    >
      <MasterDetail
        onBack={() => setId(null)}
        list={
          <Card padding="sm" title="Nodes">
            <ItemGroup>
              {NODES.map((n) => (
                <Item
                  key={n.id}
                  icon={<Globe />}
                  title={n.city}
                  description={n.host}
                  meta={`${n.ping} ms`}
                  selected={n.id === id}
                  onClick={() => setId(n.id)}
                />
              ))}
            </ItemGroup>
          </Card>
        }
        empty={
          <Card>
            <EmptyState size="sm" title="Select a node" hint="Its details show up here." />
          </Card>
        }
        detail={
          node && (
            <Card title={node.city} description={node.host}>
              <KeyValue
                items={[
                  { label: "Protocol", value: node.proto },
                  { label: "Latency", value: `${node.ping} ms` },
                  { label: "Host", value: node.host, copy: true },
                ]}
              />
            </Card>
          )
        }
      />
      <p style={{ color: "var(--rk-text-3)" }}>Drag the bottom-right corner below 640px to stack.</p>
    </div>
  );
};
