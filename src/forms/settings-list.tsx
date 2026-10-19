import type { HTMLAttributes, ReactNode } from "react";
import { Card, Nest } from "../components/card";
import { SvgSurface } from "../layout/svg-surface";
import { cx } from "../lib/cx";
import { Field } from "./field";
import type { FormSurfaceOptions } from "./fieldset";

export interface SettingsGroupProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  /** Header-right controls (card variant). */
  actions?: ReactNode;
  /** card — a Card per group (settings page); plain — divided sections (dialogs, popovers). */
  variant?: "card" | "plain";
  /** SVG material for card groups; disabled SVG/Fluent keep the same padded layout. */
  surface?: FormSurfaceOptions;
  /** `danger`: red rim for destructive settings (reset, delete). */
  tone?: "danger";
  children: ReactNode;
}

/** A titled block of SettingsRows with hairlines between the rows. */
export function SettingsGroup({
  title,
  description,
  actions,
  variant = "card",
  surface,
  tone,
  className,
  children,
  ...rest
}: SettingsGroupProps) {
  const rows = <div className="rk-settings-rows">{children}</div>;
  if (variant === "card" && surface)
    return (
      <SvgSurface
        {...surface}
        padding={surface.padding ?? 24}
        {...rest}
        className={cx("rk-settings-surface", className)}
        data-tone={tone}
        contentClassName="rk-settings-content"
      >
        {(title || description || actions) && (
          <div className="rk-settings-header">
            <div>
              {title && <h3 className="rk-settings-heading">{title}</h3>}
              {description && <p className="rk-settings-description">{description}</p>}
            </div>
            {actions && <div className="rk-settings-actions">{actions}</div>}
          </div>
        )}
        {rows}
      </SvgSurface>
    );
  if (variant === "card")
    return (
      <Card
        {...rest}
        title={title}
        description={description}
        actions={actions}
        className={cx("rk-settings-card", className)}
        data-tone={tone}
      >
        {rows}
      </Card>
    );
  return (
    <section {...rest} className={cx("rk-settings-group", className)} data-tone={tone}>
      {title && <h3 className="rk-settings-title">{title}</h3>}
      {description && <p className="rk-settings-desc">{description}</p>}
      {rows}
    </section>
  );
}

export interface SettingsRowProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** The control: Switch, Select, SegmentedControl, Button… (wired to the label via Field). */
  children: ReactNode;
  /** Sub-options under the row, indented with a guide line (show them only while the parent is on). */
  nested?: ReactNode;
  /** Control id for the label, when the control doesn't pick it up from Field. */
  controlId?: string;
}

/** Label and hint on the left, control on the right; optional nested sub-options below. */
export function SettingsRow({
  label,
  hint,
  error,
  children,
  nested,
  controlId,
  className,
  ...rest
}: SettingsRowProps) {
  return (
    <div {...rest} className={cx("rk-settings-row", className)}>
      <Field layout="inline" label={label} hint={hint} error={error} id={controlId}>
        {children}
      </Field>
      {nested && <Nest>{nested}</Nest>}
    </div>
  );
}
