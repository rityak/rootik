import type { Story } from "@ladle/react";
import { useState } from "react";
import {
  Button,
  Card,
  CodeBlock,
  defaultSchemaValues,
  type Schema,
  SchemaForm,
  type SchemaValues,
  validateSchema,
} from "..";

export default { title: "Forms" };

const RUN_NAME = /^[a-z0-9][a-z0-9-]*$/;

const TRAINING: Schema = [
  {
    id: "model",
    title: "Model",
    description: "Base checkpoint and where the run is saved",
    fields: [
      {
        key: "base",
        type: "select",
        label: "Base model",
        required: true,
        placeholder: "Pick a checkpoint…",
        options: [
          { value: "sdxl", label: "SDXL 1.0" },
          { value: "flux-dev", label: "FLUX.1 dev" },
          { value: "sd15", label: "SD 1.5", hint: "Legacy" },
        ],
      },
      {
        key: "name",
        type: "string",
        label: "Run name",
        hint: "Lowercase letters, digits and dashes",
        required: true,
        mono: true,
        placeholder: "my-lora",
        pattern: RUN_NAME,
        patternMessage: "Use a-z, 0-9 and dashes",
        maxLength: 40,
      },
      {
        key: "trigger",
        type: "text",
        label: "Trigger prompt",
        placeholder: "photo of sks person, …",
      },
    ],
  },
  {
    id: "training",
    title: "Training",
    fields: [
      { key: "epochs", type: "number", label: "Epochs", default: 10, min: 1, max: 200, required: true },
      {
        key: "lr",
        type: "number",
        label: "Learning rate",
        default: 0.0001,
        step: 0.00001,
        precision: 6,
        min: 0,
        max: 0.01,
      },
      {
        key: "batch",
        type: "select",
        display: "segmented",
        label: "Batch size",
        default: "4",
        options: ["1", "2", "4", "8"].map((v) => ({ value: v, label: v })),
      },
      {
        key: "resolution",
        type: "slider",
        label: "Resolution",
        default: 1024,
        min: 512,
        max: 1536,
        step: 64,
        format: (v) => `${v}px`,
      },
      {
        key: "buckets",
        type: "boolean",
        label: "Aspect ratio buckets",
        hint: "Group images by shape instead of cropping",
        default: true,
        children: [
          {
            key: "bucketStep",
            type: "number",
            label: "Bucket step",
            default: 64,
            min: 8,
            max: 256,
            unit: "px",
          },
        ],
      },
    ],
  },
  {
    id: "data",
    title: "Dataset",
    fields: [
      {
        key: "tags",
        type: "multi",
        label: "Caption sources",
        hint: "Pick one or two",
        default: ["wd14"],
        min: 1,
        max: 2,
        options: [
          { value: "wd14", label: "WD14" },
          { value: "blip", label: "BLIP" },
          { value: "manual", label: "Manual" },
        ],
      },
      {
        key: "shuffle",
        type: "boolean",
        label: "Shuffle tags",
        default: false,
        visible: (v) => Array.isArray(v.tags) && v.tags.includes("wd14"),
      },
      {
        key: "keepTokens",
        type: "number",
        label: "Keep first tokens",
        hint: "Only while shuffling",
        default: 1,
        min: 0,
        max: 10,
        disabled: (v) => !v.shuffle,
        visible: (v) => Array.isArray(v.tags) && v.tags.includes("wd14"),
      },
      {
        key: "preview",
        type: "color",
        label: "Preview background",
        default: "oklch(0.2 0.02 260)",
        swatches: [
          { value: "oklch(0.2 0.02 260)", label: "Graphite" },
          { value: "oklch(0.96 0 0)", label: "White" },
          { value: "oklch(0.5 0 0)", label: "Mid grey" },
        ],
      },
    ],
  },
];

export const TrainingParams: Story = () => {
  const [values, setValues] = useState<SchemaValues>(() => defaultSchemaValues(TRAINING));
  const [ran, setRan] = useState<SchemaValues | null>(null);
  // what a Run button would gate on, without waiting for submit
  const issues = Object.keys(validateSchema(TRAINING, values)).length;
  return (
    <div className="story-row" style={{ alignItems: "flex-start" }}>
      <SchemaForm
        style={{ width: 560 }}
        schema={TRAINING}
        values={values}
        onChange={setValues}
        onSubmit={setRan}
        actions={
          <>
            <Button type="reset" variant="ghost">
              Reset
            </Button>
            <Button type="submit" variant="primary">
              Start training
            </Button>
          </>
        }
      />
      <div className="story-col" style={{ width: 320 }}>
        <CodeBlock
          title={issues ? `values · ${issues} invalid` : "values · valid"}
          language="json"
          code={JSON.stringify(values, null, 2)}
          maxHeight={420}
        />
        {ran && <CodeBlock title="submitted" language="json" code={JSON.stringify(ran, null, 2)} />}
      </div>
    </div>
  );
};

const INVITE: Schema = [
  { key: "email", type: "string", label: "Email", required: true, placeholder: "name@company.com" },
  {
    key: "role",
    type: "select",
    label: "Role",
    default: "viewer",
    display: "segmented",
    options: [
      { value: "viewer", label: "Viewer" },
      { value: "editor", label: "Editor" },
      { value: "admin", label: "Admin" },
    ],
  },
  { key: "note", type: "text", label: "Message", hint: "Sent with the invite", maxLength: 280 },
  { key: "expires", type: "boolean", label: "Link expires", layout: "inline", default: true },
];

/** Stacked plain layout for dialogs; the server rejects one address (external `errors`). */
export const StackedWithServerErrors: Story = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);
  return (
    <Card title="Invite member" style={{ width: 420 }}>
      <SchemaForm
        schema={INVITE}
        layout="stack"
        variant="plain"
        errors={errors}
        onChange={() => setErrors({})}
        onSubmit={(v) => {
          if (v.email === "taken@company.com") setErrors({ email: "Already a member" });
          else setSent(String(v.email));
        }}
        actions={
          <Button type="submit" variant="primary">
            Send invite
          </Button>
        }
      />
      {sent && <p style={{ margin: "12px 0 0", color: "var(--rk-text-3)" }}>Invite sent to {sent}</p>}
    </Card>
  );
};

export const DisabledForm: Story = () => (
  <SchemaForm style={{ width: 480 }} schema={INVITE} variant="plain" disabled />
);
