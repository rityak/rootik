import type { Story } from "@ladle/react";
import { ImageOffIcon } from "lucide-react";
import { useState } from "react";
import { Button, Card, DataState, type DataStatus, SegmentedControl, Skeleton } from "..";

export default { title: "Data" };

export const DataStates: Story = () => {
  const [status, setStatus] = useState<DataStatus>("loading");
  const [tries, setTries] = useState(0);
  return (
    <div className="story-col" style={{ maxWidth: 480 }}>
      <SegmentedControl<DataStatus>
        aria-label="State"
        value={status}
        onChange={setStatus}
        options={[
          { value: "loading", label: "Loading" },
          { value: "error", label: "Error" },
          { value: "empty", label: "Empty" },
          { value: "ready", label: "Ready" },
        ]}
      />
      <Card title="Recent runs">
        <DataState
          status={status}
          error={new Error(`Server returned 502 (attempt ${tries + 1})`)}
          onRetry={() => {
            setTries(tries + 1);
            setStatus("loading");
            setTimeout(() => setStatus("ready"), 800);
          }}
          skeleton={
            <div className="story-col" style={{ gap: 10 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="story-row" style={{ gap: 10 }}>
                  <Skeleton width={28} height={28} round />
                  <Skeleton height={12} style={{ flex: 1 }} />
                </div>
              ))}
            </div>
          }
          emptyState={{
            icon: <ImageOffIcon />,
            title: "No runs yet",
            hint: "Start a training run to see it here",
            action: <Button size="sm">New run</Button>,
          }}
        >
          {() => (
            <ul style={{ margin: 0, paddingInlineStart: 18, color: "var(--rk-text-2)" }}>
              <li>anime-faces · epoch 10 · done</li>
              <li>product-shots · epoch 4 · running</li>
              <li>landscapes · failed</li>
            </ul>
          )}
        </DataState>
      </Card>
    </div>
  );
};
