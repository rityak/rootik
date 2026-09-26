import type { Story } from "@ladle/react";
import { Mic } from "lucide-react";
import { useEffect, useState } from "react";
import { PowerButton, StatusDot } from "..";

export default { title: "Inputs" };

export const PowerButtons: Story = () => {
  const [on, setOn] = useState(false);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => setPending(false), 1800);
    return () => clearTimeout(t);
  }, [pending]);
  return (
    <div className="story-col" style={{ gap: 32 }}>
      <div className="story-row" style={{ gap: 24 }}>
        <PowerButton
          label="VPN connection"
          size="lg"
          on={on}
          pending={pending}
          onChange={(next) => {
            setOn(next);
            setPending(next);
          }}
        />
        <StatusDot
          tone={pending ? "warn" : on ? "success" : "neutral"}
          pulse={on && !pending}
          label={pending ? "Connecting…" : on ? "Protected" : "Not connected"}
        />
      </div>
      <div className="story-row" style={{ gap: 40 }}>
        <PowerButton label="Service" size="sm" />
        <PowerButton label="Service" defaultOn />
        <PowerButton label="Recording" icon={<Mic />} pending />
        <PowerButton label="Service" disabled />
      </div>
    </div>
  );
};
