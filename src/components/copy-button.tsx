import { announce } from "../lib/announce";
import { cx } from "../lib/cx";
import { useClipboard } from "../lib/hooks";
import { CheckIcon, CopyIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { Button, type ButtonProps, IconButton } from "./button";

export interface CopyButtonProps
  extends Omit<ButtonProps, "onClick" | "onCopy" | "icon" | "iconEnd" | "value"> {
  /** Text to copy, or a function that builds it on click. */
  value: string | (() => string);
  /** Accessible name and tooltip of the icon-only form (default "Copy"). */
  label?: string;
  /** Called after a successful copy (the DOM `copy` event is not exposed). */
  onCopy?: (text: string) => void;
}

/**
 * Copies `value`; the icon swaps to a check and "Copied" is announced to screen readers.
 * Icon-only by default; pass children for a labelled button ("Copy link").
 */
export function CopyButton({
  value,
  label,
  onCopy,
  variant = "ghost",
  className,
  children,
  ...rest
}: CopyButtonProps) {
  const labels = useLabels();
  const { copy, copied } = useClipboard();
  const onClick = async () => {
    const text = typeof value === "function" ? value() : value;
    if (!(await copy(text))) return;
    announce(labels.copied);
    onCopy?.(text);
  };
  // keyed so the new icon mounts and plays its entry transition
  const icon = copied ? <CheckIcon key="done" /> : <CopyIcon key="idle" />;
  const shared = {
    ...rest,
    variant,
    onClick,
    "data-copied": copied || undefined,
    className: cx("rk-copy-button", className),
  };
  if (children === undefined || children === null)
    return <IconButton {...shared} icon={icon} label={copied ? labels.copied : (label ?? labels.copy)} />;
  return (
    <Button {...shared} icon={icon}>
      {copied ? labels.copied : children}
    </Button>
  );
}
