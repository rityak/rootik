import type { Story } from "@ladle/react";
import { useState } from "react";
import { Button, PowerButton, Switch } from "../controls/index";
import { MotionLayer } from "../motion/index";
import { Scope } from "../theme/provider";
import "../css/controls.css";
import "../css/motion.css";

export default { title: "Motion" };

export const LightEffects: Story = () => {
  const [enabled, setEnabled] = useState(true);
  return (
    <Scope values={{ palette: "cobalt", effects: enabled ? "expressive" : "off", motion: "system" }}>
      <div className="story-col">
        <Switch
          label="Decorative effects"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
        />
        {(["sheen", "ripple", "flow"] as const).map((effect) => (
          <Scope key={effect} values={{ effectStyle: effect }}>
            <div className="story-row">
              <Button svgBorder="cut">{effect}</Button>
              <Button variant="primary" svgBorder="soft">
                Primary
              </Button>
              <div
                style={{
                  position: "relative",
                  isolation: "isolate",
                  overflow: "hidden",
                  borderRadius: "var(--rk-radius-md)",
                  padding: "var(--rk-pad)",
                  background: "var(--rk-surface-2)",
                }}
              >
                <MotionLayer active loop effect={effect} />
                Ambient SVG slot
              </div>
            </div>
          </Scope>
        ))}
      </div>
    </Scope>
  );
};

export const VpnVariants: Story = () => (
  <Scope values={{ palette: "cobalt", effects: "subtle", motion: "system" }}>
    <div className="story-col">
      {(["signal", "reactor"] as const).map((variant) => (
        <div className="story-row" key={variant}>
          <PowerButton label={`${variant} disconnected`} variant={variant} />
          <PowerButton label={`${variant} connecting`} variant={variant} pending />
          <PowerButton label={`${variant} connected`} variant={variant} defaultOn />
          <PowerButton label={`${variant} unavailable`} variant={variant} disabled />
        </div>
      ))}
    </div>
  </Scope>
);
