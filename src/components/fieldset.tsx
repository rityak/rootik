import type { FieldsetHTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: ReactNode;
  /** Line under the legend. */
  description?: ReactNode;
  /** plain — legend over a stack; outline — a lined box (grouped options inside a form). */
  variant?: "plain" | "outline";
  /** Lay the children out in a row (wrapping), e.g. a pair of short fields. */
  row?: boolean;
}

/**
 * Native <fieldset>: the legend names the group for screen readers and `disabled` switches off every
 * control inside (inputs, selects, buttons, switches), so a whole section can be locked at once.
 */
export function Fieldset({
  legend,
  description,
  variant = "plain",
  row,
  className,
  children,
  ...rest
}: FieldsetProps) {
  return (
    <fieldset {...rest} className={cx("rk-fieldset", className)} data-variant={variant}>
      {legend && <legend className="rk-fieldset-legend">{legend}</legend>}
      {description && <p className="rk-fieldset-desc">{description}</p>}
      <div className="rk-fieldset-body" data-row={row || undefined}>
        {children}
      </div>
    </fieldset>
  );
}
