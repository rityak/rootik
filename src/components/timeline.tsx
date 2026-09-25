import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import type { Tone } from "./progress";

export interface TimelineItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  /** Right of the title: a timestamp, RelativeTime, a duration. */
  time?: ReactNode;
  /** Replaces the dot (small icon in a circle). */
  icon?: ReactNode;
  tone?: Tone;
  /**
   * done — solid marker and line; current — accent ring; pending — hollow marker, the line up to it is
   * hatched (the kit's "not yet" texture).
   */
  status?: "done" | "current" | "pending";
  /** Extra content under the description (a log excerpt, a diff, buttons). */
  children?: ReactNode;
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  items: ReadonlyArray<TimelineItem>;
  size?: "sm" | "md";
}

/** Vertical list of events (run history, audit log, pipeline stages) joined by a line. */
export function Timeline({ items, size = "md", className, ...rest }: TimelineProps) {
  return (
    <ol {...rest} className={cx("rk-timeline", className)} data-size={size}>
      {items.map((item) => (
        <li
          key={item.id}
          className="rk-timeline-item"
          data-status={item.status ?? "done"}
          data-tone={item.tone}
          aria-current={item.status === "current" ? "step" : undefined}
        >
          <span className="rk-timeline-marker" data-icon={item.icon ? true : undefined} aria-hidden="true">
            {item.icon}
          </span>
          <div className="rk-timeline-body">
            <div className="rk-timeline-head">
              <span className="rk-timeline-title">{item.title}</span>
              {item.time && <span className="rk-timeline-time">{item.time}</span>}
            </div>
            {item.description && <div className="rk-timeline-desc">{item.description}</div>}
            {item.children && <div className="rk-timeline-extra">{item.children}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
