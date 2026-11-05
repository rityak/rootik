import { type HTMLAttributes, type ReactNode, useId } from "react";
import { cx } from "../lib/cx";

const seeds = Array.from({ length: 72 }, (_, index) => index);

export const SVG_ARTWORKS = ["orbits", "ribbons", "fold", "lattice", "contours", "particles"] as const;
export type SvgArtworkVariant = (typeof SVG_ARTWORKS)[number];
export interface SvgArtworkProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  variant?: SvgArtworkVariant;
  motion?: "off" | "drift" | "orbit";
  /** SVG children in a 240×240 coordinate space; id isolates custom defs. */
  children?: ReactNode | ((context: { id: string }) => ReactNode);
}

/** Abstract SVG studies, animated on a compositor wrapper and static when motion is disabled. */
export function SvgArtwork({
  variant = "orbits",
  motion = "off",
  children,
  className,
  ...rest
}: SvgArtworkProps) {
  const id = `rk-artwork-${useId().replaceAll(":", "")}`;
  return (
    <div
      {...rest}
      className={cx("rk-svg-artwork", className)}
      data-variant={variant}
      data-motion={motion}
      aria-hidden="true"
    >
      <div className="rk-svg-artwork-motion">
        <svg viewBox="0 0 240 240" fill="none" focusable="false" aria-hidden="true">
          {variant === "orbits" &&
            [0, 1, 2, 3, 4].map((i) => (
              <ellipse
                key={i}
                cx="120"
                cy="120"
                rx={94 - i * 12}
                ry={42 + i * 8}
                transform={`rotate(${i * 24} 120 120)`}
                stroke="currentColor"
                strokeWidth={i === 0 ? 1.4 : 0.7}
                opacity={0.85 - i * 0.12}
              />
            ))}
          {variant === "ribbons" &&
            seeds
              .slice(0, 13)
              .map((i) => (
                <path
                  key={i}
                  d={`M 24 ${54 + i * 10} C ${90 + i * 4} ${-18 + i * 13} ${132 - i * 2} ${230 - i * 9} 216 ${82 + i * 8}`}
                  stroke="currentColor"
                  strokeWidth=".85"
                  opacity={0.25 + i * 0.04}
                />
              ))}
          {variant === "fold" &&
            [0, 1, 2, 3, 4, 5, 6].map((i) => (
              <path
                key={i}
                d={`M ${34 + i * 8} ${72 + i * 7} L 122 ${23 + i * 10} L ${211 - i * 6} ${142 - i * 4} L 110 ${218 - i * 11} Z`}
                stroke="currentColor"
                strokeWidth=".8"
                opacity={0.75 - i * 0.075}
              />
            ))}
          {variant === "lattice" &&
            seeds.slice(0, 11).map((i) => (
              <g key={i} stroke="currentColor" strokeWidth=".7" opacity={0.35 + i * 0.035}>
                <path d={`M ${30 + i * 16} 36 Q ${192 - i * 12} 120 ${30 + i * 16} 204`} />
                <path d={`M 36 ${30 + i * 16} Q 120 ${192 - i * 12} 204 ${30 + i * 16}`} />
              </g>
            ))}
          {variant === "contours" &&
            seeds
              .slice(0, 9)
              .map((i) => (
                <path
                  key={i}
                  d="M120 22 C178 10 214 72 201 126 C225 185 148 223 99 209 C34 222 15 151 39 110 C15 55 71 13 120 22Z"
                  transform={`translate(${i * 8} ${i * 8}) scale(${1 - i * 0.067})`}
                  stroke="currentColor"
                  strokeWidth=".9"
                  opacity={0.8 - i * 0.075}
                />
              ))}
          {variant === "particles" &&
            seeds.slice(0, 72).map((i) => {
              const angle = i * 2.39996,
                r = Math.sqrt(i) * 10;
              return (
                <circle
                  key={i}
                  cx={120 + Math.cos(angle) * r}
                  cy={120 + Math.sin(angle) * r}
                  r={i % 5 === 0 ? 2 : 1}
                  fill="currentColor"
                  opacity={0.25 + (i % 7) * 0.09}
                />
              );
            })}
          {typeof children === "function" ? children({ id }) : children}
        </svg>
      </div>
    </div>
  );
}
