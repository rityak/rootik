import type { Story } from "@ladle/react";
import { useEffect, useState } from "react";
import { Button, Card, formatBitrate, RollingNumber, Stat } from "..";

export default { title: "Display" };

export const Rolling: Story = () => {
  const [count, setCount] = useState(1284);
  const [speed, setSpeed] = useState(94.2e6);
  useEffect(() => {
    const id = setInterval(() => setSpeed((s) => Math.max(1e6, s + (Math.random() - 0.45) * 30e6)), 1400);
    return () => clearInterval(id);
  }, []);
  const rate = formatBitrate(speed);
  return (
    <div className="story-col" style={{ maxWidth: 560 }}>
      <Card title="Digits roll to the new value">
        <div className="story-row" style={{ alignItems: "flex-end", gap: 40 }}>
          <Stat label="Images tagged" size="lg" value={<RollingNumber value={count} />} />
          <Stat
            label="Download"
            size="lg"
            value={<RollingNumber value={Number(rate.value)} format={() => rate.value} />}
            unit={rate.unit}
          />
        </div>
      </Card>
      <div className="story-row">
        <Button onClick={() => setCount((c) => c + 1)}>+1</Button>
        <Button onClick={() => setCount((c) => c + 137)}>+137</Button>
        <Button onClick={() => setCount((c) => Math.max(0, c - 250))}>−250</Button>
        <Button onClick={() => setCount(98)}>Reset to 98</Button>
      </div>
    </div>
  );
};
