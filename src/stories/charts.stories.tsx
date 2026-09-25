import type { Story } from "@ladle/react";
import { BarChart, Card, Gauge, Legend, LineChart, Sparkline, Stat, seriesColor } from "..";

export default { title: "Charts" };

const week = [
  { label: "Mon", value: 1320 },
  { label: "Tue", value: 1640 },
  { label: "Wed", value: 2140 },
  { label: "Thu", value: 1210 },
  { label: "Fri", value: 980 },
  { label: "Sat", value: 1560 },
  { label: "Sun", value: 890 },
];

export const Bars: Story = () => (
  <div className="story-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))" }}>
    <Card title="Hatch (signature)" description="Idle bars hatched, highlight in accent">
      <BarChart data={week} variant="hatch" highlight="Tue" reference={{ value: 1800 }} />
    </Card>
    <Card title="Solid" description="Single series, one hue">
      <BarChart data={week} labels="all" />
    </Card>
    <Card title="Horizontal" description="Long category labels">
      <BarChart
        orientation="horizontal"
        highlight="long_hair"
        data={[
          { label: "1girl", value: 812 },
          { label: "solo", value: 640 },
          { label: "long_hair", value: 402 },
          { label: "smile", value: 377 },
          { label: "looking_at_viewer", value: 301 },
          { label: "outdoors", value: 91 },
        ]}
      />
    </Card>
  </div>
);

const steps = Array.from({ length: 30 }, (_, i) => i);
const up = steps.map((i) => 20 + Math.sin(i / 3) * 8 + i * 1.3);
const down = steps.map((i) => 12 + Math.cos(i / 4) * 5 + i * 0.4);

export const Lines: Story = () => (
  <div className="story-col" style={{ maxWidth: 760 }}>
    <Card title="Traffic" description="Upload vs download, MB/s">
      <LineChart
        area
        labels={steps.map((i) => `${i}s`)}
        series={[
          { name: "Download", data: up },
          { name: "Upload", data: down },
        ]}
      />
    </Card>
    <Card title="Loss" description="Gaps are drawn as breaks">
      <LineChart
        zero={false}
        format={(v) => v.toFixed(2)}
        series={[{ name: "loss", data: [0.9, 0.7, 0.6, null, 0.45, 0.41, 0.38, 0.36, 0.35] }]}
      />
    </Card>
  </div>
);

export const Figures: Story = () => (
  <div className="story-grid">
    <Card>
      <Stat label="Throughput" value="2,140" unit="img/day" delta={24}>
        <Sparkline data={week.map((d) => d.value)} />
      </Stat>
    </Card>
    <Card>
      <div style={{ display: "grid", placeItems: "center" }}>
        <Gauge value={860} max={1000} unit="Wh" label="stored" size={200} />
      </div>
    </Card>
    <Card>
      <div style={{ display: "grid", placeItems: "center" }}>
        <Gauge
          value={28}
          max={100}
          unit="%"
          label="VRAM"
          size={160}
          segments={28}
          color="var(--rk-chart-1)"
        />
      </div>
    </Card>
    <Card title="Categorical order">
      <Legend
        items={Array.from({ length: 6 }, (_, i) => ({ label: `Series ${i + 1}`, color: seriesColor(i) }))}
      />
    </Card>
  </div>
);
