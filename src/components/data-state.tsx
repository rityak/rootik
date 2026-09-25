import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { RotateIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { Button } from "./button";
import { Callout, EmptyState, type EmptyStateProps } from "./card";
import { Skeleton } from "./progress";

export type DataStatus = "loading" | "error" | "empty" | "ready";

/** Which of the four states applies: loading wins, then error, then empty. */
export function dataStatus({
  loading,
  error,
  empty,
}: {
  loading?: boolean;
  error?: unknown;
  empty?: boolean;
}): DataStatus {
  if (loading) return "loading";
  if (error !== undefined && error !== null && error !== false) return "error";
  return empty ? "empty" : "ready";
}

function errorText(error: unknown): ReactNode {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return null;
}

export interface DataStateProps {
  /** Explicit state; otherwise derived from loading / error / empty. */
  status?: DataStatus;
  loading?: boolean;
  /** An Error, a message, or any truthy value. */
  error?: unknown;
  empty?: boolean;
  /** Adds a Retry button to the error state. */
  onRetry?: () => void;
  /** Loading placeholder shaped like the content (default: three skeleton lines). */
  skeleton?: ReactNode;
  /** Empty state: EmptyState props or your own node. */
  emptyState?: Partial<EmptyStateProps> | ReactNode;
  errorTitle?: ReactNode;
  /** Content; a function is only called once the data is ready. */
  children: ReactNode | (() => ReactNode);
  className?: string;
}

/**
 * One switch for the four states of fetched data: loading (skeleton, aria-busy), error (danger callout
 * with the message and Retry), empty (EmptyState) and ready (the content).
 */
export function DataState({
  status,
  loading,
  error,
  empty,
  onRetry,
  skeleton,
  emptyState,
  errorTitle,
  children,
  className,
}: DataStateProps) {
  const labels = useLabels();
  const state = status ?? dataStatus({ loading, error, empty });
  if (state === "ready") return <>{typeof children === "function" ? children() : children}</>;
  return (
    <div className={cx("rk-data-state", className)} data-status={state}>
      {state === "loading" && (
        <div role="status" aria-busy="true" aria-label={labels.loading}>
          {skeleton ?? <Skeleton lines={3} />}
        </div>
      )}
      {state === "error" && (
        <Callout
          tone="danger"
          title={errorTitle ?? labels.loadFailed}
          actions={
            onRetry && (
              <Button size="sm" variant="secondary" icon={<RotateIcon />} onClick={onRetry}>
                {labels.retry}
              </Button>
            )
          }
        >
          {errorText(error)}
        </Callout>
      )}
      {state === "empty" &&
        (isEmptyProps(emptyState) ? (
          <EmptyState title={labels.noData} size="sm" {...emptyState} />
        ) : (
          emptyState
        ))}
    </div>
  );
}

function isEmptyProps(v: unknown): v is Partial<EmptyStateProps> | undefined {
  return v === undefined || (typeof v === "object" && v !== null && !("$$typeof" in v));
}
