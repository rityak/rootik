import type { Story } from "@ladle/react";
import { Button, Card, Field, Form, Input, toast } from "..";

export default { title: "Inputs" };

export const Forms: Story = () => (
  <Card title="New subscription" style={{ maxWidth: 420 }}>
    <Form
      className="story-col"
      validate={(data) => ({
        name:
          String(data.get("name")).trim().toLowerCase() === "default"
            ? "“default” is reserved; pick another name"
            : undefined,
      })}
      onSubmit={(data) => toast.success(`Added ${data.get("name")}`)}
    >
      <Field label="Name" required hint="Shown in the node list">
        <Input name="name" required minLength={3} />
      </Field>
      <Field label="URL" required>
        <Input name="url" type="url" required placeholder="https://example.com/sub" />
      </Field>
      <Field label="Refresh, hours">
        <Input name="refresh" type="number" min={1} max={168} defaultValue={24} />
      </Field>
      <Button type="submit" variant="primary">
        Add subscription
      </Button>
    </Form>
  </Card>
);
