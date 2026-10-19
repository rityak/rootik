import type { SelectHTMLAttributes } from "react";
import { SvgControlFrame, useSvgControlBorder } from "../components/svg-control-frame";
import { cx } from "../lib/cx";
import { useField } from "../lib/field-context";
import { ChevronDownIcon } from "../lib/icons";
import type { SvgControlBorder } from "../lib/svg-geometry";
import type { Size } from "./button";

export interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: ReadonlyArray<{ value: string; label: string; disabled?: boolean }>;
  size?: Size;
  svgBorder?: SvgControlBorder;
}

/**
 * A real `<select>` in kit styling: forms, autofill and mobile pickers for free. Where the browser supports
 * `appearance: base-select` the popup is styled too; elsewhere it's the OS list. Use Select for icons,
 * hints or a themed popup everywhere.
 */
export function NativeSelect({ options, size = "md", svgBorder, className, ...rest }: NativeSelectProps) {
  const field = useField(rest);
  const border = useSvgControlBorder(svgBorder);
  return (
    <span
      className={cx("rk-native-select-wrap", className)}
      data-svg-border={border}
      data-disabled={rest.disabled || undefined}
      data-invalid={field["aria-invalid"] || undefined}
    >
      {border && <SvgControlFrame border={border} />}
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
