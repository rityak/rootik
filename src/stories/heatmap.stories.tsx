import type { Story } from "@ladle/react";
import { Card, Heatmap } from "..";

export default { title: "Charts" };

const tags = [
  "1girl",
  "solo",
  "long hair",
  "smile",
  "blue eyes",
  "school uniform",
  "outdoors",
  "cherry blossoms",
];

// deterministic co-occurrence-like matrix: symmetric, strong diagonal, a couple of empty pairs
const noise = (i: number) => {
  const x = Math.sin(i * 91.7) * 1e4;
  return x - Math.floor(x);
};
const matrix = tags.map((_, r) =>
  tags.map((__, c) => {
    if (r === c) return null;
    if ((r === 6 && c === 4) || (r === 4 && c === 6)) return null;
    const a = Math.min(r, c);
    const b = Math.max(r, c);
    return Math.round(noise(a * 8 + b) ** 1.6 * 4200 + (a < 2 ? 1800 : 0));
  }),
);

const hours = Array.from({ length: 24 }, (_, h) => `${h}`);
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const activity = days.map((_, d) =>
  hours.map((h) =>
    Math.round(
      Math.max(
        0,
        Math.sin(((Number(h) - 6) / 24) * Math.PI * 2) * 40 +
          noise(d * 24 + Number(h)) * 30 +
          (d > 4 ? -10 : 10),
      ),
    ),
  ),
);

export const Heatmaps: Story = () => (
  <div className="story-col" style={{ maxWidth: 640 }}>
    <Card title="Tag co-occurrence" description="Images carrying both tags; diagonal has no data">
      <Heatmap rows={tags} columns={tags} values={matrix} label="Tag co-occurrence" />
    </Card>
    <Card title="Connections by hour">
      <Heatmap
        rows={days}
        columns={hours}
        values={activity}
        label="Connections by hour"
        format={(v) => `${v}`}
      />
    </Card>
    <Card title="Small matrix with values">
      <Heatmap
        rows={["cat", "dog", "fox"]}
        columns={["cat", "dog", "fox"]}
        values={[
          [0.92, 0.05, 0.03],
          [0.07, 0.88, 0.05],
          [0.11, 0.09, 0.8],
        ]}
        format={(v) => v.toFixed(2)}
        showValues
        min={0}
        max={1}
        label="Confusion matrix"
        style={{ maxWidth: 280 }}
      />
    </Card>
  </div>
);
