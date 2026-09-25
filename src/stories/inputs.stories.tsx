import type { Story } from "@ladle/react";
import { AtSign, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { Button, Card, Field, Input, SearchInput, Select, Slider, Textarea } from "..";

export default { title: "Inputs" };

export const TextInputs: Story = () => {
  const [q, setQ] = useState("");
  return (
    <div className="story-col" style={{ maxWidth: 420 }}>
      <Field label="Name" hint="Shown in the run list">
        <Input placeholder="anima-v4" />
      </Field>
      <Field label="Email" required error="That doesn't look like an email">
        <Input icon={<AtSign />} defaultValue="ira@" />
      </Field>
      <Field label="Endpoint" aside="optional">
        <Input icon={<Globe />} mono placeholder="http://127.0.0.1:8082" end="/api" />
      </Field>
      <Field label="Token">
        <Input icon={<Lock />} type="password" defaultValue="secret" size="sm" />
      </Field>
      <SearchInput value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} shortcut="⌘K" />
      <div className="story-row">
        <Input size="sm" placeholder="Small" style={{ width: 120 }} />
        <Input placeholder="Medium" style={{ width: 120 }} />
        <Input size="lg" placeholder="Large" style={{ width: 120 }} />
        <Input disabled placeholder="Disabled" style={{ width: 120 }} />
      </div>
      <Field label="Caption" hint="Grows with content">
        <Textarea autoSize placeholder="1girl, solo, looking at viewer…" />
      </Field>
      <Field label="Config">
        <Textarea mono rows={4} defaultValue={"mixed-port: 7890\nmode: rule\nlog-level: info"} />
      </Field>
    </div>
  );
};

const models = [
  { value: "sdxl", label: "SDXL 1.0", hint: "6.9 GB" },
  { value: "anima", label: "Anima v4", hint: "4.1 GB" },
  { value: "flux", label: "Flux dev", hint: "23.8 GB" },
  { value: "old", label: "SD 1.5", hint: "deprecated", disabled: true },
];

export const Selects: Story = () => {
  const [model, setModel] = useState("anima");
  return (
    <div className="story-col" style={{ maxWidth: 360 }}>
      <Field label="Base model">
        <Select options={models} value={model} onChange={setModel} />
      </Field>
      <Field label="Scheduler">
        <Select
          placeholder="Choose…"
          options={["cosine", "cosine_with_restarts", "constant", "linear", "polynomial"].map((v) => ({
            value: v,
            label: v,
          }))}
          mono
        />
      </Field>
      <div className="story-row">
        <Select
          size="sm"
          variant="button"
          defaultValue="week"
          options={[
            { value: "week", label: "This week" },
            { value: "month", label: "This month" },
          ]}
        />
        <Select size="sm" disabled defaultValue="a" options={[{ value: "a", label: "Disabled" }]} />
      </div>
    </div>
  );
};

export const Sliders: Story = () => {
  const [lr, setLr] = useState(40);
  return (
    <div className="story-col" style={{ maxWidth: 360 }}>
      <Slider label="Strength" value={lr} onChange={setLr} showValue />
      <Slider
        label="CFG scale"
        defaultValue={7}
        min={1}
        max={20}
        step={0.5}
        showValue={(v) => v.toFixed(1)}
        marks={[1, 5, 10, 15, 20]}
      />
      <Slider aria-label="Disabled" defaultValue={30} disabled />
    </div>
  );
};

export const Form: Story = () => (
  <Card
    title="New dataset"
    description="Folder of images with .txt captions"
    style={{ maxWidth: 560 }}
    footer={
      <>
        <span style={{ flex: 1 }} />
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Create</Button>
      </>
    }
  >
    <div className="story-col">
      <Field label="Name">
        <Input placeholder="my-dataset" />
      </Field>
      <Field label="Repeat" layout="inline" hint="Times each image is seen per epoch">
        <Input type="number" defaultValue={4} style={{ width: 90 }} size="sm" />
      </Field>
      <Field label="Resolution" layout="inline">
        <Select
          size="sm"
          defaultValue="1024"
          options={[
            { value: "768", label: "768" },
            { value: "1024", label: "1024" },
            { value: "1536", label: "1536" },
          ]}
          style={{ width: 140 }}
        />
      </Field>
    </div>
  </Card>
);
