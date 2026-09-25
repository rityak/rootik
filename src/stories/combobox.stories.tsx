import type { Story } from "@ladle/react";
import { Globe, Search } from "lucide-react";
import { useState } from "react";
import { Card, Combobox, type ComboboxOption, Field } from "..";

export default { title: "Inputs" };

const cities: ComboboxOption[] = [
  "Amsterdam",
  "Berlin",
  "Frankfurt",
  "Helsinki",
  "Istanbul",
  "London",
  "Madrid",
  "New York",
  "Paris",
  "Singapore",
  "Stockholm",
  "Tokyo",
  "Warsaw",
].map((c) => ({ value: c.toLowerCase().replace(/\s/g, "-"), label: c, icon: <Globe /> }));

const models = Array.from({ length: 400 }, (_, i) => `sdxl-finetune-${String(i + 1).padStart(3, "0")}`);
const search = (query: string, signal: AbortSignal) =>
  new Promise<ComboboxOption[]>((resolve, reject) => {
    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      resolve(
        models
          .filter((m) => m.includes(q))
          .slice(0, 8)
          .map((m) => ({ value: m, label: m, hint: `${(Number(m.slice(-3)) * 37) % 900} MB` })),
      );
    }, 450);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("aborted", "AbortError"));
    });
  });

export const Comboboxes: Story = () => {
  const [city, setCity] = useState<string | null>("frankfurt");
  const [model, setModel] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  return (
    <Card title="Pick or type" style={{ maxWidth: 420, minHeight: 440 }}>
      <div className="story-col">
        <Field label="Exit city" aside={city ?? "—"}>
          <Combobox options={cities} value={city} onChange={setCity} placeholder="Search cities…" />
        </Field>
        <Field
          label="Checkpoint (async)"
          hint="Results load 450 ms after you stop typing"
          aside={model ?? "—"}
        >
          <Combobox
            loadOptions={search}
            value={model}
            onChange={setModel}
            icon={<Search />}
            placeholder="sdxl-…"
          />
        </Field>
        <Field label="Tag (custom allowed)" aside={tag ?? "—"}>
          <Combobox
            allowCustom
            options={["1girl", "solo", "smile", "outdoors"].map((t) => ({ value: t, label: t }))}
            value={tag}
            onChange={setTag}
            size="sm"
          />
        </Field>
      </div>
    </Card>
  );
};
