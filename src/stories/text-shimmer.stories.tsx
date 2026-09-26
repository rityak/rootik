import type { Story } from "@ladle/react";
import { useEffect, useState } from "react";
import { Card, Spinner, TextShimmer } from "..";

export default { title: "Display" };

export const TextShimmers: Story = () => {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setDone((d) => !d), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="story-col" style={{ gap: 16 }}>
      <TextShimmer style={{ fontSize: 22, fontWeight: 300 }}>Connecting to n1-ams-02…</TextShimmer>
      <Card padding="sm" style={{ width: 320 }}>
        <div className="story-row" style={{ gap: 8 }}>
          {!done && <Spinner size={14} />}
          <TextShimmer active={!done}>{done ? "Indexed 48,210 images" : "Indexing…"}</TextShimmer>
        </div>
      </Card>
    </div>
  );
};
