import type { Story } from "@ladle/react";
import { Code, Eye, Globe, LayoutGrid, List, Monitor, Network, Shield } from "lucide-react";
import { useState } from "react";
import {
  ACCENTS,
  Checkbox,
  ChipGroup,
  ChoiceCards,
  ColorSwatches,
  Field,
  RadioGroup,
  SegmentedControl,
  Switch,
} from "..";

export default { title: "Choice" };

export const CheckboxesAndSwitches: Story = () => (
  <div className="story-col" style={{ maxWidth: 420 }}>
    <Checkbox label="Recursive" defaultChecked />
    <Checkbox
      label="Keep originals"
      description="Write results next to the source files instead of replacing them"
    />
    <Checkbox label="Partially selected" indeterminate />
    <Checkbox label="Disabled" disabled />
    <Switch label="Autosave" defaultChecked />
    <Switch label="Compact rows" size="sm" />
    <Switch
      label="Launch at login"
      description="Start minimized to tray"
      labelPosition="start"
      defaultChecked
    />
    <Field layout="inline" label="System proxy" hint="Route system traffic through the core">
      <Switch defaultChecked />
    </Field>
  </div>
);

export const Radios: Story = () => (
  <div className="story-col">
    <RadioGroup
      aria-label="Precision"
      defaultValue="bf16"
      options={[
        { value: "fp32", label: "fp32", description: "Full precision, slowest" },
        { value: "bf16", label: "bf16", description: "Recommended on RTX 30xx+" },
        { value: "fp16", label: "fp16" },
      ]}
    />
    <RadioGroup
      aria-label="Log level"
      orientation="horizontal"
      defaultValue="info"
      options={["debug", "info", "warning", "error"].map((v) => ({ value: v, label: v }))}
    />
  </div>
);

export const Segmented: Story = () => {
  const [mode, setMode] = useState("rule");
  return (
    <div className="story-col" style={{ alignItems: "flex-start" }}>
      <SegmentedControl
        aria-label="Mode"
        value={mode}
        onChange={setMode}
        options={[
          { value: "rule", label: "Rule" },
          { value: "global", label: "Global" },
          { value: "direct", label: "Direct" },
        ]}
      />
      <SegmentedControl
        aria-label="View"
        size="sm"
        options={[
          { value: "grid", icon: <LayoutGrid />, hint: "Grid" },
          { value: "list", icon: <List />, hint: "List" },
        ]}
      />
      <SegmentedControl
        aria-label="Editor"
        size="lg"
        options={[
          { value: "visual", label: "Visual", icon: <Eye /> },
          { value: "code", label: "Code", icon: <Code /> },
        ]}
      />
      <div style={{ width: 360 }}>
        <SegmentedControl
          aria-label="Proxy mode"
          fill
          options={[
            { value: "proxy", label: "Proxy", icon: <Globe /> },
            { value: "system", label: "System", icon: <Monitor /> },
            { value: "tun", label: "TUN", icon: <Network /> },
          ]}
        />
      </div>
    </div>
  );
};

export const Cards: Story = () => (
  <div style={{ maxWidth: 640 }}>
    <ChoiceCards
      aria-label="TUN stack"
      defaultValue="mixed"
      options={[
        {
          value: "system",
          label: "System",
          description: "Uses the OS network stack. Fast, needs admin.",
          icon: <Monitor />,
        },
        {
          value: "gvisor",
          label: "gVisor",
          description: "Userspace stack. Most compatible.",
          icon: <Shield />,
        },
        {
          value: "mixed",
          label: "Mixed",
          description: "TCP via system, UDP via gVisor.",
          icon: <Network />,
          note: "Needs a restart to apply",
        },
      ]}
    />
  </div>
);

export const Chips: Story = () => {
  const [tags, setTags] = useState(["1girl", "solo"]);
  return (
    <div className="story-col">
      <ChipGroup
        aria-label="Tags"
        value={tags}
        onChange={setTags}
        options={[
          { value: "1girl", count: 812 },
          { value: "solo", count: 640 },
          { value: "long_hair", count: 402 },
          { value: "smile", count: 377 },
          { value: "outdoors", count: 91 },
        ]}
      />
      <ChipGroup
        aria-label="Metric"
        single
        size="sm"
        defaultValue={["calories"]}
        options={[
          { value: "calories", label: "Calories" },
          { value: "heart", label: "Heart rate" },
          { value: "glucose", label: "Glucose" },
        ]}
      />
    </div>
  );
};

export const Colors: Story = () => {
  const [c, setC] = useState<string>(ACCENTS[0].value);
  return (
    <div className="story-col">
      <ColorSwatches aria-label="Accent" options={ACCENTS} value={c} onChange={setC} custom />
      <code style={{ color: "var(--rk-text-3)" }}>{c}</code>
    </div>
  );
};
