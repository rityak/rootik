import type { Story } from "@ladle/react";
import { Avatar, Badge, Button, HoverCard, KeyValue } from "..";

export default { title: "Overlays" };

const profile = (
  <div className="story-col" style={{ gap: 10, width: 260 }}>
    <div className="story-row" style={{ gap: 10 }}>
      <Avatar name="Kira Ito" size={40} />
      <div>
        <div style={{ fontWeight: 600 }}>Kira Ito</div>
        <div style={{ color: "var(--rk-text-3)" }}>@kira · Reviewer</div>
      </div>
    </div>
    <p style={{ margin: 0, color: "var(--rk-text-2)" }}>
      Curates the scenery sets and signs off on tag audits.
    </p>
    <Button size="sm" variant="secondary">
      Follow
    </Button>
  </div>
);

export const HoverCards: Story = () => (
  <p style={{ maxWidth: 520, lineHeight: 1.6 }}>
    Tag audit for{" "}
    <HoverCard
      content={
        <div className="story-col" style={{ gap: 8, width: 240 }}>
          <div className="story-row" style={{ justifyContent: "space-between" }}>
            <strong>anime-faces-v3</strong>
            <Badge tone="success">ready</Badge>
          </div>
          <KeyValue
            items={[
              { label: "Images", value: "48,210" },
              { label: "Size", value: "212 GB" },
              { label: "Tagged", value: "96%" },
            ]}
          />
        </div>
      }
    >
      <a href="#dataset">anime-faces-v3</a>
    </HoverCard>{" "}
    was approved by{" "}
    <HoverCard content={profile} placement="top-start">
      <a href="#kira">@kira</a>
    </HoverCard>
    . Hover or Tab to a link; the card stays while the pointer is on it, Tab moves into it, Esc closes.
  </p>
);
