import type { Story } from "@ladle/react";
import { useState } from "react";
import { ACCENTS, Button, Card, ColorPicker, KeyValue, parseColor } from "..";

export default { title: "Inputs" };

export const ColorPickers: Story = () => {
  const [accent, setAccent] = useState("oklch(0.57 0.2 277)");
  const [overlay, setOverlay] = useState("oklch(0.7 0.12 160 / 0.5)");
  const parsed = parseColor(accent);
  return (
    <div className="story-row" style={{ alignItems: "flex-start" }}>
      <Card title="Accent" description="Swatches are the theme presets; hatch = outside sRGB">
        <div className="story-col">
          <ColorPicker value={accent} onChange={setAccent} swatches={ACCENTS} />
          {/* a scope re-derives the accent tokens from the picked color */}
          <div data-rk-scope style={{ "--rk-accent": accent } as React.CSSProperties} className="story-row">
            <Button variant="primary">Primary action</Button>
            <Button variant="secondary" active>
              Active
            </Button>
          </div>
        </div>
      </Card>
      <Card title="With alpha">
        <div className="story-col">
          <ColorPicker alpha value={overlay} onChange={setOverlay} />
          <KeyValue
            items={[
              { label: "Value", value: overlay, copy: true },
              {
                label: "Accent L / C / H",
                value: parsed
                  ? `${parsed.l.toFixed(3)} / ${parsed.c.toFixed(3)} / ${parsed.h.toFixed(1)}`
                  : "—",
              },
            ]}
          />
        </div>
      </Card>
    </div>
  );
};
