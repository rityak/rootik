import { type CSSProperties, type HTMLAttributes, type ReactNode, useLayoutEffect, useRef } from "react";
import { cx } from "../lib/cx";
import { useElementSize } from "../lib/hooks";
import { ChevronLeftIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";

export interface MasterDetailProps extends HTMLAttributes<HTMLDivElement> {
  list: ReactNode;
  /** The selected item's view; `null`/`undefined` when nothing is selected. */
  detail?: ReactNode;
  /** Narrow layout only: the back button's handler (clear the selection). */
  onBack?: () => void;
  /** Detail placeholder on wide layouts while nothing is selected. */
  empty?: ReactNode;
  listWidth?: number;
  /** Below this width (px) list and detail stack: one at a time, with a back button. */
  stackBelow?: number;
}

/** List + detail side by side; stacked with a back button when narrow (mail, nodes, runs). */
export function MasterDetail({
  list,
  detail,
  onBack,
  empty,
  listWidth = 300,
  stackBelow = 640,
  className,
  style,
  ...rest
}: MasterDetailProps) {
  const size = useElementSize<HTMLDivElement>();
  const strings = useLabels();
  const back = useRef<HTMLButtonElement>(null);
  const stacked = size.width > 0 && size.width < stackBelow;
  const hasDetail = detail !== null && detail !== undefined;
  const showDetail = !stacked || hasDetail;
  // stacked: opening a detail replaces the list, so focus follows to the back button
  useLayoutEffect(() => {
    if (stacked && hasDetail) back.current?.focus();
  }, [stacked, hasDetail]);
  return (
    <div
      {...rest}
      ref={size.ref}
      className={cx("rk-master-detail", className)}
      data-stacked={stacked || undefined}
      style={{ "--rk-md-list-w": `${listWidth}px`, ...style } as CSSProperties}
    >
      {!(stacked && hasDetail) && <div className="rk-master-detail-list">{list}</div>}
      {showDetail && (
        <div className="rk-master-detail-detail">
          {stacked && hasDetail && (
            <div className="rk-master-detail-bar">
              <button ref={back} type="button" className="rk-master-detail-back" onClick={onBack}>
                <ChevronLeftIcon />
                {strings.back}
              </button>
            </div>
          )}
          {hasDetail ? detail : empty}
        </div>
      )}
    </div>
  );
}
