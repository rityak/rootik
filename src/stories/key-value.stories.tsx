import type { Story } from "@ladle/react";
import { Card, KeyValue } from "..";

export default { title: "Display" };

export const CopyableValues: Story = () => (
  <Card title="Node n3-fra-01" style={{ maxWidth: 420 }}>
    <KeyValue
      items={[
        { label: "Node ID", value: "n3-fra-01", copy: true },
        { label: "Address", value: "94.130.12.7:443", copy: true },
        {
          label: "Public key",
          value: (
            <span className="rk-truncate rk-mono" style={{ display: "block" }}>
              Zb3pX9qLr2mT8vK4wYc1NhU7sE5aD0fGjB6oR3iP8lQ=
            </span>
          ),
          copy: "Zb3pX9qLr2mT8vK4wYc1NhU7sE5aD0fGjB6oR3iP8lQ=",
        },
        { label: "Protocol", value: "VLESS Reality" },
        { label: "Uptime", value: "18 d 4 h" },
      ]}
    />
  </Card>
);
