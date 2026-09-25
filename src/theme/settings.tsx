import type { ReactNode } from "react";
import { Button } from "../components/button";
import { Card, Nest } from "../components/card";
import { ColorSwatches, SegmentedControl, Switch } from "../components/choice";
import { Field, Input } from "../components/input";
import { Select } from "../components/select";
import { Slider } from "../components/slider";
import { cx } from "../lib/cx";
import { RotateIcon } from "../lib/icons";
import { useAppearance } from "./provider";
import type { AppearanceValues, SettingsField, SettingValue } from "./schema";

export interface AppearanceSettingsProps {
  /** Section ids to show, in this order; default: all (built-in + extensions). */
  only?: ReadonlyArray<string>;
  /** Render sections as cards (settings page) or plain groups (inside a dialog/popover). */
  variant?: "cards" | "plain";
  /** Show "Reset to defaults". */
  resettable?: boolean;
  className?: string;
}

/** Appearance form rendered from the provider's schema — built-in knobs plus project extensions. */
export function AppearanceSettings({
  only,
  variant = "cards",
  resettable = true,
  className,
}: AppearanceSettingsProps) {
  const { sections, values, set, reset } = useAppearance();
  const shown = only
    ? only.map((id) => sections.find((s) => s.id === id)).filter((s) => s !== undefined)
    : sections;

  const renderFields = (fields: ReadonlyArray<SettingsField>): ReactNode =>
    fields
      .filter((f) => !f.visible || f.visible(values))
      .map((f) => {
        const v = values[f.key] ?? f.default;
        return (
          <div key={f.key} className="rk-settings-field">
            <Field layout="inline" label={f.label} hint={f.hint}>
              {control(f, v, (next) => set(f.key, next), values)}
            </Field>
            {f.children && Boolean(v) && <Nest>{renderFields(f.children)}</Nest>}
          </div>
        );
      });

  return (
    <div className={cx("rk-settings", className)} data-variant={variant}>
      {shown.map((s) =>
        variant === "cards" ? (
          <Card key={s.id} title={s.title} description={s.description}>
            <div className="rk-settings-fields">{renderFields(s.fields)}</div>
          </Card>
        ) : (
          <section key={s.id} className="rk-settings-group">
            <h3 className="rk-settings-title">{s.title}</h3>
            {s.description && <p className="rk-settings-desc">{s.description}</p>}
            <div className="rk-settings-fields">{renderFields(s.fields)}</div>
          </section>
        ),
      )}
      {resettable && (
        <div className="rk-settings-footer">
          <Button variant="ghost" size="sm" icon={<RotateIcon />} onClick={() => reset()}>
            Reset to defaults
          </Button>
        </div>
      )}
    </div>
  );
}

function control(
  f: SettingsField,
  v: SettingValue,
  set: (value: SettingValue) => void,
  values: AppearanceValues,
): ReactNode {
  switch (f.type) {
    case "toggle":
      return <Switch checked={Boolean(v)} onChange={(e) => set(e.target.checked)} />;
    case "select":
      return (
        <Select
          size="sm"
          options={f.options}
          value={String(v)}
          onChange={set}
          className="rk-settings-select"
        />
      );
    case "segmented":
      return <SegmentedControl size="sm" options={f.options} value={String(v)} onChange={set} />;
    case "slider":
      return (
        <Slider
          className="rk-settings-slider"
          min={f.min}
          max={f.max}
          step={f.step}
          value={Number(v)}
          onChange={set}
          showValue={f.format ?? true}
        />
      );
    case "color":
      return <ColorSwatches options={f.swatches ?? []} value={String(v)} onChange={set} custom />;
    case "text":
      return (
        <Input
          size="sm"
          value={String(v)}
          placeholder={f.placeholder}
          onChange={(e) => set(e.target.value)}
        />
      );
    case "custom":
      return f.render(v, set, values);
  }
}
