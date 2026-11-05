import {
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
  useRef,
} from "react";
import { SvgControlFrame, useSvgControlBorder } from "../components/svg-control-frame";
import { cx } from "../lib/cx";
import { useField, useFieldLabel } from "../lib/field-context";
import { mergeRefs } from "../lib/hooks";
import { SearchIcon, XIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import type { SvgControlBorder } from "../lib/svg-geometry";
import { MotionLayer } from "../motion/layer";
import type { Size } from "./button";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  size?: Size;
  /** Optional SVG contour, including invalid and focus states. */
  svgBorder?: SvgControlBorder;
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

export function Input({
  size = "md",
  svgBorder,
  icon,
  end,
  invalid,
  mono,
  className,
  style,
  ref,
  ...rest
}: InputProps) {
  const border = useSvgControlBorder(svgBorder);
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
      data-svg-border={border}
      onMouseDown={(event) => {
        if (event.target !== inner.current && !(event.target as HTMLElement).closest("button")) {
          event.preventDefault();
          inner.current?.focus();
        }
      }}
    >
      {border ? <SvgControlFrame border={border} /> : <MotionLayer />}
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
  /** Optional contour; adds a stable wrapper while the prop is supplied. */
  svgBorder?: SvgControlBorder;
  /** Grow with content (CSS field-sizing). */
  autoSize?: boolean;
  invalid?: boolean;
  mono?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({ autoSize, invalid, mono, svgBorder, className, ...rest }: TextareaProps) {
  const field = useField(rest);
  const border = useSvgControlBorder(svgBorder);
  const input = (
    <textarea
      rows={3}
      {...rest}
      {...field}
      aria-invalid={invalid || field["aria-invalid"]}
      className={cx("rk-textarea", className)}
      data-invalid={invalid || field["aria-invalid"] || undefined}
      data-autosize={autoSize || undefined}
      data-mono={mono || undefined}
    />
  );
  return svgBorder ? (
    <div
      className="rk-textarea-wrap"
      data-svg-border={border}
      data-disabled={rest.disabled || undefined}
      data-invalid={invalid || field["aria-invalid"] || undefined}
    >
      {border ? <SvgControlFrame border={border} /> : <MotionLayer />}
      {input}
    </div>
  ) : (
    input
  );
}
