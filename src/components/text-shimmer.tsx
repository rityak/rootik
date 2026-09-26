import type { HTMLAttributes } from "react";
import { cx } from "../lib/cx";

export interface TextShimmerProps extends HTMLAttributes<HTMLSpanElement> {
  /** `false` renders the plain text, so a label can settle ("Connecting…" → "Connected") without remounting. */
  active?: boolean;
}

/** Pending label with a light band sweeping across it. Motion Off / reduced motion leave plain dim text. */
export function TextShimmer({ active = true, className, ...rest }: TextShimmerProps) {
  return <span {...rest} className={cx("rk-text-shimmer", className)} data-active={active || undefined} />;
}
