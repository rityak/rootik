import type { Story } from "@ladle/react";
import { Plus, Settings } from "lucide-react";
import { useState } from "react";
import { Button, Card, IconButton, SearchInput, Tour } from "..";

export default { title: "Overlays" };

export const Tours: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="story-col" style={{ maxWidth: 560, gap: 16 }}>
      <div className="story-row">
        <Button variant="primary" onClick={() => setOpen(true)}>
          Start tour
        </Button>
        <span style={{ flex: 1 }} />
        <IconButton id="tour-settings" icon={<Settings />} label="Settings" />
      </div>
      <SearchInput id="tour-search" placeholder="Search datasets…" />
      <Card
        title="Datasets"
        actions={
          <Button id="tour-new" icon={<Plus />}>
            New dataset
          </Button>
        }
      >
        Nothing here yet.
      </Card>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={[
          {
            target: "#tour-new",
            title: "Create a dataset",
            content: "Point it at a folder of images; captions are picked up next to them.",
          },
          {
            target: "#tour-search",
            title: "Find anything",
            content: "Search by name, tag or path. Ctrl+K opens it from anywhere.",
          },
          {
            target: "#tour-settings",
            title: "Settings",
            content: "Theme, density and paths live here.",
            placement: "bottom-end",
          },
        ]}
      />
    </div>
  );
};
