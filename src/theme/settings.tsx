import type { ReactNode } from "react";
import { Button } from "../components/button";
import { ColorSwatches, SegmentedControl, Switch } from "../components/choice";
import { Input } from "../components/input";
import { Select } from "../components/select";
import { SettingsGroup, SettingsRow } from "../components/settings-list";
import { Slider } from "../components/slider";
import { cx } from "../lib/cx";
import { RotateIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
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
  const strings = useLabels();
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
          <SettingsRow
            key={f.key}
            label={f.label}
            hint={f.hint}
            nested={f.children && v ? renderFields(f.children) : undefined}
          >
            {control(f, v, (next) => set(f.key, next), values)}
          </SettingsRow>
        );
      });

  return (
    <div className={cx("rk-settings", className)} data-variant={variant}>
      {shown.map((s) => (
        <SettingsGroup
          key={s.id}
          variant={variant === "cards" ? "card" : "plain"}
          title={s.title}
          description={s.description}
        >
          {renderFields(s.fields)}
        </SettingsGroup>
      ))}
      {resettable && (
        <div className="rk-settings-footer">
          <Button variant="ghost" size="sm" icon={<RotateIcon />} onClick={() => reset()}>
            {strings.resetDefaults}
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
