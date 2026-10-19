export const SVG_SHAPES = [
  "rounded",
  "saddle",
  "scoop",
  "step",
  "bevel",
  "ticket",
  "wave",
  "corner",
] as const;
export type SvgShape = (typeof SVG_SHAPES)[number];
export const SVG_CONTROL_BORDERS = ["soft", "cut", "notch", "ticket"] as const;
export type SvgControlBorder = (typeof SVG_CONTROL_BORDERS)[number];
export type SvgEdge = "top" | "right" | "bottom" | "left";
export interface SvgPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
export interface SvgGeometryOptions {
  shape?: SvgShape;
  edge?: SvgEdge;
  /** Fraction of the available padding, clamped to 0–1. */
  depth?: number;
  /** Position and span along the straight part of an edge, clamped to 0–1. */
  position?: number;
  span?: number;
  padding?: number | Partial<SvgPadding>;
  /** Optional corner radius cap; zero keeps corners square without removing edge features. */
  radius?: number;
}

export const finite = (value: number | undefined, fallback: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Number.isFinite(value) ? (value as number) : fallback));

/** The same normalized padding drives HTML layout and the contour's deformation budget. */
export function svgPadding(padding: SvgGeometryOptions["padding"] = 36): SvgPadding {
  const side = (key: keyof SvgPadding) =>
    finite(typeof padding === "number" ? padding : padding[key], 36, 8, 256);
  return { top: side("top"), right: side("right"), bottom: side("bottom"), left: side("left") };
}

/** Every curve is contained outside the protected HTML content rectangle. */
export function svgGeometry(measuredWidth: number, measuredHeight: number, options: SvgGeometryOptions = {}) {
  return createGeometry(measuredWidth, measuredHeight, options, 6, 8);
}

/** Compact contours stay inside the controls' existing padding, without scaling stroke widths. */
export function svgControlGeometry(width: number, height: number, border: SvgControlBorder, radius?: number) {
  const shapes = { soft: "rounded", cut: "corner", notch: "bevel", ticket: "ticket" } as const;
  return createGeometry(
    width,
    height,
    {
      shape: shapes[border],
      edge: border === "ticket" ? "left" : "top",
      padding: 8,
      depth: border === "cut" ? 1 : Math.min(0.6, Math.max(0, (height - 16) / 16)),
      span: 0.25,
      radius,
    },
    // Reserve half the maximum focus stroke in every state, so focus never moves the path.
    1.5,
    2,
  );
}

function createGeometry(
  measuredWidth: number,
  measuredHeight: number,
  options: SvgGeometryOptions,
  rim: number,
  gap: number,
) {
  const width = finite(measuredWidth, 600, 1, 100000);
  const height = finite(measuredHeight, 360, 1, 100000);
  const requested = svgPadding(options.padding);
  const padding = {
    top: Math.min(requested.top, height / 2),
    bottom: Math.min(requested.bottom, height / 2),
    left: Math.min(requested.left, width / 2),
    right: Math.min(requested.right, width / 2),
  };
  const inset = Math.min(rim, width / 4, height / 4);
  const x = inset,
    y = inset,
    right = width - inset,
    bottom = height - inset;
  const clearance = Math.min(gap, width / 4, height / 4);
  const baseRadius = Math.max(
    0,
    Math.min(
      finite(options.radius, 48, 0, 48),
      ...Object.values(padding).map((value) => value - inset - clearance),
    ),
  );
  const amount = finite(options.depth, 0.7, 0, 1);
  const radius = baseRadius * (options.shape === "corner" ? amount : 1);
  const position = finite(options.position, 0.5, 0, 1);
  const span = finite(options.span, 0.32, 0.12, 0.75);
  const shape = options.shape ?? "rounded",
    edge = options.edge ?? "top";
  const commands: string[] = [];
  const coordinates: [number, number][] = [];
  const point = (px: number, py: number) => {
    coordinates.push([px, py]);
    return `${Math.round(px * 1000) / 1000} ${Math.round(py * 1000) / 1000}`;
  };
  commands.push(`M ${point(x + radius, y)}`);
  for (const side of ["top", "right", "bottom", "left"] as const) {
    const length = (side === "top" || side === "bottom" ? right - x : bottom - y) - radius * 2;
    const budget = Math.max(0, padding[side] - inset - clearance);
    const d = budget * amount;
    const active =
      side === edge ||
      (shape === "ticket" && (edge === "top" || edge === "bottom") === (side === "top" || side === "bottom"));
    const p = (u: number, v: number) => {
      if (side === "top") return point(x + radius + u, y + v);
      if (side === "right") return point(right - v, y + radius + u);
      if (side === "bottom") return point(right - radius - u, bottom - v);
      return point(x + v, bottom - radius - u);
    };
    const line = (u: number, v = 0) => commands.push(`L ${p(u, v)}`);
    if (active && shape !== "rounded" && shape !== "corner" && length > 0) {
      const featureWidth = length * span;
      const sidePosition = side === "bottom" || side === "left" ? 1 - position : position;
      const start = (length - featureWidth) * sidePosition;
      const end = start + featureWidth;
      line(start);
      if (shape === "step" || shape === "bevel") {
        const ramp = shape === "bevel" ? featureWidth * 0.24 : Math.min(featureWidth * 0.1, 5);
        line(start + ramp, d);
        line(end - ramp, d);
        line(end);
      } else if (shape === "saddle") {
        commands.push(
          `C ${p(start + featureWidth * 0.18, 0)} ${p(start + featureWidth * 0.14, d)} ${p(start + featureWidth * 0.32, d)}`,
        );
        line(end - featureWidth * 0.32, d);
        commands.push(`C ${p(end - featureWidth * 0.14, d)} ${p(end - featureWidth * 0.18, 0)} ${p(end, 0)}`);
      } else if (shape === "wave") {
        for (let i = 0; i < 3; i++) {
          const u = start + (featureWidth * i) / 3,
            segment = featureWidth / 3;
          commands.push(
            `C ${p(u + segment * 0.25, 0)} ${p(u + segment * 0.25, d)} ${p(u + segment * 0.5, d)}`,
          );
          commands.push(`C ${p(u + segment * 0.75, d)} ${p(u + segment * 0.75, 0)} ${p(u + segment, 0)}`);
        }
      } else {
        commands.push(
          `C ${p(start + featureWidth * 0.4, 0)} ${p(start + featureWidth * 0.2, d)} ${p(start + featureWidth * 0.5, d)}`,
        );
        commands.push(`C ${p(end - featureWidth * 0.2, d)} ${p(end - featureWidth * 0.4, 0)} ${p(end, 0)}`);
      }
    }
    line(length);
    const corner =
      side === "top"
        ? [right, y, right, y + radius]
        : side === "right"
          ? [right, bottom, right - radius, bottom]
          : side === "bottom"
            ? [x, bottom, x, bottom - radius]
            : [x, y, x + radius, y];
    if (shape === "corner" || radius === 0) commands.push(`L ${point(corner[2] ?? 0, corner[3] ?? 0)}`);
    else commands.push(`Q ${point(corner[0] ?? 0, corner[1] ?? 0)} ${point(corner[2] ?? 0, corner[3] ?? 0)}`);
  }
  return {
    width,
    height,
    path: `${commands.join(" ")} Z`,
    padding,
    coordinates,
    content: {
      x: padding.left,
      y: padding.top,
      width: Math.max(0, width - padding.left - padding.right),
      height: Math.max(0, height - padding.top - padding.bottom),
    },
  };
}
