import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** Above the title: breadcrumbs, back link. */
  eyebrow?: ReactNode;
  /** Right side: actions, tabs, badges. */
  actions?: ReactNode;
  /** Large display title (dashboards) vs compact (tool pages). */
  size?: "sm" | "lg";
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  size = "sm",
  className,
  ...rest
}: PageHeaderProps) {
  return (
    <header {...rest} className={cx("rk-page-header", className)} data-size={size}>
      <div className="rk-page-titles">
        {eyebrow && <div className="rk-page-eyebrow">{eyebrow}</div>}
        <h1 className="rk-page-title">{title}</h1>
        {description && <p className="rk-page-desc">{description}</p>}
      </div>
      {actions && <div className="rk-page-actions">{actions}</div>}
    </header>
  );
}

/** Scrollable page body: centered column of limited width. */
export function PageBody({
  width = 1120,
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { width?: number | "none" }) {
  return (
    <div {...rest} className={cx("rk-page-body", className)}>
      <div className="rk-page-column" style={{ maxWidth: width === "none" ? undefined : width }}>
        {children}
      </div>
    </div>
  );
}
