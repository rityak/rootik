import type { Story } from "@ladle/react";
import {
  CalendarDays,
  Check,
  FolderOpen,
  Globe,
  HeartPulse,
  MapPin,
  Upload,
  Users,
  Wind,
} from "lucide-react";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Callout,
  Card,
  Divider,
  EmptyState,
  IconButton,
  Kbd,
  KeyValue,
  Nest,
  Progress,
  ProgressRing,
  SectionLabel,
  Skeleton,
  Spinner,
  Stat,
  StatusDot,
  Switch,
} from "..";

export default { title: "Display" };

const tones = ["neutral", "accent", "success", "warn", "danger", "info"] as const;

export const Badges: Story = () => (
  <div className="story-col">
    {(["soft", "solid", "outline"] as const).map((variant) => (
      <div key={variant} className="story-row">
        {tones.map((t) => (
          <Badge key={t} tone={t} variant={variant}>
            {t}
          </Badge>
        ))}
      </div>
    ))}
    <div className="story-row">
      <Badge tone="success" dot>
        Connected
      </Badge>
      <Badge tone="accent" icon={<Check />}>
        Applied
      </Badge>
      <Badge size="sm">2.4K</Badge>
      <Badge onRemove={() => {}}>long_hair</Badge>
      <Badge tone="accent" onRemove={() => {}}>
        1girl
      </Badge>
    </div>
    <div className="story-row">
      <StatusDot tone="success" label="Online" />
      <StatusDot tone="warn" pulse label="Connecting" />
      <StatusDot tone="danger" label="Error" />
      <StatusDot tone="neutral" label="Off" />
      <StatusDot tone="accent" pulse />
    </div>
    <div className="story-row">
      <Kbd keys="mod+k" />
      <Kbd keys="mod+shift+p" />
      <Kbd>Esc</Kbd>
      <Kbd size="sm">↵</Kbd>
    </div>
  </div>
);

export const Avatars: Story = () => (
  <div className="story-row">
    <Avatar name="Biromon Junior" size={40} status="success" />
    <Avatar name="Robert Sanchez" />
    <Avatar name="Lily Alexander" size={28} square />
    <AvatarGroup max={3}>
      <Avatar name="Ann Lee" />
      <Avatar name="Max Payne" />
      <Avatar name="Tom Hardy" />
      <Avatar name="Zoe Kim" />
      <Avatar name="Olga Ro" />
    </AvatarGroup>
  </div>
);

export const Cards: Story = () => (
  <div className="story-grid">
    <Card title="Default" description="Surface with inner highlight">
      Body text on the first surface.
    </Card>
    <Card title="Glow" variant="glow" description="Featured / promo">
      Soft accent radial glow.
    </Card>
    <Card
      title="Inverse"
      variant="inverse"
      description="Spotlight card"
      actions={<IconButton icon={<Upload />} label="Upload" />}
    >
      <div className="story-col" style={{ gap: 10 }}>
        <Switch label="Tokens adapt inside" defaultChecked />
        <Progress value={64} showValue label="Upload" />
      </div>
    </Card>
    <Card title="Outline" variant="outline">
      For nested groups.
    </Card>
    <Card title="Sunken" variant="sunken">
      Recessed well.
    </Card>
    <Card title="Collapsible" collapsible description="Click the header">
      Hidden content.
    </Card>
  </div>
);

export const Stats: Story = () => (
  <div className="story-col">
    <div className="story-row" style={{ gap: 40 }}>
      <Stat label="Heart rate" value="68.42" unit="bpm" icon={<HeartPulse size={14} />} delta={12} />
      <Stat label="Respiration" value="14.80" unit="min" icon={<Wind size={14} />} />
      <Stat label="Latency" value="42" unit="ms" delta={-18} invert hint="p95, last hour" />
      <Stat label="Errors" value="3" delta={50} invert />
    </div>
    <div className="story-row" style={{ gap: 40, alignItems: "flex-end" }}>
      <Stat size="sm" label="Small" value="1,284" />
      <Stat size="md" label="Medium" value="1,284" />
      <Stat size="lg" label="Large" value="860" unit="Wh" />
      <Stat size="xl" label="Hero" value="432" unit="pts" />
    </div>
  </div>
);

export const Details: Story = () => (
  <div className="story-grid">
    <Card title="Personal information">
      <KeyValue
        items={[
          { label: "Place of birth", value: "Bandung, Indonesia", icon: <MapPin size={14} /> },
          { label: "Residence", value: "USA, America", icon: <Globe size={14} /> },
          { label: "Joined", value: "7/1/2023", icon: <CalendarDays size={14} /> },
        ]}
      />
    </Card>
    <Card title="Run">
      <KeyValue
        layout="grid"
        items={[
          { label: "Steps", value: "4,200" },
          { label: "Batch", value: "4" },
          { label: "LR", value: "1e-4" },
          { label: "Rank", value: "32" },
        ]}
      />
    </Card>
  </div>
);

export const Feedback: Story = () => (
  <div className="story-col" style={{ maxWidth: 560 }}>
    <Callout title="Dataset has 12 images without captions">They will be skipped during training.</Callout>
    <Callout tone="success" title="Saved" onDismiss={() => {}} />
    <Callout tone="warn" title="Core is outdated" actions={<Button size="sm">Update to 1.19.2</Button>}>
      Some rules may not work with the installed version.
    </Callout>
    <Callout tone="danger" title="Could not start the core">
      bind: address already in use (127.0.0.1:7890)
    </Callout>
    <Divider label="Progress" />
    <Progress value={34} label="Captioning" showValue />
    <Progress value={80} tone="success" size="sm" />
    <Progress label="Indexing…" />
    <div className="story-row">
      <ProgressRing value={72} />
      <ProgressRing value={30} tone="warn" size={36} thickness={3} />
      <Spinner />
      <Spinner size={24} />
    </div>
    <Divider label="Loading" />
    <div className="story-row" style={{ alignItems: "flex-start" }}>
      <Skeleton round width={40} height={40} />
      <Skeleton lines={3} style={{ flex: 1 }} />
    </div>
  </div>
);

export const Empty: Story = () => (
  <div className="story-grid">
    <Card>
      <EmptyState
        icon={<FolderOpen />}
        title="Select a dataset folder"
        hint="A dataset is a folder of images with .txt captions next to them."
        action={<Button variant="primary">Open folder</Button>}
      />
    </Card>
    <Card>
      <EmptyState size="sm" icon={<Users />} title="No subscriptions" hint="Add a link to import nodes." />
    </Card>
  </div>
);

export const Structure: Story = () => (
  <div className="story-col" style={{ maxWidth: 420 }}>
    <SectionLabel action={<IconButton size="sm" icon={<Upload />} label="Import" />}>Presets</SectionLabel>
    <Switch label="Sniffing" defaultChecked />
    <Nest>
      <Switch label="Override destination" />
      <Switch label="Parse pure IP" defaultChecked />
    </Nest>
    <Divider />
    <div className="story-row" style={{ height: 24 }}>
      <span>Left</span>
      <Divider vertical />
      <span>Right</span>
    </div>
  </div>
);
