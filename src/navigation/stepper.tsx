import type { HTMLAttributes, ReactNode } from "react";
import { SvgControlFrame, useSvgControlBorder } from "../components/svg-control-frame";
import { cx } from "../lib/cx";
import { CheckIcon, XIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import type { SvgControlBorder } from "../lib/svg-geometry";

export interface Step {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  /** Mark a step as failed (validation errors) regardless of position. */
  error?: boolean;
  disabled?: boolean;
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLOListElement>, "onChange"> {
  svgBorder?: SvgControlBorder;
  steps: ReadonlyArray<Step>;
  /** Index of the current step; earlier steps count as completed. */
  current: number;
  /** Makes steps clickable (completed ones, plus later ones when `linear` is off). */
  onStepClick?: (index: number) => void;
  /** Only completed steps (and the current one) can be clicked. */
  linear?: boolean;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md";
}

/**
 * Progress through a multi-step flow (wizard, import, setup): numbered markers turn into checks as
 * steps complete, the track to come is hatched. Clickable steps are buttons; the current one carries
 * aria-current="step" and each step's state is spelled out for screen readers.
 */
export function Stepper({
  steps,
  svgBorder,
  current,
  onStepClick,
  linear = true,
  orientation = "horizontal",
  size = "md",
  className,
  ...rest
}: StepperProps) {
  const labels = useLabels();
  const border = useSvgControlBorder(svgBorder);
  return (
    <ol
      {...rest}
      className={cx("rk-stepper", className)}
      data-orientation={orientation}
      data-size={size}
      data-svg-border={border}
    >
      {steps.map((step, i) => {
        const state = step.error
          ? "error"
          : i < current
            ? "complete"
            : i === current
              ? "current"
              : "upcoming";
        const clickable = onStepClick !== undefined && !step.disabled && (!linear || i <= current);
        const srState =
          state === "error"
            ? labels.stepError
            : state === "complete"
              ? labels.stepComplete
              : state === "current"
                ? labels.stepCurrent
                : undefined;
        const inner = (
          <>
            <span className="rk-step-marker" aria-hidden="true">
              {border && <SvgControlFrame border={border} />}
              <span className="rk-step-symbol">
                {state === "complete" ? <CheckIcon /> : state === "error" ? <XIcon /> : i + 1}
              </span>
            </span>
            <span className="rk-step-text">
              <span className="rk-step-label">{step.label}</span>
              {step.description && <span className="rk-step-desc">{step.description}</span>}
              {srState && <span className="rk-sr-only">, {srState}</span>}
            </span>
          </>
        );
        return (
          <li
            key={step.id}
            className="rk-step"
            data-state={state}
            data-done={i < current || undefined}
            aria-current={i === current ? "step" : undefined}
          >
            {clickable ? (
              <button
                type="button"
                className="rk-step-inner"
                onClick={() => {
                  if (i !== current) onStepClick(i);
                }}
              >
                {inner}
              </button>
            ) : (
              <div className="rk-step-inner" data-disabled={step.disabled || undefined}>
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
