import { type ReactNode, useId } from "react";
import { SvgSurface, type SvgSurfaceProps } from "../layout/svg-surface";
import { cx } from "../lib/cx";
import { MotionLayer } from "../motion/layer";
import { useAppearanceValue } from "../theme/provider";

export interface ChartPanelProps extends Omit<SvgSurfaceProps, "title"> {
  title: ReactNode;
  description?: ReactNode;
  summary?: ReactNode;
  actions?: ReactNode;
  /** A single decorative pass. Values, axes and mounted children never move. */
  animation?: "once" | "off";
  /** Replay only the light layer when a sample or query revision changes. */
  revision?: string | number;
}

/** Captioned chart surface; composes every chart without taking ownership of its data or state. */
export function ChartPanel({
  title,
  description,
  summary,
  actions,
  animation = "off",
  revision,
  children,
  className,
  contentClassName,
  padding = 24,
  ...rest
}: ChartPanelProps) {
  const id = useId();
  const motion = useAppearanceValue("motion");
  const effects = useAppearanceValue("effects");
  const svg = useAppearanceValue("svgShapes");
  const style = useAppearanceValue("style");
  const animate =
    animation === "once" &&
    motion !== "off" &&
    Boolean(effects) &&
    effects !== "off" &&
    svg !== false &&
    style !== "fluent";
  return (
    <SvgSurface
      role="figure"
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      {...rest}
      padding={padding}
      className={cx("rk-chart-panel", className)}
      contentClassName={cx("rk-chart-panel-content", contentClassName)}
      data-animation={animate ? "once" : "off"}
    >
      <div className="rk-chart-panel-heading">
        <div className="rk-chart-panel-caption">
          <h3 id={`${id}-title`}>{title}</h3>
          {description && <p id={`${id}-description`}>{description}</p>}
        </div>
        {actions && <div className="rk-chart-panel-actions">{actions}</div>}
      </div>
      {summary && <div className="rk-chart-panel-summary">{summary}</div>}
      <div className="rk-chart-panel-body">
        {children}
        {animate && <MotionLayer key={revision} active effect="flow" />}
      </div>
    </SvgSurface>
  );
}
