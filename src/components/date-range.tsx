import { useControllable } from "../lib/hooks";
import { useLabels } from "../lib/labels";
import type { Size } from "./button";
import { Input } from "./input";
import { Select } from "./select";

export interface DatePreset {
  id: string;
  label: string;
  /** Window length ending now, ms. */
  ms: number;
}

/** A preset window ending now, or a custom range as `datetime-local` strings ("2026-09-25T14:30"). */
export type DateRangeValue = { preset: string } | { from: string; to: string };

/** Absolute bounds of a range value (presets end at `now`). */
export function resolveRange(
  value: DateRangeValue,
  presets: ReadonlyArray<DatePreset>,
  now = Date.now(),
): { from: Date; to: Date } | null {
  if ("preset" in value) {
    const p = presets.find((x) => x.id === value.preset);
    return p ? { from: new Date(now - p.ms), to: new Date(now) } : null;
  }
  const from = new Date(value.from);
  const to = new Date(value.to);
  return Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) ? null : { from, to };
}

const H = 3_600_000;
const pad = (n: number) => String(n).padStart(2, "0");
/** Local `datetime-local` string of a date. */
export const toLocalInput = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

export interface DateRangeProps {
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  /** Defaults: last hour, 24 hours, 7 days, 30 days. */
  presets?: ReadonlyArray<DatePreset>;
  size?: Size;
  "aria-label"?: string;
}

/** Time window picker for logs and charts: quick presets, or a custom range on native date-time inputs. */
export function DateRange({
  value,
  defaultValue,
  onChange,
  presets: own,
  size = "sm",
  ...rest
}: DateRangeProps) {
  const labels = useLabels();
  const presets = own ?? [
    { id: "1h", label: labels.lastHour, ms: H },
    { id: "24h", label: labels.last24Hours, ms: 24 * H },
    { id: "7d", label: labels.last7Days, ms: 7 * 24 * H },
    { id: "30d", label: labels.last30Days, ms: 30 * 24 * H },
  ];
  const [current, set] = useControllable<DateRangeValue>(
    value,
    defaultValue ?? { preset: presets[1]?.id ?? "" },
    onChange,
  );
  const custom = !("preset" in current);
  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset would bring a legend and a border
    <div role="group" aria-label={rest["aria-label"]} className="rk-date-range">
      <Select
        size={size}
        variant="button"
        aria-label={rest["aria-label"]}
        value={custom ? "custom" : current.preset}
        onChange={(v) => {
          if (v !== "custom") return set({ preset: v });
          // start the custom range from what was shown
          const r = resolveRange(current, presets) ?? { from: new Date(Date.now() - 24 * H), to: new Date() };
          set({ from: toLocalInput(r.from), to: toLocalInput(r.to) });
        }}
        options={[
          ...presets.map((p) => ({ value: p.id, label: p.label })),
          { value: "custom", label: labels.customRange },
        ]}
      />
      {custom && (
        <>
          <Input
            size={size}
            type="datetime-local"
            aria-label={labels.from}
            value={current.from}
            max={current.to}
            onChange={(event) => set({ ...current, from: event.target.value })}
          />
          <span className="rk-date-range-sep" aria-hidden="true">
            –
          </span>
          <Input
            size={size}
            type="datetime-local"
            aria-label={labels.to}
            value={current.to}
            min={current.from}
            onChange={(event) => set({ ...current, to: event.target.value })}
          />
        </>
      )}
    </div>
  );
}
