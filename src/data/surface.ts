import type { SvgSurfaceProps } from "../layout/svg-surface";

export type DataSurfaceOptions = Pick<
  SvgSurfaceProps,
  "shape" | "edge" | "padding" | "depth" | "span" | "position" | "glass" | "opacity" | "shadow" | "contours"
>;
