import type { HTMLAttributes } from "react";
import type { FeedbackAnimation } from "../feedback/track";
import { cx } from "../lib/cx";
import { useAppearanceValue } from "../theme/provider";

export interface TextShimmerProps extends HTMLAttributes<HTMLSpanElement> {
  /** `false` renders the plain text, so a label can settle ("Connecting…" → "Connected") without remounting. */
  active?: boolean;
  animation?: FeedbackAnimation;
}

/** Pending label with a light band sweeping across it. Motion Off / reduced motion leave plain dim text. */
export function TextShimmer({ active = true, animation = "loop", className, ...rest }: TextShimmerProps) {
  const motion = useAppearanceValue("motion");
  const effects = useAppearanceValue("effects");
  const enabled = active && animation !== "off" && motion !== "off" && effects !== "off";
  return (
    <span
      {...rest}
      className={cx("rk-text-shimmer", className)}
      data-active={enabled || undefined}
      data-animation={animation}
    />
  );
}
