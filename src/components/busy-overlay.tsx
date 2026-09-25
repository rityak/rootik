import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { Spinner } from "./progress";

export interface BusyOverlayProps extends HTMLAttributes<HTMLDivElement> {
  busy: boolean;
  /** Text next to the spinner ("Updating…"); also its accessible name. */
  label?: string;
  /** Blur the content under the scrim, not just dim it. */
  blur?: boolean;
  children: ReactNode;
}

/**
 * Keeps stale content visible while a region refetches: dims it, makes it `inert` (no clicks, no focus,
 * hidden from assistive tech until done) and shows a spinner. The overlay fades in after a short delay so
 * fast refreshes don't flash.
 */
export function BusyOverlay({ busy, label, blur, className, children, ...rest }: BusyOverlayProps) {
  return (
    <div
      {...rest}
      className={cx("rk-busy", className)}
      data-busy={busy || undefined}
      aria-busy={busy || undefined}
    >
      <div className="rk-busy-content" inert={busy}>
        {children}
      </div>
      {busy && (
        <div className="rk-busy-overlay" data-blur={blur || undefined}>
          <span className="rk-busy-badge">
            <Spinner size={16} label={label} />
            {label && <span aria-hidden="true">{label}</span>}
          </span>
        </div>
      )}
    </div>
  );
}
