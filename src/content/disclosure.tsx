import type { DetailsHTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { ChevronRightIcon } from "../lib/icons";
import { OverlayDecoration, type OverlaySurfaceOptions, overlaySurfaceStyle } from "../overlays/surface";

export interface DisclosureProps extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "title"> {
  surface?: OverlaySurfaceOptions;
  title: ReactNode;
  /** Right side of the summary. */
  aside?: ReactNode;
  /** Same `name` on several = exclusive accordion (native). */
  name?: string;
}

/** Collapsible section on native <details>. */
export function Disclosure({ title, aside, surface, style, className, children, ...rest }: DisclosureProps) {
  return (
    <div className="rk-disclosure-surface" data-surface={surface ? "" : undefined}>
      <OverlayDecoration surface={surface} />
      <details
        {...rest}
        className={cx("rk-disclosure rk-content-surface rk-overlay", className)}
        style={{ ...overlaySurfaceStyle(surface), ...style }}
        data-surface={surface ? "" : undefined}
      >
        <summary>
          <ChevronRightIcon className="rk-disclosure-chevron" />
          <span className="rk-disclosure-title">{title}</span>
          {aside}
        </summary>
        <div className="rk-disclosure-body">{children}</div>
      </details>
    </div>
  );
}
