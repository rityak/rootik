import { type CSSProperties, useId } from "react";
import { cx } from "../lib/cx";
import { useAppearanceValue } from "../theme/provider";

export type MotionEffect = "sheen" | "ripple" | "flow";
export interface MotionLayerProps {
  effect?: MotionEffect;
  /** SVG geometry in the host's pixel coordinate space. */
  clipPath?: string;
  active?: boolean;
  /** Ambient motion is explicit; interactive layers play once on hover/selection. */
  loop?: boolean;
  className?: string;
}

/** Decorative SVG light on a compositor wrapper; never owns content, events or geometry. */
export function MotionLayer({ effect, clipPath, active, loop, className }: MotionLayerProps) {
  const id = `rk-motion-${useId().replaceAll(":", "")}`;
  const effects = useAppearanceValue("effects");
  const motion = useAppearanceValue("motion");
  const svg = useAppearanceValue("svgShapes");
  const style = useAppearanceValue("style");
  const preset = useAppearanceValue("effectStyle");
  if (!effects || effects === "off" || motion === "off" || svg === false || style === "fluent") return null;
  const kind = effect ?? preset ?? "sheen";
  return (
    <span
      className={cx("rk-motion-layer", className)}
      aria-hidden="true"
      data-effect={kind}
      data-active={active || undefined}
      data-loop={loop || undefined}
      style={clipPath ? ({ clipPath: `path("${clipPath}")` } as CSSProperties) : undefined}
    >
      <span className="rk-motion-light">
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" focusable="false" aria-hidden="true">
          <defs>
            <linearGradient id={`${id}-sheen`} x1="0" x2="1" y2=".3">
              <stop stopColor="var(--rk-secondary, var(--rk-accent))" stopOpacity="0" />
              <stop offset=".42" stopColor="var(--rk-secondary, var(--rk-accent))" stopOpacity=".6" />
              <stop offset=".5" stopColor="oklch(var(--rk-tint))" />
              <stop offset=".58" stopColor="var(--rk-detail, var(--rk-accent))" stopOpacity=".5" />
              <stop offset="1" stopColor="var(--rk-detail, var(--rk-accent))" stopOpacity="0" />
            </linearGradient>
            <radialGradient id={`${id}-ripple`}>
              <stop stopColor="var(--rk-accent)" stopOpacity="0" />
              <stop offset=".65" stopColor="var(--rk-secondary, var(--rk-accent))" stopOpacity=".5" />
              <stop offset=".82" stopColor="oklch(var(--rk-tint))" />
              <stop offset="1" stopColor="var(--rk-accent)" stopOpacity="0" />
            </radialGradient>
          </defs>
          {kind === "ripple" ? (
            <ellipse cx="100" cy="50" rx="98" ry="49" fill={`url(#${id}-ripple)`} />
          ) : (
            <rect width="200" height="100" fill={`url(#${id}-sheen)`} />
          )}
        </svg>
      </span>
    </span>
  );
}
