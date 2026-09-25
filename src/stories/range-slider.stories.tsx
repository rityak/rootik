import type { Story } from "@ladle/react";
import { useState } from "react";
import { Card, RangeSlider, Slider } from "..";

export default { title: "Inputs" };

export const RangeAndVertical: Story = () => {
  const [size, setSize] = useState<[number, number]>([256, 1024]);
  return (
    <div className="story-row" style={{ alignItems: "flex-start", gap: 24 }}>
      <Card title="Filter images" style={{ width: 380 }}>
        <div className="story-col">
          <RangeSlider
            label="Short side, px"
            min={64}
            max={2048}
            step={64}
            minDistance={128}
            value={size}
            onChange={setSize}
            showValue
            marks={[64, 512, 1024, 1536, 2048]}
          />
          <RangeSlider
            label="Aesthetic score"
            min={0}
            max={10}
            step={0.5}
            defaultValue={[6, 9.5]}
            showValue={([a, b]) => `${a.toFixed(1)} – ${b.toFixed(1)}`}
          />
          <RangeSlider label="Disabled" defaultValue={[20, 60]} disabled />
        </div>
      </Card>
      <Card title="Mixer">
        <div className="story-row" style={{ gap: 28, height: 180 }}>
          <Slider orientation="vertical" aria-label="Master" defaultValue={70} />
          <Slider orientation="vertical" aria-label="Music" defaultValue={45} />
          <Slider orientation="vertical" aria-label="Voice" defaultValue={85} />
        </div>
      </Card>
    </div>
  );
};
