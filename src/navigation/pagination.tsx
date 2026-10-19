import { Select } from "../components/select";
import { cx } from "../lib/cx";
import { ChevronLeftIcon, ChevronRightIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";

export interface PaginationProps {
  /** 1-based. */
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  /** Pages shown around the current one. */
  siblings?: number;
  /** `compact`: "3 / 20" between the arrows, for toolbars and narrow panels. */
  variant?: "full" | "compact";
  /** With `total`, shows the item range ("26–50 of 480"). */
  pageSize?: number;
  total?: number;
  /** Options for a page-size select; shown with `onPageSizeChange`. */
  pageSizes?: ReadonlyArray<number>;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

export function pageRange(page: number, count: number, siblings: number): Array<number | "…"> {
  const pages = new Set([1, count]);
  for (let p = page - siblings; p <= page + siblings; p++) if (p >= 1 && p <= count) pages.add(p);
  const sorted = [...pages].sort((a, b) => a - b);
  const out: Array<number | "…"> = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev === 2) out.push(prev + 1);
    else if (prev !== undefined && p - prev > 2) out.push("…");
    out.push(p);
  });
  return out;
}

export function Pagination({
  page,
  pageCount,
  onChange,
  siblings = 1,
  variant = "full",
  pageSize,
  total,
  pageSizes = [10, 25, 50, 100],
  onPageSizeChange,
  className,
}: PaginationProps) {
  const strings = useLabels();
  const from = pageSize && total !== undefined ? Math.min(total, (page - 1) * pageSize + 1) : 0;
  const to = pageSize && total !== undefined ? Math.min(total, page * pageSize) : 0;
  return (
    <nav aria-label={strings.pagination} className={cx("rk-pagination", className)} data-variant={variant}>
      {pageSize !== undefined && total !== undefined && (
        <span className="rk-pagination-info rk-num">{strings.itemRange(from, to, total)}</span>
      )}
      {pageSize !== undefined && onPageSizeChange && (
        <Select
          size="sm"
          variant="button"
          aria-label={strings.pageSize}
          value={String(pageSize)}
          onChange={(v) => onPageSizeChange(Number(v))}
          options={pageSizes.map((n) => ({ value: String(n), label: strings.perPage(n) }))}
          className="rk-pagination-size"
        />
      )}
      <button
        type="button"
        aria-label={strings.previousPage}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeftIcon />
      </button>
      {variant === "compact" ? (
        <span className="rk-pagination-current rk-num" aria-current="page">
          {page} / {pageCount}
        </span>
      ) : (
        pageRange(page, pageCount, siblings).map((p, i) =>
          p === "…" ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis has no identity
            <span key={`e${i}`} className="rk-pagination-gap">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-current={p === page ? "page" : undefined}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          ),
        )
      )}
      <button
        type="button"
        aria-label={strings.nextPage}
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRightIcon />
      </button>
    </nav>
  );
}
