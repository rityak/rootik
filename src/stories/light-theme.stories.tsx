import type { Story } from "@ladle/react";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  Badge,
  Button,
  Callout,
  Card,
  Field,
  Input,
  Progress,
  SegmentedControl,
  Stat,
  Switch,
  Tabs,
} from "..";
import "./light-theme.css";

export default { title: "Overview" };

export const LightTheme: Story = () => {
  const [tab, setTab] = useState("overview");
  return (
    <div
      data-theme="light"
      data-rk-scope=""
      style={{
        padding: 24,
        borderRadius: 20,
        background: "var(--rk-bg)",
        color: "var(--rk-text)",
        maxWidth: 760,
      }}
    >
      <div className="story-col">
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: "overview", label: "Overview" },
            { value: "images", label: "Images", badge: "48K" },
            { value: "settings", label: "Settings" },
          ]}
        />
        <div className="story-row" style={{ alignItems: "stretch", gap: 16 }}>
          <Card title="anime-faces-v3" description="Tagging run" style={{ flex: 1 }}>
            <div className="story-col">
              <Stat label="Images tagged" value="46,210" unit="of 48,210" delta={12} />
              <Progress value={96} showValue label="Progress" />
              <div className="story-row">
                <Badge tone="success" dot>
                  Running
                </Badge>
                <Badge tone="warn">38 flagged</Badge>
                <Badge tone="accent">v3</Badge>
              </div>
            </div>
          </Card>
          <Card title="Parameters" style={{ flex: 1 }}>
            <div className="story-col">
              <Field label="Search">
                <Input icon={<Search />} placeholder="Filter tags…" />
              </Field>
              <SegmentedControl
                size="sm"
                defaultValue="auto"
                options={[
                  { value: "auto", label: "Auto" },
                  { value: "manual", label: "Manual" },
                ]}
              />
              <Switch label="Skip duplicates" defaultChecked />
              <div className="story-row">
                <Button variant="primary">Start</Button>
                <Button>Save preset</Button>
                <Button variant="ghost">Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
        <Callout tone="info" title="Recipe, not a shipped theme">
          Copy src/stories/light-theme.css into your app and set data-theme="light" on html.
        </Callout>
      </div>
    </div>
  );
};
