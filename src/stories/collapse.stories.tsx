import type { Story } from "@ladle/react";
import { Button, Card, Disclosure, KeyValue } from "..";

export default { title: "Layout" };

export const Collapsing: Story = () => (
  <div className="story-col" style={{ maxWidth: 520 }}>
    <Card
      title="Run details"
      description="Collapsible card: animates and keeps its content mounted"
      collapsible
      footer={<Button size="sm">Open run</Button>}
    >
      <KeyValue
        items={[
          { label: "Model", value: "sdxl-base-1.0" },
          { label: "Steps", value: "12,000" },
          { label: "Batch", value: "8 × 2 (grad accum)" },
        ]}
      />
    </Card>
    <div>
      <Disclosure title="Augmentations" name="params" open>
        Flip, random crop 0.9–1.0, color jitter 0.05.
      </Disclosure>
      <Disclosure title="Optimizer" name="params">
        AdamW, β1 0.9, β2 0.999, weight decay 0.01, cosine schedule with 300 warm-up steps.
      </Disclosure>
      <Disclosure title="Logging" name="params">
        Every 50 steps to the run log; samples every 500 steps.
      </Disclosure>
    </div>
  </div>
);
