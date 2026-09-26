import type { Story } from "@ladle/react";
import { useRef, useState } from "react";
import {
  Button,
  Card,
  KeyValue,
  useElementSize,
  useIndicator,
  useInterval,
  useMediaQuery,
  usePersistentState,
  useWindowFocus,
} from "..";

export default { title: "Utilities" };

function PersistentCounter({ label }: { label: string }) {
  const [count, setCount] = usePersistentState("rootik-story:counter", 0);
  return (
    <div className="story-row">
      <Button size="sm" onClick={() => setCount((c) => c + 1)}>
        {label}: {count}
      </Button>
    </div>
  );
}

export const Hooks: Story = () => {
  const narrow = useMediaQuery("(max-width: 720px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const focused = useWindowFocus();
  const box = useElementSize<HTMLDivElement>();
  const [ticks, setTicks] = useState(0);
  useInterval(() => setTicks((t) => t + 1), 1000);
  return (
    <div className="story-col" style={{ maxWidth: 560 }}>
      <Card title="Live values">
        <KeyValue
          items={[
            { label: "useMediaQuery (max-width: 720px)", value: String(narrow) },
            { label: "useMediaQuery (reduced motion)", value: String(reduced) },
            { label: "useWindowFocus", value: focused ? "focused" : "blurred" },
            { label: "useInterval (1s, pauses while hidden)", value: `${ticks} ticks` },
            {
              label: "useElementSize (drag the corner)",
              value: `${Math.round(box.width)} × ${Math.round(box.height)}`,
            },
          ]}
        />
      </Card>
      <div
        ref={box.ref}
        style={{
          resize: "both",
          overflow: "auto",
          width: 240,
          height: 80,
          minWidth: 120,
          minHeight: 48,
          borderRadius: 12,
          background: "var(--rk-surface-2)",
          boxShadow: "inset 0 0 0 1px var(--rk-line)",
        }}
      />
      <Card
        title="usePersistentState"
        description="Both buttons share one key; open a second tab to see cross-tab sync"
      >
        <PersistentCounter label="A" />
        <PersistentCounter label="B" />
      </Card>
    </div>
  );
};

/** A consumer's own control with the kit's sliding indicator. */
export const IndicatorHook: Story = () => {
  const [value, setValue] = useState("week");
  const bar = useRef<HTMLDivElement>(null);
  const box = useIndicator(bar, "[aria-pressed=true]", value);
  return (
    <div ref={bar} style={{ position: "relative", display: "inline-flex", gap: 4 }}>
      {box && (
        <span
          className="rk-indicator"
          data-dir={box.dir}
          style={{ left: box.left, right: box.right, bottom: -6, height: 2, background: "var(--rk-accent)" }}
        />
      )}
      {["day", "week", "month"].map((v) => (
        <Button key={v} size="sm" variant="ghost" active={v === value} onClick={() => setValue(v)}>
          {v}
        </Button>
      ))}
    </div>
  );
};
