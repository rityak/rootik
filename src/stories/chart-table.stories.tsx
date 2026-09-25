import type { Story } from "@ladle/react";
import { BarChart, Card, LineChart } from "..";

export default { title: "Charts" };

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const TableViews: Story = () => (
  <div className="story-col" style={{ maxWidth: 620 }}>
    <Card title="Images tagged per day">
      <BarChart
        tableView
        aria-label="Images tagged per day"
        highlight="Fri"
        data={days.map((d, i) => ({ label: d, value: [820, 1210, 990, 1430, 1810, 640, 520][i] ?? 0 }))}
      />
    </Card>
    <Card title="Traffic, GB">
      <LineChart
        tableView
        aria-label="Traffic by day"
        labels={days}
        series={[
          { name: "Download", data: [12.4, 18.1, 9.8, 22.5, 30.2, 41.0, 35.7] },
          { name: "Upload", data: [2.1, 3.4, null, 4.2, 6.8, 5.1, 4.4] },
        ]}
        format={(v) => v.toFixed(1)}
      />
    </Card>
  </div>
);
