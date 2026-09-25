import type { Story } from "@ladle/react";
import { Card, formatBytes, Meter } from "..";

export default { title: "Display" };

const GB = 1024 ** 3;
const disk = [
  { label: "System", value: 38 * GB },
  { label: "Datasets", value: 212 * GB },
  { label: "Checkpoints", value: 96 * GB },
  { label: "Cache", value: 41 * GB },
];
const used = disk.reduce((n, s) => n + s.value, 0);

export const Meters: Story = () => (
  <div className="story-col" style={{ maxWidth: 520 }}>
    <Card title="Thresholds pick the tone">
      <div className="story-col">
        <Meter label="Disk C:" value={42} low={70} high={90} optimum={0} showValue />
        <Meter label="Disk D:" value={81} low={70} high={90} optimum={0} showValue />
        <Meter label="Disk E:" value={96} low={70} high={90} optimum={0} showValue />
        <Meter label="Battery" value={18} low={20} high={60} optimum={100} showValue size="sm" />
        <Meter label="Monthly traffic" value={620} max={1000} showValue="620 / 1000 GB" size="lg" />
      </div>
    </Card>
    <Card title="Sections: what fills the drive">
      <Meter
        label="Workspace volume"
        sections={disk}
        max={512 * GB}
        showValue={`${formatBytes(used).text} of ${formatBytes(512 * GB).text}`}
        size="lg"
      />
    </Card>
  </div>
);
