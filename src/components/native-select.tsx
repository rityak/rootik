import type { SelectHTMLAttributes } from "react";
import { cx } from "../lib/cx";
import { ChevronDownIcon } from "../lib/icons";
import type { Size } from "./button";
import { useField } from "./input";

export interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: ReadonlyArray<{ value: string; label: string; disabled?: boolean }>;
  size?: Size;
}

/**
 * A real `<select>` in kit styling: forms, autofill and mobile pickers for free. Where the browser supports
 * `appearance: base-select` the popup is styled too; elsewhere it's the OS list. Use Select for icons,
 * hints or a themed popup everywhere.
 */
export function NativeSelect({ options, size = "md", className, ...rest }: NativeSelectProps) {
  const field = useField(rest);
  return (
    <span className={cx("rk-native-select-wrap", className)}>
      <select {...rest} {...field} className="rk-select-trigger rk-native-select" data-size={size}>
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="rk-native-select-chevron" aria-hidden="true" />
    </span>
  );
}
