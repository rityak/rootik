import {
  createContext,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
  useContext,
} from "react";
import { cx } from "../lib/cx";
import type { Tone } from "./progress";

const InList = createContext(false);

export interface ItemProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "onClick"> {
  title: ReactNode;
  description?: ReactNode;
  /** Icon in a tinted well. */
  icon?: ReactNode;
  iconTone?: Tone;
  /** Raw leading media instead of `icon`: Avatar, flag, thumbnail. */
  media?: ReactNode;
  /** Secondary text on the right: ping, size, date. */
  meta?: ReactNode;
  /** Trailing controls; they stay clickable above the row's own action. */
  actions?: ReactNode;
  /** Makes the whole row a link. */
  href?: string;
  /** Makes the whole row a button. */
  onClick?: MouseEventHandler<HTMLElement>;
  /** Selected row: inverted, `aria-pressed` on the row button. */
  selected?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  /** plain — bare row; outline — bordered; surface — filled card row. */
  variant?: "plain" | "outline" | "surface";
}

/**
 * Generic list row: media, title + description, meta and actions. With `href` or `onClick` the whole row
 * is one link/button (stretched over the row), while `actions` stay separately clickable — no nested
 * interactive elements.
 */
export function Item({
  title,
  description,
  icon,
  iconTone,
  media,
  meta,
  actions,
  href,
  onClick,
  selected,
  disabled,
  size = "md",
  variant = "plain",
  className,
  ...rest
}: ItemProps) {
  const inList = useContext(InList);
  const Root = inList ? "li" : "div";
  const interactive = href !== undefined || onClick !== undefined;
  const hit =
    href !== undefined && !disabled ? (
      <a className="rk-item-hit" href={href} onClick={onClick} aria-current={selected ? "true" : undefined}>
        {title}
      </a>
    ) : interactive ? (
      <button
        type="button"
        className="rk-item-hit"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={selected === undefined ? undefined : selected}
      >
        {title}
      </button>
    ) : (
      title
    );
  return (
    <Root
      {...rest}
      className={cx("rk-item", className)}
      data-size={size}
      data-variant={variant}
      data-interactive={interactive || undefined}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
    >
      {(icon || media) && (
        <div
          className="rk-item-media"
          data-icon={icon ? "" : undefined}
          data-tone={icon ? iconTone : undefined}
        >
          {icon ?? media}
        </div>
      )}
      <div className="rk-item-body">
        <div className="rk-item-title">{hit}</div>
        {description && <div className="rk-item-desc">{description}</div>}
      </div>
      {meta && <div className="rk-item-meta rk-num">{meta}</div>}
      {actions && <div className="rk-item-actions">{actions}</div>}
    </Root>
  );
}

export interface ItemGroupProps extends HTMLAttributes<HTMLUListElement> {
  /** divided — hairlines between rows; cards — separate surface rows with a gap. */
  variant?: "plain" | "divided" | "cards";
  /** Constrains the list and enables its own vertical scrolling. */
  maxHeight?: number | string;
}

/** A list of Items (renders `ul` > `li`). */
export function ItemGroup({
  variant = "plain",
  maxHeight,
  className,
  style,
  children,
  ...rest
}: ItemGroupProps) {
  return (
    <ul
      {...rest}
      className={cx("rk-item-group", className)}
      data-variant={variant}
      style={{ ...style, maxHeight }}
    >
      <InList value>{children}</InList>
    </ul>
  );
}
