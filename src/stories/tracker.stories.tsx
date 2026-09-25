import type { Story } from "@ladle/react";
import { Card, Tracker, type TrackerItem } from "..";

export default { title: "Display" };

// deterministic pseudo-random so the story looks the same on every load
const noise = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const day = (i: number) =>
  new Date(Date.UTC(2026, 5, 27 + i)).toLocaleDateString("en", { month: "short", day: "numeric" });

const uptime: TrackerItem[] = Array.from({ length: 90 }, (_, i) => {
  if (i < 6) return { tone: "idle", label: `${day(i)} — no data` };
  const r = noise(i);
  const pct = r > 0.97 ? 91.2 : r > 0.9 ? 99.1 : 100;
  return {
    tone: pct < 95 ? "danger" : pct < 100 ? "warn" : "success",
    label: `${day(i)} — ${pct}% uptime`,
  };
});

const latency: TrackerItem[] = Array.from({ length: 48 }, (_, i) => {
  const ms = Math.round(38 + noise(i + 7) ** 3 * 110);
  return { tone: ms > 110 ? "danger" : ms > 80 ? "warn" : "success", label: `${i % 24}:00 — ${ms} ms` };
});

export const Trackers: Story = () => (
  <div className="story-col" style={{ maxWidth: 640 }}>
    <Card title="Node health">
      <div className="story-col">
        <Tracker
          label="n3-fra-01 · Frankfurt"
          summary="99.62% uptime"
          items={uptime}
          start="90 days ago"
          end="Today"
        />
        <Tracker label="Latency, last 48 h" summary="p95 104 ms" items={latency} size="sm" />
      </div>
    </Card>
  </div>
);
