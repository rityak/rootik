import type { Story } from "@ladle/react";
import { Card, Spoiler } from "..";

export default { title: "Display" };

export const Spoilers: Story = () => (
  <div className="story-row" style={{ alignItems: "flex-start" }}>
    <Card title="v0.14 release notes" style={{ width: 360 }}>
      <Spoiler maxHeight={88}>
        <ul style={{ margin: 0, paddingInlineStart: 18, color: "var(--rk-text-2)", lineHeight: 1.6 }}>
          <li>Training resumes from the last checkpoint after a crash</li>
          <li>Bucketing respects the aspect-ratio step setting</li>
          <li>Caption editor: tag autocomplete from the dataset vocabulary</li>
          <li>
            Gallery: 5 000+ images scroll smoothly (virtualized) — <a href="#notes">details</a>
          </li>
          <li>Log dock follows the tail and counts new lines while scrolled up</li>
          <li>Fixed: EXIF rotation ignored on import</li>
        </ul>
      </Spoiler>
    </Card>
    <Card title="Short caption" style={{ width: 280 }}>
      <Spoiler maxHeight={88}>
        <p style={{ margin: 0, color: "var(--rk-text-2)" }}>Fits, so there is no toggle.</p>
      </Spoiler>
    </Card>
  </div>
);
