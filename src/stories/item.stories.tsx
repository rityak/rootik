import type { Story } from "@ladle/react";
import { Database, FolderOpen, Globe, Images, MoreHorizontal, Star } from "lucide-react";
import { useState } from "react";
import { Avatar, Badge, Card, IconButton, Item, ItemGroup, StatusDot } from "..";

export default { title: "Display" };

const servers = [
  { id: "fra", city: "Frankfurt", host: "n3-fra-01 · WireGuard", ping: 18 },
  { id: "ams", city: "Amsterdam", host: "n1-ams-02 · VLESS Reality", ping: 24 },
  { id: "hel", city: "Helsinki", host: "n2-hel-01 · WireGuard", ping: 41 },
  { id: "nyc", city: "New York", host: "n7-nyc-03 · Hysteria 2", ping: 96 },
];

export const Items: Story = () => {
  const [server, setServer] = useState("ams");
  return (
    <div className="story-row" style={{ alignItems: "flex-start", gap: 24 }}>
      <Card title="Servers" padding="sm" style={{ width: 380 }}>
        <ItemGroup variant="divided">
          {servers.map((s) => (
            <Item
              key={s.id}
              icon={<Globe />}
              title={s.city}
              description={s.host}
              meta={`${s.ping} ms`}
              selected={server === s.id}
              onClick={() => setServer(s.id)}
              actions={<IconButton size="sm" icon={<Star />} label={`Pin ${s.city}`} />}
            />
          ))}
        </ItemGroup>
      </Card>
      <div className="story-col" style={{ width: 380 }}>
        <ItemGroup variant="cards">
          <Item
            size="lg"
            icon={<Database />}
            title="anime-faces-v3"
            description="48,210 images · 212 GB · tagged 96%"
            meta={<Badge tone="success">ready</Badge>}
            href="#dataset"
            actions={<IconButton size="sm" icon={<MoreHorizontal />} label="Dataset actions" />}
          />
          <Item
            size="lg"
            icon={<Images />}
            title="scenery-mix"
            description="Importing… 12,400 of 30,000"
            meta={<StatusDot tone="warn" pulse label="Importing" hideLabel />}
            href="#dataset"
          />
        </ItemGroup>
        <Card padding="sm">
          <ItemGroup>
            <Item size="sm" icon={<FolderOpen />} title="D:/datasets" meta="3 folders" onClick={() => {}} />
            <Item
              size="sm"
              media={<Avatar name="Kira Ito" size={24} />}
              title="Kira Ito"
              description="Reviewer"
            />
            <Item size="sm" icon={<FolderOpen />} title="Archive" disabled onClick={() => {}} />
          </ItemGroup>
        </Card>
      </div>
    </div>
  );
};
