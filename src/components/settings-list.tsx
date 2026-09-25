import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { Card, Nest } from "./card";
import { Field } from "./input";

export interface SettingsGroupProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  /** Header-right controls (card variant). */
  actions?: ReactNode;
  /** card — a Card per group (settings page); plain — divided sections (dialogs, popovers). */
  variant?: "card" | "plain";
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
  tone,
  className,
  children,
  ...rest
}: SettingsGroupProps) {
  const rows = <div className="rk-settings-rows">{children}</div>;
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
