import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
import { icon } from "../lib/icons";
import { MotionLayer } from "../motion/layer";
import { useAppearanceValue } from "../theme/provider";
import type { Size } from "./button";

export type PowerButtonSize = "xs" | Size;

const REACTOR_CONTOUR = "M60 7H84L113 36V84L84 113H36L7 84V36L36 7Z";

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
  /** Switching in progress (connecting, stopping): the status indicator animates; clicks remain available to cancel. */
  pending?: boolean;
  size?: PowerButtonSize;
  /** Signal and reactor add a decorative VPN-style status dial. */
  variant?: "orb" | "signal" | "reactor";
  /** Semantic color used for the on and pending states. */
  tone?: "accent" | "danger";
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
  variant = "orb",
  tone = "accent",
  icon: glyph,
  className,
  onClick,
  ...rest
}: PowerButtonProps) {
  const [isOn, setOn] = useControllable(on, defaultOn, onChange);
  const svg = useAppearanceValue("svgShapes");
  const style = useAppearanceValue("style");
  const decoration = variant !== "orb" && svg !== false && style !== "fluent";
  return (
    <button
      type="button"
      {...rest}
      className={cx("rk-power", className)}
      data-size={size}
      data-variant={variant}
      data-tone={tone === "danger" ? "danger" : undefined}
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
      {decoration && (
        <>
          <span className="rk-power-dial" aria-hidden="true">
            <svg viewBox="0 0 120 120" focusable="false" aria-hidden="true">
              {variant === "reactor" ? (
                <path d={REACTOR_CONTOUR} className="rk-power-track" />
              ) : (
                <circle cx="60" cy="60" r="53" className="rk-power-track" />
              )}
              {variant === "reactor" ? (
                <>
                  <path
                    d={REACTOR_CONTOUR}
                    transform="translate(12 12) scale(.8)"
                    className="rk-power-ticks"
                    pathLength="100"
                  />
                  <path d={REACTOR_CONTOUR} className="rk-power-status" pathLength="100" />
                </>
              ) : (
                <>
                  <circle cx="60" cy="60" r="44" className="rk-power-ticks" pathLength="100" />
                  <circle cx="60" cy="60" r="53" className="rk-power-status" pathLength="100" />
                </>
              )}
            </svg>
          </span>
          {variant === "signal" && (
            <span className="rk-power-orbit" aria-hidden="true">
              <svg viewBox="0 0 120 120" focusable="false" aria-hidden="true">
                <circle cx="60" cy="7" r="3" />
              </svg>
            </span>
          )}
          <MotionLayer active={isOn || pending} loop={Boolean(pending)} />
        </>
      )}
      <span className="rk-icon rk-power-icon">{glyph ?? <PowerIcon />}</span>
    </button>
  );
}
