import type { Story } from "@ladle/react";
import { Download, FileJson, FileText, Play, Save } from "lucide-react";
import { useState } from "react";
import { MenuItem, MenuSeparator, SplitButton } from "..";

export default { title: "Actions" };

export const Split: Story = () => {
  const [last, setLast] = useState("—");
  return (
    <div className="story-col" style={{ minHeight: 280 }}>
      <div className="story-row">
        <SplitButton
          variant="primary"
          icon={<Play />}
          onClick={() => setLast("Start training")}
          menu={
            <>
              <MenuItem onSelect={() => setLast("Start from checkpoint")}>Start from checkpoint…</MenuItem>
              <MenuItem onSelect={() => setLast("Dry run")}>Dry run</MenuItem>
            </>
          }
        >
          Start
        </SplitButton>
        <SplitButton
          icon={<Download />}
          onClick={() => setLast("Export JSONL")}
          menu={
            <>
              <MenuItem icon={<FileJson />} onSelect={() => setLast("Export JSONL")}>
                JSONL
              </MenuItem>
              <MenuItem icon={<FileText />} onSelect={() => setLast("Export CSV")}>
                CSV
              </MenuItem>
              <MenuSeparator />
              <MenuItem onSelect={() => setLast("Export settings")}>Export settings…</MenuItem>
            </>
          }
        >
          Export
        </SplitButton>
        <SplitButton
          size="sm"
          variant="ghost"
          icon={<Save />}
          menu={<MenuItem>Save as…</MenuItem>}
          onClick={() => setLast("Save")}
        >
          Save
        </SplitButton>
        <SplitButton size="sm" disabled menu={<MenuItem>Nothing</MenuItem>}>
          Disabled
        </SplitButton>
      </div>
      <span style={{ color: "var(--rk-text-2)" }}>Last action: {last}</span>
    </div>
  );
};
