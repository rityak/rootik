import type { Story } from "@ladle/react";
import { BellIcon, InboxIcon, MessageSquareIcon } from "lucide-react";
import { useState } from "react";
import { Avatar, Button, Card, IconButton, Indicator } from "..";

export default { title: "Display" };

export const Indicators: Story = () => {
  const [unread, setUnread] = useState(3);
  return (
    <div className="story-col">
      <div className="story-row" style={{ gap: 28 }}>
        <Indicator count={unread} label={`${unread} unread`}>
          <IconButton icon={<BellIcon />} label="Notifications" variant="secondary" />
        </Indicator>
        <Indicator count={128} tone="accent">
          <IconButton icon={<InboxIcon />} label="Inbox" variant="secondary" />
        </Indicator>
        <Indicator pulse tone="success" label="Live">
          <IconButton icon={<MessageSquareIcon />} label="Chat" variant="secondary" />
        </Indicator>
        <Indicator round tone="success" position="bottom-end" label="Online">
          <Avatar name="Kira Novak" size={40} />
        </Indicator>
        <Indicator round count={2}>
          <Avatar name="Umi Ray" size={40} />
        </Indicator>
        <Indicator position="top-start" tone="warn" label="Needs attention">
          <Button size="sm" variant="secondary">
            Settings
          </Button>
        </Indicator>
      </div>
      <Card style={{ maxWidth: 360 }}>
        <div className="story-row">
          <Button size="sm" onClick={() => setUnread((n) => n + 1)}>
            New message
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setUnread(0)}>
            Mark all read
          </Button>
          <span style={{ color: "var(--rk-text-3)" }}>0 hides the count</span>
        </div>
      </Card>
    </div>
  );
};
