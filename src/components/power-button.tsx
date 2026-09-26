import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
import { icon } from "../lib/icons";
import type { Size } from "./button";

const PowerIcon = icon(
  <>
    <path d="M12 2v10" />
    <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
  </>,
);

export interface PowerButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value" | "defaultValue"> {
  /** Names what it switches ("VPN connection"): the pressed state is announced separately, the name stays put. */
  label: string;
  on?: boolean;
  defaultOn?: boolean;
  onChange?: (on: boolean) => void;
  /** Switching in progress (connecting, stopping): a ring spins, clicks still go through so it can be cancelled. */
  pending?: boolean;
  size?: Size;
  icon?: ReactNode;
}

/** Hero toggle orb: the one big on/off of a screen (VPN connect, recording, service start). */
export function PowerButton({
  label,
  on,
  defaultOn = false,
  onChange,
  pending,
  size = "md",
  icon: glyph,
  className,
  onClick,
  ...rest
}: PowerButtonProps) {
  const [isOn, setOn] = useControllable(on, defaultOn, onChange);
  return (
    <button
      type="button"
      {...rest}
      className={cx("rk-power", className)}
      data-size={size}
      data-on={isOn || undefined}
      data-pending={pending || undefined}
      aria-pressed={isOn}
      aria-busy={pending || undefined}
      aria-label={label}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOn(!isOn);
      }}
    >
      <span className="rk-icon rk-power-icon">{glyph ?? <PowerIcon />}</span>
    </button>
  );
}
