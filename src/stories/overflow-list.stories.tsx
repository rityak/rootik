import type { Story } from "@ladle/react";
import { Download, Filter, Pencil, Share2, Trash2 } from "lucide-react";
import { Badge, Button, Card, OverflowList } from "..";

export default { title: "Layout" };

const tags = [
  "1girl",
  "solo",
  "long hair",
  "looking at viewer",
  "smile",
  "blue eyes",
  "school uniform",
  "outdoors",
  "cherry blossoms",
  "depth of field",
];
const actions = [
  { label: "Edit", icon: <Pencil /> },
  { label: "Filter", icon: <Filter /> },
  { label: "Export", icon: <Download /> },
  { label: "Share", icon: <Share2 /> },
  { label: "Delete", icon: <Trash2 /> },
];
const path = ["D:", "datasets", "anime-faces-v3", "train", "images", "2024-06", "batch-017"];

const resizable = {
  resize: "horizontal",
  overflow: "hidden",
  width: 360,
  minWidth: 140,
  maxWidth: 640,
} as const;

export const Overflow: Story = () => (
  <div className="story-col" style={{ maxWidth: 680 }}>
    <Card title="Drag the corners: what doesn't fit goes into +N">
      <div className="story-col">
        <div style={resizable}>
          <OverflowList items={tags} renderItem={(t) => <Badge>{t}</Badge>} />
        </div>
        <div style={resizable}>
          <OverflowList
            items={actions}
            minVisible={1}
            renderItem={(a) => (
              <Button size="sm" variant="ghost" icon={a.icon}>
                {a.label}
              </Button>
            )}
          />
        </div>
        <div style={resizable}>
          <OverflowList
            collapseFrom="start"
            items={path}
            renderItem={(part, i) => (
              <span
                className="rk-mono"
                style={{ color: i === path.length - 1 ? "var(--rk-text)" : "var(--rk-text-3)" }}
              >
                {part}
                {i < path.length - 1 && " /"}
              </span>
            )}
          />
        </div>
      </div>
    </Card>
  </div>
);
