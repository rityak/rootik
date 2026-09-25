import type { Story } from "@ladle/react";
import { useEffect, useRef, useState } from "react";
import { Button, Card, StickToBottom } from "..";

export default { title: "Layout" };

const LEVELS = ["info", "info", "info", "warn", "debug"] as const;
const line = (n: number) => ({
  n,
  level: LEVELS[n % LEVELS.length] ?? "info",
  text: `step ${n} · loss ${(2.4 / Math.log(n + 3)).toFixed(4)} · lr 3.0e-4 · ${(120 + (n % 7) * 3).toFixed(0)} img/s`,
});

export const Following: Story = () => {
  const [lines, setLines] = useState(() => Array.from({ length: 30 }, (_, i) => line(i + 100)));
  const [unseen, setUnseen] = useState(0);
  const following = useRef(true);
  useEffect(() => {
    const id = setInterval(() => {
      setLines((l) => [...l, line((l.at(-1)?.n ?? 0) + 1)]);
      if (!following.current) setUnseen((u) => u + 1);
    }, 700);
    return () => clearInterval(id);
  }, []);
  const earlier = () =>
    setLines((l) => [...Array.from({ length: 20 }, (_, i) => line((l[0]?.n ?? 0) - 20 + i)), ...l]);
  return (
    <Card
      title="Training log"
      description="Pinned while at the bottom; scroll up to stop following"
      actions={
        <Button size="sm" onClick={earlier}>
          Load earlier
        </Button>
      }
      padding="none"
      style={{ maxWidth: 620 }}
    >
      <StickToBottom
        style={{ height: 280 }}
        unseen={unseen}
        onFollowChange={(f) => {
          following.current = f;
          if (f) setUnseen(0);
        }}
      >
        <div role="log" className="rk-mono" style={{ padding: "8px 16px", fontSize: 12, lineHeight: 1.7 }}>
          {lines.map((l) => (
            <div
              key={l.n}
              style={{
                color:
                  l.level === "warn"
                    ? "var(--rk-warn)"
                    : l.level === "debug"
                      ? "var(--rk-text-3)"
                      : "var(--rk-text-2)",
              }}
            >
              {l.text}
            </div>
          ))}
        </div>
      </StickToBottom>
    </Card>
  );
};
