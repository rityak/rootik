import type { Story } from "@ladle/react";
import { useState } from "react";
import { Button, Field, PinInput } from "..";

export default { title: "Inputs" };

export const Pin: Story = () => {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "bad">("idle");
  return (
    <div className="story-col" style={{ maxWidth: 420 }}>
      <Field
        label="Verification code"
        hint={
          status === "idle"
            ? "Type, paste “Your code: 481 204” or use SMS autofill. The right code is 481204."
            : undefined
        }
        error={status === "bad" ? "Wrong code, try again" : undefined}
      >
        <PinInput
          value={code}
          invalid={status === "bad"}
          groups={[3, 3]}
          onChange={(v) => {
            setCode(v);
            setStatus("idle");
          }}
          onComplete={(v) => setStatus(v === "481204" ? "ok" : "bad")}
        />
      </Field>
      {status === "ok" && <p style={{ margin: 0, color: "var(--rk-success)" }}>Verified</p>}
      <div className="story-row">
        <Button size="sm" variant="ghost" onClick={() => setCode("")}>
          Clear
        </Button>
      </div>
      <Field label="Device PIN (masked, 4)">
        <PinInput length={4} mask size="lg" />
      </Field>
      <Field label="Pairing key (alphanumeric)">
        <PinInput length={8} type="alphanumeric" groups={[4, 4]} size="sm" />
      </Field>
      <PinInput aria-label="Disabled" disabled defaultValue="12" length={4} />
    </div>
  );
};
