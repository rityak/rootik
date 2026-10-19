import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { ChevronRightIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: ReadonlyArray<{ label: ReactNode; href?: string; onClick?: () => void; icon?: ReactNode }>;
}

export function Breadcrumbs({ items, className, ...rest }: BreadcrumbsProps) {
  const strings = useLabels();
  return (
    <nav aria-label={strings.breadcrumb} {...rest} className={cx("rk-breadcrumbs", className)}>
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          const content = (
            <>
              {item.icon && <span className="rk-icon">{item.icon}</span>}
              {item.label}
            </>
          );
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: path position is the identity
            <li key={i}>
              {last ? (
                <span aria-current="page">{content}</span>
              ) : item.href ? (
                <a href={item.href} onClick={item.onClick}>
                  {content}
                </a>
              ) : (
                <button type="button" onClick={item.onClick}>
                  {content}
                </button>
              )}
              {!last && <ChevronRightIcon className="rk-breadcrumbs-sep" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
