import type { Story } from "@ladle/react";
import { useState } from "react";
import { Card, CheckboxGroup } from "..";

export default { title: "Inputs" };

const FORMATS = [
  { value: "png", label: "PNG" },
  { value: "jpg", label: "JPEG" },
  { value: "webp", label: "WebP" },
  { value: "avif", label: "AVIF", description: "Needs the AVIF codec plugin", disabled: true },
];

export const CheckboxGroups: Story = () => {
  const [formats, setFormats] = useState<string[]>(["png", "webp"]);
  return (
    <div className="story-row" style={{ alignItems: "flex-start" }}>
      <Card
        title="Import formats"
        description={`Selected: ${formats.join(", ") || "none"}`}
        style={{ width: 300 }}
      >
        <CheckboxGroup
          aria-label="Formats"
          selectAll="All formats"
          options={FORMATS}
          value={formats}
          onChange={setFormats}
        />
      </Card>
      <Card title="Notifications" style={{ width: 360 }}>
        <CheckboxGroup
          aria-label="Notify about"
          orientation="horizontal"
          defaultValue={["done"]}
          options={[
            { value: "done", label: "Run finished" },
            { value: "failed", label: "Run failed" },
            { value: "epoch", label: "Every epoch" },
          ]}
        />
      </Card>
    </div>
  );
};
