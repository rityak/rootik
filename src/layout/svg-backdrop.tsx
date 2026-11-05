import { type HTMLAttributes, type ReactNode, useId } from "react";
import { cx } from "../lib/cx";
import { finite } from "../lib/svg-geometry";
import { MotionLayer } from "../motion/layer";

export type SvgPattern = "none" | "dots" | "stripes" | "grid" | "cross" | "hex";
export interface SvgBackdropContext {
  /** Unique prefix for custom gradients, masks and paths. */ id: string;
}
export interface SvgBackdropProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  pattern?: SvgPattern;
  spacing?: number;
  opacity?: number;
  animated?: boolean;
  /** Trusted React SVG nodes; use the supplied id to isolate local definitions. */
  children?: ReactNode | ((context: SvgBackdropContext) => ReactNode);
}

/** Decorative tiled SVG background with an isolated slot for application artwork. */
export function SvgBackdrop({
  pattern = "dots",
  spacing = 20,
  opacity = 0.24,
  animated = false,
  children,
  className,
  style,
  ...rest
}: SvgBackdropProps) {
  const id = `rk-backdrop-${useId().replaceAll(":", "")}`;
  const tile = finite(spacing, 20, 6, 100);
  return (
    <div
      {...rest}
      className={cx("rk-svg-backdrop", className)}
      style={style}
      aria-hidden="true"
      data-pattern={pattern}
      data-animated={animated || undefined}
    >
      {animated && <MotionLayer active loop />}
      <div className="rk-svg-backdrop-motion">
        <svg
          className="rk-svg-backdrop-field"
          width="100%"
          height="100%"
          focusable="false"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id={`${id}-pattern`}
              width={tile}
              height={tile}
              patternUnits="userSpaceOnUse"
              patternTransform={pattern === "stripes" ? "rotate(35)" : undefined}
            >
              {pattern === "dots" && <circle cx={tile / 2} cy={tile / 2} r="1" fill="currentColor" />}
              {pattern === "stripes" && (
                <path d={`M 0 0 V ${tile}`} stroke="currentColor" strokeWidth="1.5" />
              )}
              {pattern === "grid" && (
                <path d={`M ${tile} 0 H 0 V ${tile}`} stroke="currentColor" fill="none" strokeWidth="1" />
              )}
              {pattern === "cross" && (
                <path d={`M ${tile / 2 - 2} ${tile / 2} h 4 m -2 -2 v 4`} stroke="currentColor" fill="none" />
              )}
              {pattern === "hex" && (
                <path
                  d={`M 0 ${tile / 2} L ${tile / 4} 0 H ${tile * 0.75} L ${tile} ${tile / 2} L ${tile * 0.75} ${tile} H ${tile / 4} Z`}
                  stroke="currentColor"
                  fill="none"
                />
              )}
            </pattern>
          </defs>
          {pattern !== "none" && (
            <rect
              width="100%"
              height="100%"
              fill={`url(#${id}-pattern)`}
              opacity={finite(opacity, 0.24, 0, 1)}
            />
          )}
          {typeof children === "function" ? children({ id }) : children}
        </svg>
      </div>
    </div>
  );
}
