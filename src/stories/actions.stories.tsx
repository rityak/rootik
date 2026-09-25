import type { Story } from "@ladle/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Download,
  Play,
  Plus,
  Save,
  Settings,
  Trash,
} from "lucide-react";
import { Button, ButtonGroup, ConfirmButton, IconButton } from "..";

export default { title: "Actions" };

const variants = ["primary", "secondary", "outline", "ghost", "inverse", "danger", "warn"] as const;

export const Buttons: Story = () => (
  <div className="story-col">
    {(["sm", "md", "lg"] as const).map((size) => (
      <div key={size} className="story-row">
        <span className="story-label" style={{ width: 24 }}>
          {size}
        </span>
        {variants.map((v) => (
          <Button key={v} variant={v} size={size}>
            {v[0]?.toUpperCase() + v.slice(1)}
          </Button>
        ))}
      </div>
    ))}
    <div className="story-row">
      <Button variant="primary" icon={<Play />}>
        Start training
      </Button>
      <Button icon={<Download />}>Export</Button>
      <Button variant="ghost" iconEnd={<Settings />}>
        Options
      </Button>
      <Button variant="primary" loading>
        Saving
      </Button>
      <Button disabled>Disabled</Button>
      <Button active icon={<Save />}>
        Autosave on
      </Button>
    </div>
    <div style={{ maxWidth: 320 }}>
      <Button variant="inverse" size="lg" block>
        Full width
      </Button>
    </div>
  </div>
);

export const IconButtons: Story = () => (
  <div className="story-col">
    <div className="story-row">
      {variants.map((v) => (
        <IconButton key={v} variant={v} icon={<Plus />} label={`Add (${v})`} />
      ))}
    </div>
    <div className="story-row">
      <IconButton size="sm" icon={<Settings />} label="Settings" />
      <IconButton size="md" icon={<Settings />} label="Settings" />
      <IconButton size="lg" icon={<Settings />} label="Settings" variant="secondary" round />
      <IconButton size="lg" icon={<Plus />} label="Create" variant="inverse" round />
      <IconButton icon={<Save />} label="Pinned" active />
    </div>
  </div>
);

export const Groups: Story = () => (
  <div className="story-col">
    <ButtonGroup aria-label="Alignment">
      <IconButton variant="secondary" icon={<AlignLeft />} label="Left" active />
      <IconButton variant="secondary" icon={<AlignCenter />} label="Center" />
      <IconButton variant="secondary" icon={<AlignRight />} label="Right" />
    </ButtonGroup>
    <ButtonGroup>
      <Button variant="secondary">Day</Button>
      <Button variant="secondary">Week</Button>
      <Button variant="secondary">Month</Button>
    </ButtonGroup>
  </div>
);

export const Confirm: Story = () => (
  <div className="story-row">
    <ConfirmButton icon={<Trash />} onConfirm={() => alert("Deleted")}>
      Delete preset
    </ConfirmButton>
    <ConfirmButton size="sm" variant="outline" confirmLabel="Really reset?" onConfirm={() => {}}>
      Reset
    </ConfirmButton>
  </div>
);
