import type { Story } from "@ladle/react";
import {
  BulletChart,
  Card,
  DonutChart,
  Histogram,
  LineChart,
  ScatterChart,
  StackedBarChart,
  Treemap,
  WaffleChart,
} from "..";

export default { title: "Charts" };

// deterministic noise, so stories look the same on every load
const rand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
};
const normal = (r: () => number) => Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());

const r1 = rand(7);
const aesthetic = Array.from({ length: 2400 }, () => Math.min(10, Math.max(0, 5.6 + normal(r1) * 1.3)));
const r2 = rand(11);
const loss = Array.from({ length: 400 }, (_, i) => 0.3 + 0.9 * Math.exp(-i / 70) + normal(r2) * 0.03);
const val = loss.map((v, i) => (i % 10 === 0 ? v + 0.05 : null));

export const Histograms: Story = () => (
  <div className="story-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))" }}>
    <Card title="Aesthetic score" description="2,400 images, auto bins">
      <Histogram values={aesthetic} format={(n) => String(n)} />
    </Card>
    <Card title="Fixed domain, hatch" description="0–10 in 20 bins, table view">
      <Histogram
        values={aesthetic}
        bins={20}
        domain={[0, 10]}
        variant="hatch"
        tableView
        aria-label="Aesthetic score"
      />
    </Card>
  </div>
);

export const Brush: Story = () => (
  <Card
    title="Training loss"
    description="400 steps; drag the thumbs or use arrow keys to zoom"
    style={{ maxWidth: 720 }}
  >
    <LineChart
      brush
      defaultRange={[0, 120]}
      series={[
        { name: "train", data: loss },
        { name: "val", data: val },
      ]}
      labels={loss.map((_, i) => String(i * 50))}
      format={(n) => n.toFixed(2)}
      zero={false}
    />
  </Card>
);

const grid = { gridTemplateColumns: "repeat(auto-fill, minmax(min(380px, 100%), 1fr))" };

export const PartOfWhole: Story = () => (
  <div className="story-grid" style={grid}>
    <Card title="Traffic by protocol" description="Stacked columns, table view">
      <StackedBarChart
        tableView
        aria-label="Traffic by protocol"
        categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
        series={[
          { name: "VLESS", data: [12, 18, 15, 22, 30, 26, 24] },
          { name: "Hysteria 2", data: [6, 8, 7, 9, 12, 10, 8] },
          { name: "WireGuard", data: [3, 2, 4, 3, 5, 6, 4] },
        ]}
        format={(n) => `${n} GB`}
      />
    </Card>
    <Card title="Composition" description="normalize — each column is 100%">
      <StackedBarChart
        normalize
        categories={["train", "val", "test"]}
        series={[
          { name: "portrait", data: [4200, 520, 480] },
          { name: "scenery", data: [2600, 300, 310] },
          { name: "other", data: [900, 140, 90] },
        ]}
      />
    </Card>
    <Card title="Disk usage" description="Hover a part or its legend row">
      <DonutChart
        label="GB used"
        data={[
          { label: "Images", value: 212 },
          { label: "Latents", value: 96 },
          { label: "Checkpoints", value: 58 },
          { label: "Logs", value: 6 },
        ]}
        tableView
      />
    </Card>
    <Card title="Tagging progress" description="Waffle: 100 cells, hatched rest">
      <WaffleChart
        total={48210}
        data={[
          { label: "Auto-tagged", value: 38100 },
          { label: "Reviewed", value: 7300 },
        ]}
      />
    </Card>
    <Card
      title="Dataset classes"
      description="Treemap; parts past 6 share one grey"
      style={{ gridColumn: "1 / -1" }}
    >
      <Treemap
        tableView
        aria-label="Dataset classes"
        data={[
          { label: "portrait", value: 5200 },
          { label: "scenery", value: 3210 },
          { label: "full body", value: 2400 },
          { label: "group", value: 1300 },
          { label: "animal", value: 900 },
          { label: "vehicle", value: 610 },
          { label: "food", value: 300 },
          { label: "text", value: 220 },
          { label: "abstract", value: 120 },
        ]}
      />
    </Card>
  </div>
);

export const Bullets: Story = () => (
  <Card title="Targets" style={{ maxWidth: 520 }}>
    <div className="story-col" style={{ gap: 18 }}>
      <BulletChart label="Throughput" value={742} target={800} ranges={[400, 700, 1000]} hint="img/min" />
      <BulletChart
        label="Tag coverage"
        value={96}
        target={90}
        ranges={[60, 85, 100]}
        format={(n) => `${n}%`}
      />
      <BulletChart label="Storage" value={372} max={500} target={450} hint="of 500 GB" />
    </div>
  </Card>
);

const r3 = rand(23);
const tags = Array.from({ length: 160 }, (_, i) => {
  const freq = Math.round(10 ** (1 + r3() * 4));
  return {
    x: freq,
    y: Math.min(1, Math.max(0.05, 0.35 + Math.log10(freq) * 0.12 + normal(r3) * 0.1)),
    label: `tag_${i}`,
  };
});

export const Scatter: Story = () => (
  <div className="story-grid" style={grid}>
    <Card title="Tag frequency vs confidence" description="Log x axis, hover a dot">
      <ScatterChart
        xScale="log"
        xLabel="Frequency"
        yLabel="Confidence"
        formatY={(n) => n.toFixed(2)}
        series={[
          { name: "general", points: tags.slice(0, 110) },
          { name: "character", points: tags.slice(110) },
        ]}
        tableView
      />
    </Card>
    <Card title="Linear" description="One series, no legend">
      <ScatterChart
        series={[{ name: "runs", points: tags.slice(0, 40).map((p, i) => ({ x: i, y: p.y })) }]}
      />
    </Card>
  </div>
);
