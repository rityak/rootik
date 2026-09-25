import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { ChevronDownIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { Button, type ButtonProps } from "./button";
import { Menu } from "./menu";

export interface SplitButtonProps extends Omit<ButtonProps, "iconEnd" | "block"> {
  /** Menu content for the chevron: MenuItem, MenuSub, MenuSeparator… */
  menu: ReactNode;
  /** Accessible name of the chevron; default "More actions". */
  menuLabel?: string;
}

/**
 * Primary action plus a chevron with related ones ("Export" ▾ JSONL / CSV / Captions): one joined control,
 * the main part runs the default, the chevron opens a Menu aligned to the group's end.
 */
export function SplitButton({
  menu,
  menuLabel,
  variant = "secondary",
  size = "md",
  disabled,
  className,
  children,
  ...rest
}: SplitButtonProps) {
  const labels = useLabels();
  return (
    // biome-ignore lint/a11y/useSemanticElements: see ButtonGroup
    <div role="group" className={cx("rk-button-group rk-split-button", className)} data-size={size}>
      <Button {...rest} variant={variant} size={size} disabled={disabled}>
        {children}
      </Button>
      <Menu
        placement="bottom-end"
        trigger={
          <Button
            variant={variant}
            size={size}
            disabled={disabled}
            aria-label={menuLabel ?? labels.moreActions}
            className="rk-split-toggle"
            icon={<ChevronDownIcon />}
          />
        }
      >
        {menu}
      </Menu>
    </div>
  );
}
