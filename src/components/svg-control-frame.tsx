import { useElementSize } from "../lib/hooks";
import { type SvgControlBorder, svgControlGeometry } from "../lib/svg-geometry";
import { MotionLayer } from "../motion/layer";
import { useAppearanceValue } from "../theme/provider";

export function useSvgControlBorder(border?: SvgControlBorder) {
  const enabled = useAppearanceValue("svgShapes");
  const style = useAppearanceValue("style");
  return enabled === false || style === "fluent" ? undefined : border;
}

/** Decorative only: the parent remains the native focusable control. */
export function SvgControlFrame({ border }: { border: SvgControlBorder }) {
  const { ref, width, height } = useElementSize<SVGSVGElement>();
  const corners = useAppearanceValue("corners");
  const radius = useAppearanceValue("radius");
  const geometry = svgControlGeometry(
    width || 120,
    height || 34,
    border,
    corners === "square" ? 0 : radius === undefined ? undefined : radius * 0.55,
  );
  return (
    <>
      <svg
        ref={ref}
        className="rk-svg-control-frame"
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d={geometry.path}
          fill="var(--rk-svg-control-fill)"
          stroke="var(--rk-svg-control-edge)"
          strokeWidth="var(--rk-svg-control-stroke, 1.5)"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <MotionLayer clipPath={geometry.path} />
    </>
  );
}
