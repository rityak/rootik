import type { Story } from "@ladle/react";
import { useState } from "react";
import { Button, Card, Fieldset, Input, Tabs, Tree } from "..";

export default { title: "Navigation" };

const items = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta" },
  { value: "gamma", label: "Gamma" },
];
const nodes = items.map((item) => ({ id: item.value, label: item.label }));
const virtualNodes = Array.from({ length: 100 }, (_, i) => ({ id: `node-${i}`, label: `Node ${i}` }));

/** Keyboard regression scenarios: controlled selection, filtering, removal and virtual entry. */
export const FocusRecovery: Story = () => {
  const [removed, setRemoved] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  return (
    <div className="story-col">
      <Card title="Disabled first tab">
        <Tabs
          aria-label="Disabled first"
          items={[{ value: "locked", label: "Locked", disabled: true }, ...items]}
        />
      </Card>
      <Card title="Controlled selection stays Alpha">
        <Tabs aria-label="Controlled" value="alpha" items={items} />
      </Card>
      <Card title="Remove focused tab" description="Press Delete on a tab; focus stays inside the group">
        <Fieldset
          aria-label="Removable tabs"
          onKeyDown={(event) => {
            if (event.key !== "Delete") return;
            const value = (event.target as HTMLElement).dataset.value;
            if (value) setRemoved((prev) => [...prev, value]);
          }}
        >
          <Tabs
            aria-label="Removable"
            defaultValue="beta"
            items={items.filter((t) => !removed.includes(t.value))}
          />
        </Fieldset>
        <Button onClick={() => setRemoved([])}>Restore tabs</Button>
      </Card>
      <Card title="Filtered selection stays Alpha">
        <Input aria-label="Tree filter" value={query} onChange={(event) => setQuery(event.target.value)} />
        <Tree aria-label="Filtered" items={nodes} selected="alpha" filter={query} />
      </Card>
      <Card title="Virtual selection outside viewport">
        <Tree aria-label="Virtual" items={virtualNodes} selected="node-99" height={120} />
      </Card>
    </div>
  );
};
