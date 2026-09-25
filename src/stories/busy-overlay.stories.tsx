import type { Story } from "@ladle/react";
import { useState } from "react";
import { BusyOverlay, Button, Card, KeyValue, Switch } from "..";

export default { title: "Data" };

export const Busy: Story = () => {
  const [busy, setBusy] = useState(true);
  const [blur, setBlur] = useState(false);
  return (
    <div className="story-col" style={{ maxWidth: 420 }}>
      <div className="story-row">
        <Switch label="Refetching" checked={busy} onChange={(e) => setBusy(e.target.checked)} />
        <Switch label="Blur" checked={blur} onChange={(e) => setBlur(e.target.checked)} />
      </div>
      <Card title="Node" padding="none">
        <BusyOverlay busy={busy} blur={blur} label="Updating…" style={{ padding: 16 }}>
          <div className="story-col">
            <KeyValue
              items={[
                { label: "Latency", value: "84 ms" },
                { label: "Traffic", value: "1.2 GB" },
                { label: "Uptime", value: "3d 4h" },
              ]}
            />
            <Button size="sm">Can't click me while busy</Button>
          </div>
        </BusyOverlay>
      </Card>
    </div>
  );
};
