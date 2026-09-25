import type { Story } from "@ladle/react";
import { useState } from "react";
import { Badge, Card, ChipGroup, Scroller, Tabs } from "..";

export default { title: "Layout" };

const regions = [
  "All",
  "Europe",
  "North America",
  "Asia",
  "South America",
  "Oceania",
  "Africa",
  "Middle East",
];
const tabs = ["Overview", "Images", "Captions", "Tags", "Duplicates", "Exports", "History", "Settings"];

export const Scrolling: Story = () => {
  const [tab, setTab] = useState("Overview");
  return (
    <Card
      title="Phone width: the row scrolls, edges fade, arrows only where it can go"
      style={{ width: 360 }}
    >
      <div className="story-col">
        <Scroller>
          <ChipGroup
            aria-label="Region"
            single
            defaultValue={["All"]}
            options={regions.map((r) => ({ value: r, label: r }))}
          />
        </Scroller>
        <Scroller>
          <Tabs value={tab} onChange={setTab} items={tabs.map((t) => ({ value: t, label: t }))} />
        </Scroller>
        <Scroller style={{ gap: 6 }}>
          {Array.from({ length: 14 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static demo
            <Badge key={i} tone={i % 3 ? "neutral" : "accent"}>
              tag_{i + 1}
            </Badge>
          ))}
        </Scroller>
      </div>
    </Card>
  );
};
