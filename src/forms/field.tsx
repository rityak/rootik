import { type ReactNode, useId } from "react";
import { cx } from "../lib/cx";
import { FieldContext } from "../lib/field-context";
import { useFormError } from "./form";

export { useField, useFieldLabel } from "../lib/field-context";

export interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** `inline`: label and hint on the left, control on the right (settings rows). */
  layout?: "stack" | "inline";
  /** Extra content right of the label (value readout, link). */
  aside?: ReactNode;
  id?: string;
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  hint,
  error: errorProp,
  required,
  layout = "stack",
  aside,
  id,
  className,
  children,
}: FieldProps) {
  const auto = useId();
  const controlId = id ?? auto;
  const formError = useFormError(controlId);
  const error = errorProp ?? formError;
  // a stacked hint gives way to the error, so it is only referenced while shown
  const hintId = hint && (layout === "inline" || !error) ? `${controlId}-hint` : undefined;
  const labelId = label ? `${controlId}-label` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  return (
    <FieldContext
      value={{
        id: controlId,
        labelId,
        describedBy: cx(hintId, errorId) || undefined,
        invalid: Boolean(error),
        required: Boolean(required),
      }}
    >
      <div className={cx("rk-field", className)} data-layout={layout}>
        {(label || aside || (layout === "inline" && hint)) && (
          <div className="rk-field-text">
            <div className="rk-field-top">
              {label && (
                <label id={labelId} htmlFor={controlId} className="rk-field-label">
                  {label}
                  {/* the control carries aria-required; the star is visual */}
                  {required && (
                    <span className="rk-field-required" aria-hidden="true">
                      {" "}
                      *
                    </span>
                  )}
                </label>
              )}
              {aside && <span className="rk-field-aside">{aside}</span>}
            </div>
            {layout === "inline" && hint && (
              <div id={hintId} className="rk-field-hint">
                {hint}
              </div>
            )}
          </div>
        )}
        <div className="rk-field-control">{children}</div>
        {layout === "stack" && hint && !error && (
          <div id={hintId} className="rk-field-hint">
            {hint}
          </div>
        )}
        {error && (
          <div id={errorId} className="rk-field-error" role="alert">
            {error}
          </div>
        )}
      </div>
    </FieldContext>
  );
}
