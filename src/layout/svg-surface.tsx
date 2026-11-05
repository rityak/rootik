import { type CSSProperties, type HTMLAttributes, type ReactNode, useId } from "react";
import { cx } from "../lib/cx";
import { useElementSize } from "../lib/hooks";
import { finite, type SvgGeometryOptions, svgGeometry, svgPadding } from "../lib/svg-geometry";
import { MotionLayer } from "../motion/layer";
import { useAppearanceValue } from "../theme/provider";

export interface SvgSurfaceProps extends HTMLAttributes<HTMLDivElement>, SvgGeometryOptions {
  /** A decorative React SVG layer clipped inside the same contour. */
  background?: ReactNode;
  opacity?: number;
  shadow?: number;
  glass?: boolean;
  contours?: boolean;
  wireframe?: boolean;
  showSafeArea?: boolean;
  /** Layout styles for the protected content box; do not override its padding. */
  contentClassName?: string;
}

/** Parametric SVG shell with one padding contract for both decoration and HTML content. */
export function SvgSurface({
  shape = "rounded",
  edge = "top",
  depth,
  position,
  span,
  padding: requestedPadding,
  radius: requestedRadius,
  opacity = 0.8,
  shadow = 0.4,
  glass = true,
  contours = false,
  wireframe = false,
  showSafeArea = false,
  background,
  children,
  className,
  contentClassName,
  style,
  ...rest
}: SvgSurfaceProps) {
  const id = `rk-surface-${useId().replaceAll(":", "")}`;
  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const enabled = useAppearanceValue("svgShapes");
  const appearanceStyle = useAppearanceValue("style");
  const corners = useAppearanceValue("corners");
  const appearanceRadius = useAppearanceValue("radius");
  const flat = enabled === false || appearanceStyle === "fluent";
  const radius =
    corners === "square" || appearanceRadius === 0 || appearanceStyle === "fluent"
      ? 0
      : (requestedRadius ?? appearanceRadius);
  const padding = svgPadding(requestedPadding);
  const geometry = svgGeometry(width || 600, height || 360, {
    shape,
    edge,
    depth,
    position,
    span,
    padding,
    radius,
  });
  const density = finite(opacity, 0.8, 0, 1),
    lift = finite(shadow, 0.4, 0, 1);
  const vars = {
    ...style,
    "--rk-svg-pad-top": `${geometry.padding.top}px`,
    "--rk-svg-pad-right": `${geometry.padding.right}px`,
    "--rk-svg-pad-bottom": `${geometry.padding.bottom}px`,
    "--rk-svg-pad-left": `${geometry.padding.left}px`,
  } as CSSProperties;
  return (
    <div
      {...rest}
      ref={ref}
      className={cx("rk-svg-surface", className)}
      style={vars}
      data-shape={shape}
      data-edge={edge}
      data-flat={flat || undefined}
      data-wireframe={wireframe || undefined}
      data-safe-area={showSafeArea || undefined}
    >
      {!wireframe && (
        <div
          className="rk-svg-surface-glass"
          aria-hidden="true"
          data-glass={(glass && appearanceStyle !== "fluent") || undefined}
          style={{ clipPath: flat ? undefined : `path("${geometry.path}")` }}
        >
          {glass && appearanceStyle !== "fluent" && <div className="rk-svg-surface-blur" />}
          {background}
        </div>
      )}
      {!flat && (
        <svg
          className="rk-svg-surface-frame"
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <path id={`${id}-path`} d={geometry.path} />
            <clipPath id={`${id}-clip`}>
              <use href={`#${id}-path`} />
            </clipPath>
            <linearGradient id={`${id}-body`} x2="0" y2="1">
              <stop stopColor="var(--rk-svg-fill, var(--rk-surface-2))" stopOpacity={density} />
              <stop
                offset="1"
                stopColor="var(--rk-svg-fill-low, var(--rk-surface-1))"
                stopOpacity={density * 0.9}
              />
            </linearGradient>
            <linearGradient id={`${id}-edge`} x2="0" y2="1">
              <stop stopColor="var(--rk-svg-edge-top, var(--rk-line-strong))" />
              <stop offset="1" stopColor="var(--rk-svg-edge, var(--rk-line))" />
            </linearGradient>
            <filter
              id={`${id}-shadow`}
              x="-30%"
              y="-30%"
              width="160%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation={lift * 6 + 0.1} result="soft" />
              <feOffset in="soft" dy={lift * 8} result="cast" />
              <feFlood floodColor="var(--rk-svg-shadow, oklch(var(--rk-shade)))" floodOpacity={lift * 0.3} />
              <feComposite in2="cast" operator="in" />
            </filter>
          </defs>
          {!wireframe && (
            <>
              <g filter={`url(#${id}-shadow)`}>
                <use href={`#${id}-path`} />
              </g>
              <use href={`#${id}-path`} fill={`url(#${id}-body)`} />
            </>
          )}
          <use
            className="rk-svg-surface-rim"
            href={`#${id}-path`}
            fill="none"
            stroke={wireframe ? "var(--rk-accent-text)" : `url(#${id}-edge)`}
            strokeWidth="1"
          />
          {contours && (
            <g clipPath={`url(#${id}-clip)`}>
              {[3, 6].map((inset) => {
                if (Math.min(...Object.values(geometry.padding)) < inset + 8) return null;
                const innerPadding = Object.fromEntries(
                  Object.entries(geometry.padding).map(([side, value]) => [side, Math.max(8, value - inset)]),
                );
                const inner = svgGeometry(geometry.width - inset * 2, geometry.height - inset * 2, {
                  shape,
                  edge,
                  depth,
                  position,
                  span,
                  padding: innerPadding,
                  radius: radius === undefined ? undefined : Math.max(0, radius - inset),
                });
                return (
                  <path
                    key={inset}
                    d={inner.path}
                    transform={`translate(${inset} ${inset})`}
                    fill="none"
                    stroke="var(--rk-svg-edge, var(--rk-line-strong))"
                    strokeWidth=".7"
                    opacity=".45"
                  />
                );
              })}
            </g>
          )}
          {showSafeArea && (
            <rect
              className="rk-svg-surface-guide"
              {...geometry.content}
              fill="none"
              stroke="var(--rk-accent-text)"
              strokeDasharray="4 4"
            />
          )}
        </svg>
      )}
      <MotionLayer clipPath={flat ? undefined : geometry.path} />
      <div
        className={cx("rk-svg-surface-content", contentClassName)}
        style={{
          padding:
            "var(--rk-svg-pad-top) var(--rk-svg-pad-right) var(--rk-svg-pad-bottom) var(--rk-svg-pad-left)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
