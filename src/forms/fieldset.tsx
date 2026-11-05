import type { CSSProperties, FieldsetHTMLAttributes, ReactNode } from "react";
import { SvgSurface, type SvgSurfaceProps } from "../layout/svg-surface";
import { cx } from "../lib/cx";
import { svgPadding } from "../lib/svg-geometry";

export type FormSurfaceOptions = Pick<
  SvgSurfaceProps,
  "shape" | "edge" | "padding" | "depth" | "span" | "position" | "glass" | "opacity" | "shadow" | "contours"
>;

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: ReactNode;
  /** Line under the legend. */
  description?: ReactNode;
  /** plain — legend over a stack; outline — a lined box (grouped options inside a form). */
  variant?: "plain" | "outline";
  /** Lay the children out in a row (wrapping), e.g. a pair of short fields. */
  row?: boolean;
  /** Optional SVG material; its padding also reserves the native fieldset's safe content area. */
  surface?: FormSurfaceOptions;
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
  surface,
  style,
  className,
  children,
  ...rest
}: FieldsetProps) {
  const padding = surface ? svgPadding(surface.padding ?? 24) : undefined;
  return (
    <fieldset
      {...rest}
      className={cx("rk-fieldset", className)}
      data-variant={variant}
      data-surface={surface ? "true" : undefined}
      style={
        padding
          ? ({
              ...style,
              "--rk-form-pad": `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
            } as CSSProperties)
          : style
      }
    >
      {legend && <legend className="rk-fieldset-legend">{legend}</legend>}
      {description && <p className="rk-fieldset-desc">{description}</p>}
      {surface && (
        <SvgSurface {...surface} padding={padding} className="rk-fieldset-surface" aria-hidden="true" />
      )}
      <div className="rk-fieldset-body" data-row={row || undefined}>
        {children}
      </div>
    </fieldset>
  );
}
