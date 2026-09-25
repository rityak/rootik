import type { Story } from "@ladle/react";
import { useState } from "react";
import { Card, Field, NumberInput } from "..";

export default { title: "Inputs" };

export const Numbers: Story = () => {
  const [lr, setLr] = useState<number | null>(0.0003);
  const [epochs, setEpochs] = useState<number | null>(12);
  return (
    <Card title="Training parameters" style={{ maxWidth: 420 }}>
      <div className="story-col">
        <Field label="Epochs" hint="↑/↓ step, Shift ×10, wheel while focused">
          <NumberInput value={epochs} onChange={setEpochs} min={1} max={200} />
        </Field>
        <Field label="Learning rate" aside={lr === null ? "—" : lr.toExponential(1)}>
          <NumberInput
            value={lr}
            onChange={setLr}
            min={0}
            max={0.01}
            step={0.0001}
            precision={5}
            allowEmpty
          />
        </Field>
        <Field label="Resolution" layout="inline">
          <NumberInput
            defaultValue={512}
            min={64}
            max={2048}
            step={64}
            unit="px"
            size="sm"
            style={{ width: 130 }}
          />
        </Field>
        <Field label="Timeout" layout="inline">
          <NumberInput
            defaultValue={1500}
            min={0}
            step={100}
            unit="ms"
            hideStepper
            size="sm"
            style={{ width: 130 }}
          />
        </Field>
        <Field label="Workers" error="At most 16 on this machine">
          <NumberInput defaultValue={24} />
        </Field>
      </div>
    </Card>
  );
};
