import type { Story } from "@ladle/react";
import { CheckIcon, DownloadIcon, PlayIcon, SaveIcon, TriangleAlertIcon, UploadIcon } from "lucide-react";
import { Badge, Card, Code, Timeline } from "..";

export default { title: "Display" };

export const RunTimeline: Story = () => (
  <div className="story-row" style={{ alignItems: "flex-start" }}>
    <Card title="Training run" style={{ width: 380 }}>
      <Timeline
        items={[
          { id: "q", title: "Queued", time: "09:31", icon: <UploadIcon />, tone: "neutral" },
          {
            id: "s",
            title: "Started",
            time: "09:32",
            icon: <PlayIcon />,
            description: "RTX 4090 · bf16 · batch 4",
          },
          {
            id: "w",
            title: "Loss spiked at step 1 840",
            time: "10:05",
            icon: <TriangleAlertIcon />,
            tone: "warn",
            description: "Recovered after the scheduler restart",
          },
          {
            id: "c",
            title: "Checkpoint saved",
            time: "10:12",
            icon: <SaveIcon />,
            tone: "success",
            children: <Code>epoch-5.safetensors</Code>,
          },
          { id: "t", title: "Training epoch 6 / 10", status: "current", time: "now", icon: <CheckIcon /> },
          { id: "e", title: "Export LoRA", status: "pending", icon: <DownloadIcon /> },
        ]}
      />
    </Card>
    <Card title="Pipeline (dots, small)" style={{ width: 300 }}>
      <Timeline
        size="sm"
        items={[
          { id: "1", title: "Import 2 412 images", time: "2m" },
          { id: "2", title: "Deduplicate", time: "14s", description: "37 near-duplicates removed" },
          { id: "3", title: "Auto-tag (WD14)", status: "current", time: <Badge size="sm">62%</Badge> },
          { id: "4", title: "Crop to buckets", status: "pending" },
          { id: "5", title: "Write captions", status: "pending" },
        ]}
      />
    </Card>
  </div>
);
