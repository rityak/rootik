import type { Story } from "@ladle/react";
import { useState } from "react";
import { Button, ConfirmHost, confirm, KeyValue, prompt } from "..";

export default { title: "Overlays" };

export const ConfirmAndPrompt: Story = () => {
  const [log, setLog] = useState<string[]>([]);
  const add = (line: string) => setLog((l) => [line, ...l].slice(0, 4));
  return (
    <div className="story-col" style={{ maxWidth: 460 }}>
      <div className="story-row">
        <Button
          variant="danger"
          onClick={async () => {
            const ok = await confirm({
              title: "Delete preset “Night mode”?",
              description: "Servers using it fall back to the default preset.",
              confirmLabel: "Delete",
              tone: "danger",
            });
            add(`confirm → ${ok}`);
          }}
        >
          Delete preset…
        </Button>
        <Button
          onClick={async () => {
            const name = await prompt({
              title: "Rename dataset",
              label: "Name",
              defaultValue: "anime-faces-v3",
              confirmLabel: "Rename",
              validate: (v) =>
                !v.trim() ? "Name can't be empty" : v === "scenery-mix" ? "Already exists" : null,
            });
            add(`prompt → ${name === null ? "null" : `“${name}”`}`);
          }}
        >
          Rename…
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            confirm({ title: "First in queue" }).then((ok) => add(`first → ${ok}`));
            confirm({ title: "Second in queue" }).then((ok) => add(`second → ${ok}`));
          }}
        >
          Queue two
        </Button>
      </div>
      <KeyValue
        items={log.map((l, i) => ({
          label: `#${log.length - i}`,
          value: <span className="rk-mono">{l}</span>,
        }))}
      />
      <ConfirmHost />
    </div>
  );
};
