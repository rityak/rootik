import type { ReactNode } from "react";
import { APPEARANCE_SECTIONS, MATERIALS, SegmentedControl, useAppearance, walkFields } from "..";

const NOTES: Record<string, string> = {
  solid: "Opaque surfaces, no ambient light",
  veil: "Default · 80% surfaces, 10px blur, faint ambient glow",
  frost: "58% frosted glass, 22px blur, hairline rim",
  liquid: "40% glass, specular rim and sheen, neutral ambient",
};

const title = (s: string) => s[0]?.toUpperCase() + s.slice(1);

const FIELD_OPTIONS: Record<string, { value: string; label: string }[]> = {};
walkFields(APPEARANCE_SECTIONS, (f) => {
  if (f.type === "segmented") FIELD_OPTIONS[f.key] = [...f.options];
});

/**
 * Story frame: quick controls for the real appearance settings (layout, surfaces) on top, the app below
 * in a page, desktop window or phone frame.
 */
export function Stage({
  frame = "full",
  children,
}: {
  frame?: "full" | "window" | "phone";
  children: ReactNode;
}) {
  const { values, set } = useAppearance();
  const material = String(values.material);
  return (
    <div className="stage" data-frame={frame}>
      <div className="stage-bar">
        <SegmentedControl
          size="sm"
          aria-label="Layout"
          value={String(values.layout)}
          onChange={(v) => set("layout", v)}
          options={[
            { value: "islands", label: "Islands" },
            { value: "inset", label: "Inset" },
          ]}
        />
        <SegmentedControl
          size="sm"
          aria-label="Surface material"
          value={material}
          onChange={(v) => set("material", v)}
          options={Object.keys(MATERIALS).map((m) => ({ value: m, label: title(m) }))}
        />
        {(["style", "spacing", "dock"] as const).map((key) => (
          <SegmentedControl
            key={key}
            size="sm"
            aria-label={title(key)}
            value={String(values[key])}
            onChange={(v) => set(key, v)}
            options={FIELD_OPTIONS[key] ?? []}
          />
        ))}
        <span>{values.style === "fluent" ? "Fluent: solid, no glass" : NOTES[material]}</span>
      </div>
      <div className="stage-frame">
        <div className="stage-device">{children}</div>
      </div>
    </div>
  );
}
