import { type ButtonHTMLAttributes, type ReactNode, type Ref, useEffect, useState } from "react";
import { cx } from "../lib/cx";
import { useLabels } from "../lib/labels";
import { Spinner } from "./progress";
import { Tooltip } from "./tooltip";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse" | "danger" | "warn" | "outline";
export type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: Size;
  icon?: ReactNode;
  iconEnd?: ReactNode;
  /** Busy: spinner instead of icon, not clickable. */
  loading?: boolean;
  /** Toggle state (aria-pressed): accent-tinted. */
  active?: boolean;
  /** Full width. */
  block?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  iconEnd,
  loading,
  active,
  block,
  className,
  disabled,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-pressed={active}
      data-variant={variant}
      data-size={size}
      data-block={block || undefined}
      className={cx("rk-button", className)}
    >
      {loading ? <Spinner size="1em" /> : icon && <span className="rk-icon">{icon}</span>}
      {children !== undefined && children !== null && <span className="rk-button-label">{children}</span>}
      {iconEnd && <span className="rk-icon">{iconEnd}</span>}
    </button>
  );
}

export interface IconButtonProps extends Omit<ButtonProps, "icon" | "iconEnd" | "children" | "block"> {
  icon: ReactNode;
  /** Accessible name and tooltip. */
  label: string;
  /** Show the label as a tooltip (default true). */
  tooltip?: boolean;
  round?: boolean;
}

export function IconButton({
  icon,
  label,
  tooltip = true,
  round,
  variant = "ghost",
  className,
  ...rest
}: IconButtonProps) {
  const button = (
    <Button
      {...rest}
      variant={variant}
      aria-label={label}
      icon={icon}
      data-round={round || undefined}
      className={cx("rk-icon-button", className)}
    />
  );
  return tooltip ? <Tooltip content={label}>{button}</Tooltip> : button;
}

/** Attached buttons sharing borders: toolbars, split actions. */
export function ButtonGroup({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  // biome-ignore lint/a11y/useSemanticElements: see ChipGroup
  return <div role="group" {...rest} className={cx("rk-button-group", className)} />;
}

export interface ConfirmButtonProps extends Omit<ButtonProps, "onClick"> {
  onConfirm: () => void;
  /** Label while armed; defaults to the action with a question mark ("Delete?"). */
  confirmLabel?: ReactNode;
  /** Disarm after ms. */
  timeout?: number;
}

/**
 * Two-step destructive action: first click arms (the button changes look and label), second confirms.
 * Cheaper than a dialog for row-level deletes; disarms on blur and after a timeout.
 */
export function ConfirmButton({
  onConfirm,
  confirmLabel,
  timeout = 3000,
  variant = "ghost",
  children,
  onBlur,
  ...rest
}: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false);
  const labels = useLabels();
  useEffect(() => {
    if (!armed) return;
    const id = setTimeout(() => setArmed(false), timeout);
    return () => clearTimeout(id);
  }, [armed, timeout]);
  return (
    <Button
      {...rest}
      variant={armed ? "danger" : variant}
      data-armed={armed || undefined}
      onBlur={(event) => {
        setArmed(false);
        onBlur?.(event);
      }}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else setArmed(true);
      }}
    >
      {armed ? (confirmLabel ?? labels.confirm(children)) : children}
    </Button>
  );
}
