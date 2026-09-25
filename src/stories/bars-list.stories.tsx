import type { Story } from "@ladle/react";
import { useState } from "react";
import { BarsList, Card } from "..";

export default { title: "Charts" };

const TAGS = [
  { name: "1girl", value: 812 },
  { name: "solo", value: 640 },
  { name: "long_hair", value: 402 },
  { name: "smile", value: 377 },
  { name: "looking_at_viewer", value: 344 },
  { name: "blush", value: 201 },
  { name: "short_hair", value: 176 },
  { name: "open_mouth", value: 150 },
  { name: "bangs", value: 132 },
];

export const BarsLists: Story = () => {
  const [picked, setPicked] = useState("long_hair");
  return (
    <div className="story-row" style={{ alignItems: "flex-start" }}>
      <Card
        title="Top tags"
        description={`Top 6 + Other; click a row (picked: ${picked})`}
        style={{ width: 380 }}
      >
        <BarsList
          data={TAGS}
          limit={6}
          showPercent
          highlight={[picked]}
          onItemClick={(r) => setPicked(r.name)}
        />
      </Card>
      <Card title="Traffic by node" style={{ width: 340 }}>
        <BarsList
          keepOrder
          valueFormat={(v) => `${v.toFixed(1)} GB`}
          data={[
            { name: "JP · Tokyo 01", value: 12.4 },
            { name: "DE · Frankfurt 02", value: 8.1 },
            { name: "NL · Amsterdam 01", value: 3.9 },
            { name: "US · Ashburn 03", value: 0.6 },
          ]}
        />
      </Card>
    </div>
  );
};
