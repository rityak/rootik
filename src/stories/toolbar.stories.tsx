import type { Story } from "@ladle/react";
import { Download, Grid2x2, List, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button, IconButton, SearchInput, SegmentedControl, Spacer, Toolbar } from "..";

export default { title: "Layout" };

export const KeyboardToolbar: Story = () => (
  <div className="story-col" style={{ maxWidth: 760 }}>
    <p style={{ margin: 0, color: "var(--rk-text-2)" }}>
      Tab lands on one control; ←/→ move between them, Home/End jump. The view switch and the search field
      keep their own arrow keys.
    </p>
    <button type="button">before</button>
    <Toolbar aria-label="Gallery" style={{ borderRadius: 12, border: "1px solid var(--rk-line)" }}>
      <Button size="sm" variant="primary" icon={<Plus />}>
        Import
      </Button>
      <IconButton size="sm" icon={<RefreshCw />} label="Refresh" />
      <IconButton size="sm" icon={<Download />} label="Export" />
      <IconButton size="sm" icon={<Trash2 />} label="Delete" disabled />
      <SegmentedControl
        size="sm"
        aria-label="View"
        defaultValue="grid"
        options={[
          { value: "grid", label: <Grid2x2 size={14} /> },
          { value: "list", label: <List size={14} /> },
        ]}
      />
      <Spacer />
      <SearchInput size="sm" placeholder="Filter…" style={{ width: 180 }} />
    </Toolbar>
    <button type="button">after</button>
  </div>
);
