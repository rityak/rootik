import type { Story } from "@ladle/react";
import type { CSSProperties } from "react";
import { Avatar, Button, Card, IconButton, Input, SegmentedControl } from "..";

export default { title: "Overview" };

const sample = (shape: string) => (
  <div style={{ "--rk-corner-shape": shape } as CSSProperties}>
    <Card
      title={shape === "squircle" ? "Squircle" : "Round"}
      description={`corner-shape: ${shape}`}
      style={{ width: 300 }}
    >
      <div className="story-col">
        <Input placeholder="Search…" />
        <div className="story-row">
          <Button variant="primary">Connect</Button>
          <Button>Settings</Button>
          <IconButton round icon="✓" label="Round stays round" />
          <Avatar name="Kira Ito" />
        </div>
        <SegmentedControl
          size="sm"
          defaultValue="a"
          options={[
            { value: "a", label: "Auto" },
            { value: "b", label: "Manual" },
          ]}
        />
      </div>
    </Card>
  </div>
);

export const Corners: Story = () => (
  <div className="story-col">
    <p style={{ margin: 0, color: "var(--rk-text-2)" }}>
      Settings → Shape → Corners sets this for the app; circles stay circles. Needs corner-shape support
      (Chromium 139+); elsewhere both look round.
    </p>
    <div className="story-row" style={{ alignItems: "flex-start", gap: 24 }}>
      {sample("round")}
      {sample("squircle")}
    </div>
  </div>
);
