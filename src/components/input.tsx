import {
  createContext,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
  useContext,
  useId,
  useRef,
} from "react";
import { cx } from "../lib/cx";
import { mergeRefs } from "../lib/hooks";
import { SearchIcon, XIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import type { Size } from "./button";
import { useFormError } from "./form";

interface FieldCtx {
  id: string;
  /** Id of the visible label, for group controls a <label for> can't name (radiogroups, swatches). */
  labelId?: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
}

const FieldContext = createContext<FieldCtx | null>(null);

/** Wires a control to the surrounding <Field>: id for the label, hint/error for aria-describedby. */
export function useField(props: {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: unknown;
  "aria-required"?: unknown;
}) {
  const field = useContext(FieldContext);
  return {
    id: props.id ?? field?.id,
    "aria-describedby": cx(props["aria-describedby"], field?.describedBy) || undefined,
    "aria-invalid": (props["aria-invalid"] as boolean | undefined) ?? (field?.invalid || undefined),
    "aria-required": (props["aria-required"] as boolean | undefined) ?? (field?.required || undefined),
  };
}

/** The surrounding Field's label id: group controls pass it as aria-labelledby. */
export function useFieldLabel(): string | undefined {
  return useContext(FieldContext)?.labelId;
}

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

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  size?: Size;
  /** Leading icon. */
  icon?: ReactNode;
  /** Trailing slot: unit, kbd hint, action button. */
  end?: ReactNode;
  invalid?: boolean;
  mono?: boolean;
  /** Applied to the wrapper box; other props go to <input>. */
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

export function Input({ size = "md", icon, end, invalid, mono, className, style, ref, ...rest }: InputProps) {
  const inner = useRef<HTMLInputElement>(null);
  const field = useField(rest);
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: clicking the box padding focuses the input
    <div
      className={cx("rk-input", className)}
      style={style}
      data-size={size}
      data-invalid={invalid || field["aria-invalid"] || undefined}
      data-disabled={rest.disabled || undefined}
      onMouseDown={(event) => {
        if (event.target !== inner.current && !(event.target as HTMLElement).closest("button")) {
          event.preventDefault();
          inner.current?.focus();
        }
      }}
    >
      {icon && <span className="rk-input-icon rk-icon">{icon}</span>}
      <input
        {...rest}
        {...field}
        aria-invalid={invalid || field["aria-invalid"]}
        ref={mergeRefs(inner, ref)}
        className="rk-input-el"
        data-mono={mono || undefined}
      />
      {end && <span className="rk-input-end">{end}</span>}
    </div>
  );
}

export interface SearchInputProps extends Omit<InputProps, "type" | "icon"> {
  /** Shows a clear button while the value is non-empty. */
  onClear?: () => void;
  /** Shortcut hint shown while empty, e.g. "⌘K". */
  shortcut?: string;
}

export function SearchInput({ onClear, shortcut, end, value, placeholder, ...rest }: SearchInputProps) {
  const strings = useLabels();
  const fieldLabel = useFieldLabel();
  const filled = value !== undefined && value !== "";
  return (
    <Input
      // a placeholder is not a name: outside a labelled Field the field is named "Search"
      aria-label={fieldLabel || rest["aria-labelledby"] ? undefined : strings.searchLabel}
      {...rest}
      value={value}
      placeholder={placeholder ?? strings.search}
      type="search"
      icon={<SearchIcon />}
      end={
        end ??
        (filled && onClear ? (
          <button type="button" className="rk-input-clear" aria-label={strings.clear} onClick={onClear}>
            <XIcon />
          </button>
        ) : shortcut ? (
          <kbd className="rk-kbd" data-size="sm">
            {shortcut}
          </kbd>
        ) : undefined)
      }
    />
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Grow with content (CSS field-sizing). */
  autoSize?: boolean;
  invalid?: boolean;
  mono?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({ autoSize, invalid, mono, className, ...rest }: TextareaProps) {
  const field = useField(rest);
  return (
    <textarea
      rows={3}
      {...rest}
      {...field}
      aria-invalid={invalid || field["aria-invalid"]}
      className={cx("rk-textarea", className)}
      data-autosize={autoSize || undefined}
      data-mono={mono || undefined}
    />
  );
}
