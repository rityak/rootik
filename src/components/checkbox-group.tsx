import { type ReactNode, useId } from "react";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
import { useLabels } from "../lib/labels";
import { Checkbox } from "./choice";
import { useFieldLabel } from "./input";

export interface CheckboxGroupOption<T extends string = string> {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps<T extends string = string> {
  options: ReadonlyArray<CheckboxGroupOption<T>>;
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
  /** Parent checkbox that checks or clears every enabled option; `true` uses labels.selectAll. */
  selectAll?: ReactNode | true;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

/**
 * A group of checkboxes, optionally under a parent "select all" that turns indeterminate while only some
 * are checked. Disabled options keep their state when the parent toggles. Values stay in option order.
 */
export function CheckboxGroup<T extends string = string>({
  options,
  value,
  defaultValue = [],
  onChange,
  selectAll,
  orientation = "vertical",
  disabled,
  className,
  ...rest
}: CheckboxGroupProps<T>) {
  const fieldLabel = useFieldLabel();
  const labels = useLabels();
  const [checked, setChecked] = useControllable(value, defaultValue, onChange);
  const id = useId();
  const has = (v: T) => checked.includes(v);
  const ordered = (set: Set<T>) => options.filter((o) => set.has(o.value)).map((o) => o.value);
  const toggle = (v: T) => {
    const set = new Set(checked);
    if (set.has(v)) set.delete(v);
    else set.add(v);
    setChecked(ordered(set));
  };

  const enabled = options.filter((o) => !(o.disabled || disabled));
  const allOn = enabled.length > 0 && enabled.every((o) => has(o.value));
  const someOn = options.some((o) => has(o.value));
  const setAll = (on: boolean) => {
    const set = new Set(checked);
    for (const o of enabled) {
      if (on) set.add(o.value);
      else set.delete(o.value);
    }
    setChecked(ordered(set));
  };

  const items = (
    <div className="rk-checkbox-group-items" data-orientation={orientation}>
      {options.map((o, i) => (
        <Checkbox
          key={o.value}
          id={`${id}-${i}`}
          label={o.label}
          description={o.description}
          disabled={disabled || o.disabled}
          checked={has(o.value)}
          onChange={() => toggle(o.value)}
        />
      ))}
    </div>
  );

  return (
    // biome-ignore lint/a11y/useSemanticElements: wrap in Fieldset for a legend; the group role names the set
    <div
      role="group"
      aria-label={rest["aria-label"]}
      aria-labelledby={rest["aria-label"] ? undefined : fieldLabel}
      className={cx("rk-checkbox-group", className)}
    >
      {selectAll === undefined || selectAll === false ? (
        items
      ) : (
        <>
          <Checkbox
            label={selectAll === true ? labels.selectAll : selectAll}
            checked={allOn}
            indeterminate={someOn && !allOn}
            disabled={disabled || enabled.length === 0}
            aria-controls={options.map((_, i) => `${id}-${i}`).join(" ")}
            onChange={() => setAll(!allOn)}
          />
          <div className="rk-checkbox-group-nested">{items}</div>
        </>
      )}
    </div>
  );
}
