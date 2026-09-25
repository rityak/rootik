import { type CSSProperties, type HTMLAttributes, type ReactNode, useCallback, useState } from "react";
import { cx } from "../lib/cx";
import type { Placement } from "../lib/floating";
import { Tooltip } from "./tooltip";

export interface TruncateProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  children: ReactNode;
  /** Lines before the ellipsis (default 1). */
  lines?: number;
  /** String children only: keep this many trailing characters visible ("dataset/…/img_0042.png"). */
  middle?: number;
  /** Tooltip shown while truncated; defaults to the children. `false` disables it. */
  tooltip?: ReactNode | false;
  placement?: Placement;
}

/**
 * Ellipsis that tells when it cuts: the full text appears in a tooltip only while it is actually
 * truncated (measured on resize), so short values don't pop useless tooltips. The DOM keeps the whole
 * text, so screen readers and copy get all of it.
 */
export function Truncate({
  children,
  lines = 1,
  middle,
  tooltip,
  placement = "top",
  className,
  style,
  ...rest
}: TruncateProps) {
  const [truncated, setTruncated] = useState(false);
  const text = typeof children === "string" ? children : undefined;
  const split = middle !== undefined && middle > 0 && text !== undefined && text.length > middle;

  // callback ref: the span remounts when the tooltip wrapper toggles, the observer follows it
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure when the content changes
  const observe = useCallback(
    (el: HTMLSpanElement | null) => {
      if (!el) return;
      const box = split ? ((el.firstElementChild as HTMLElement | null) ?? el) : el;
      const measure = () =>
        setTruncated(box.scrollWidth > box.clientWidth + 1 || box.scrollHeight > box.clientHeight + 1);
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      return () => observer.disconnect();
    },
    [children, lines, split],
  );

  const span = (
    <span
      {...rest}
      ref={observe}
      className={cx("rk-truncate-text", className)}
      data-lines={lines > 1 ? lines : undefined}
      data-middle={split || undefined}
      style={lines > 1 ? ({ ...style, "--rk-lines": lines } as CSSProperties) : style}
    >
      {split && text ? (
        <>
          <span className="rk-truncate-start">{text.slice(0, -middle)}</span>
          <span className="rk-truncate-end">{text.slice(-middle)}</span>
        </>
      ) : (
        children
      )}
    </span>
  );

  return (
    <Tooltip
      content={tooltip === false ? undefined : (tooltip ?? children)}
      placement={placement}
      disabled={!truncated}
    >
      {span}
    </Tooltip>
  );
}
