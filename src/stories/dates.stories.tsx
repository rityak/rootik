import type { Story } from "@ladle/react";
import { useState } from "react";
import { DateRange, type DateRangeValue, Field, Input, NativeSelect, resolveRange } from "..";

export default { title: "Inputs" };

export const Dates: Story = () => {
  const [range, setRange] = useState<DateRangeValue>({ preset: "24h" });
  const r = resolveRange(range, [
    { id: "1h", label: "", ms: 3_600_000 },
    { id: "24h", label: "", ms: 86_400_000 },
    { id: "7d", label: "", ms: 7 * 86_400_000 },
    { id: "30d", label: "", ms: 30 * 86_400_000 },
  ]);
  return (
    <div className="story-col" style={{ maxWidth: 640, gap: 20 }}>
      <div className="story-col" style={{ gap: 8 }}>
        <DateRange aria-label="Log window" value={range} onChange={setRange} />
        <span style={{ color: "var(--rk-text-3)" }}>
          {r ? `${r.from.toLocaleString()} → ${r.to.toLocaleString()}` : "Incomplete range"}
        </span>
      </div>
      <div className="story-row" style={{ gap: 12, alignItems: "flex-end" }}>
        <Field label="Date">
          <Input type="date" defaultValue="2026-09-25" />
        </Field>
        <Field label="Time">
          <Input type="time" defaultValue="14:30" />
        </Field>
        <Field label="Protocol (native select)">
          <NativeSelect
            defaultValue="vless"
            options={[
              { value: "vless", label: "VLESS" },
              { value: "hy2", label: "Hysteria 2" },
              { value: "wg", label: "WireGuard" },
              { value: "ss", label: "Shadowsocks", disabled: true },
            ]}
          />
        </Field>
      </div>
    </div>
  );
};
