import type { Story } from "@ladle/react";
import { Button, Card, Input, Scope, Switch } from "..";

export default { title: "Utilities" };

const Panel = ({ title }: { title: string }) => (
  <Card title={title} style={{ width: 300 }}>
    <div className="story-col" style={{ gap: 10 }}>
      <Input placeholder="Dataset name" />
      <Switch label="Auto-tag on import" defaultChecked />
      <Button variant="primary">Create</Button>
    </div>
  </Card>
);

export const Scopes: Story = () => (
  <div className="story-row" style={{ alignItems: "flex-start", gap: 16 }}>
    <Panel title="Page defaults" />
    <Scope values={{ density: "compact" }}>
      <Panel title="Scope: compact" />
    </Scope>
    <Scope values={{ accent: "oklch(0.62 0.16 162)", radius: 8 }}>
      <Panel title="Scope: accent + radius" />
    </Scope>
  </div>
);
