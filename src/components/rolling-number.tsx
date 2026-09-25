import { type CSSProperties, type HTMLAttributes, useMemo } from "react";
import { cx } from "../lib/cx";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const IS_DIGIT = /\d/;

export interface RollingNumberProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  value: number;
  /** Text to render; digits roll, everything else (separators, signs, units) stays put. */
  format?: (value: number) => string;
  locale?: string | string[];
}

/**
 * A number whose digits roll to the new value like an odometer: tabular columns translated by CSS,
 * no animation loop. Honors `--rk-motion` (no roll when motion is off). Screen readers get the plain
 * text. Drop it into `Stat` as the value.
 */
export function RollingNumber({ value, format, locale, className, ...rest }: RollingNumberProps) {
  const text = useMemo(
    () =>
      format ? format(value) : new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value),
    [value, format, locale],
  );
  const chars = [...text];
  return (
    <span {...rest} className={cx("rk-rolling rk-num", className)}>
      <span className="rk-rolling-track" aria-hidden="true">
        {chars.map((ch, i) => {
          // keyed from the right: the ones digit stays the ones digit when the number grows
          const place = chars.length - i;
          return IS_DIGIT.test(ch) ? (
            <span key={`d${place}`} className="rk-rolling-digit">
              <span className="rk-rolling-strip" style={{ "--rk-digit": ch } as CSSProperties}>
                {DIGITS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={`s${place}`} className="rk-rolling-sign">
              {ch}
            </span>
          );
        })}
      </span>
      <span className="rk-sr-only">{text}</span>
    </span>
  );
}
