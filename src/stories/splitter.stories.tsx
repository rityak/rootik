import type { Story } from "@ladle/react";
import { useState } from "react";
import { Card, CodeBlock, Splitter } from "..";

export default { title: "Layout" };

const pane = (title: string, body: string) => (
  <div style={{ padding: 16 }}>
    <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
    <div style={{ color: "var(--rk-text-3)" }}>{body}</div>
  </div>
);

export const Splitters: Story = () => {
  const [size, setSize] = useState(40);
  return (
    <div className="story-col">
      <Card padding="none" style={{ height: 320 }}>
        <Splitter storageKey="rootik-story:splitter" defaultSize={35} style={{ height: "100%" }}>
          {pane(
            "Images",
            "Drag the divider, or focus it and use ←/→ (Shift = 10%), Home/End; Enter or double-click resets. Remembered in localStorage.",
          )}
          <Splitter orientation="vertical" defaultSize={60} style={{ height: "100%" }}>
            {pane("Preview", "Nested vertical split")}
            <div style={{ padding: 12 }}>
              <CodeBlock title="caption.txt" code={"1girl, solo, long hair, looking at viewer"} />
            </div>
          </Splitter>
        </Splitter>
      </Card>
      <Card padding="none" style={{ height: 160 }}>
        <Splitter size={size} onSizeChange={setSize} min={25} max={75} style={{ height: "100%" }}>
          {pane("Controlled", `${size}%`)}
          {pane("Bounds", "25–75%")}
        </Splitter>
      </Card>
    </div>
  );
};
