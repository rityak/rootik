import { useId } from "react";
import { useAppearanceValue } from "../theme/provider";

export type FeedbackDecoration = "ticks" | "segments";
export type FeedbackAnimation = "loop" | "once" | "off";

/** Fixed-viewBox ornament; it never participates in layout or owns the measured value. */
export function FeedbackTrack({ decoration }: { decoration?: FeedbackDecoration }) {
  const id = `rk-track-${useId().replaceAll(":", "")}`;
  const svg = useAppearanceValue("svgShapes");
  const style = useAppearanceValue("style");
  if (!decoration || svg === false || style === "fluent") return null;
  return (
    <svg
      className="rk-feedback-track"
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={id} width={decoration === "ticks" ? 5 : 10} height="10" patternUnits="userSpaceOnUse">
          <path
            d={decoration === "ticks" ? "M0 0V3 M0 7V10" : "M0 0V10"}
            stroke="var(--rk-surface-1)"
            strokeWidth={decoration === "ticks" ? 1 : 2}
            vectorEffect="non-scaling-stroke"
          />
        </pattern>
      </defs>
      <rect width="100" height="10" fill={`url(#${id})`} />
    </svg>
  );
}
