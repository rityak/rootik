import type { CSSProperties } from "react";
import { SvgSurface, type SvgSurfaceProps } from "../layout/svg-surface";
import { svgPadding } from "../lib/svg-geometry";

export type OverlaySurfaceOptions = Pick<
  SvgSurfaceProps,
  "shape" | "edge" | "padding" | "depth" | "span" | "position" | "glass" | "opacity" | "shadow" | "contours"
>;

/** Native overlay hosts and their decorative background reserve the same safe area. */
export function overlaySurfaceStyle(surface: OverlaySurfaceOptions | undefined): CSSProperties | undefined {
  if (!surface) return undefined;
  const p = svgPadding(surface.padding ?? 24);
  return { "--rk-overlay-pad": `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px` } as CSSProperties;
}

/** Absolute decoration: changing appearance never replaces focusable overlay content. */
export function OverlayDecoration({ surface }: { surface?: OverlaySurfaceOptions }) {
  return surface ? (
    <SvgSurface
      opacity={0.96}
      shadow={0.25}
      {...surface}
      padding={surface.padding ?? 24}
      className="rk-overlay-surface"
      aria-hidden="true"
    />
  ) : null;
}
