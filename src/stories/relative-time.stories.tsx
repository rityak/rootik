import type { Story } from "@ladle/react";
import { useState } from "react";
import { Button, Card, KeyValue, RelativeTime, Stat, Timer } from "..";

export default { title: "Display" };

export const Times: Story = () => {
  const [loaded] = useState(() => Date.now());
  const [paused, setPaused] = useState(false);
  const [deadline, setDeadline] = useState(() => Date.now() + 12_000);
  const [ended, setEnded] = useState(false);
  return (
    <div className="story-col" style={{ maxWidth: 520 }}>
      <Card title="Relative timestamps keep themselves current">
        <KeyValue
          items={[
            { label: "Opened", value: <RelativeTime date={loaded} /> },
            { label: "Last sync", value: <RelativeTime date={loaded - 7 * 60_000} /> },
            { label: "Checkpoint", value: <RelativeTime date={loaded - 26 * 3_600_000} /> },
            { label: "Key expires", value: <RelativeTime date={loaded + 12 * 86_400_000} /> },
            { label: "Narrow", value: <RelativeTime date={loaded - 3 * 3_600_000} length="narrow" /> },
          ]}
        />
      </Card>
      <Card
        title="Timers"
        actions={
          <Button size="sm" onClick={() => setPaused((p) => !p)}>
            {paused ? "Resume" : "Pause"}
          </Button>
        }
      >
        <div className="story-row" style={{ gap: 40, alignItems: "flex-end" }}>
          <Stat label="Session" size="lg" value={<Timer since={loaded - 3_723_000} paused={paused} />} />
          <Stat label="Uptime" value={<Timer since={loaded - 5 * 86_400_000} format="units" />} />
          <Stat
            label={ended ? "Key rotated" : "Rotates in"}
            value={<Timer until={deadline} onEnd={() => setEnded(true)} />}
          />
          <Button
            size="sm"
            onClick={() => {
              setEnded(false);
              setDeadline(Date.now() + 12_000);
            }}
          >
            Restart
          </Button>
        </div>
      </Card>
    </div>
  );
};
