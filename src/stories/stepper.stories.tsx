import type { Story } from "@ladle/react";
import { useState } from "react";
import { Button, Card, Stepper } from "..";

export default { title: "Navigation" };

const STEPS = [
  { id: "source", label: "Source", description: "Folder or archive" },
  { id: "filter", label: "Filter", description: "Size, duplicates" },
  { id: "tag", label: "Auto-tag", description: "WD14 / BLIP" },
  { id: "review", label: "Review" },
];

export const Wizard: Story = () => {
  const [step, setStep] = useState(1);
  return (
    <div className="story-col" style={{ maxWidth: 720 }}>
      <Card>
        <div className="story-col">
          <Stepper steps={STEPS} current={step} onStepClick={setStep} aria-label="Import steps" />
          <p style={{ margin: "12px 0 0", color: "var(--rk-text-3)" }}>
            Step {step + 1}: completed steps are clickable (linear).
          </p>
          <div className="story-row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(Math.min(step + 1, STEPS.length))}>
              {step >= STEPS.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </Card>
      <div className="story-row" style={{ alignItems: "flex-start" }}>
        <Card title="Vertical, with an error" style={{ width: 300 }}>
          <Stepper
            orientation="vertical"
            current={2}
            steps={[
              { id: "a", label: "Account", description: "kira@example.com" },
              { id: "b", label: "Server", description: "Port already in use", error: true },
              { id: "c", label: "Routing" },
              { id: "d", label: "Done" },
            ]}
          />
        </Card>
        <Card title="Small" style={{ width: 360 }}>
          <Stepper size="sm" current={3} steps={STEPS} />
        </Card>
      </div>
    </div>
  );
};
