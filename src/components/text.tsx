import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";

export type TextTone = "default" | "muted" | "faint" | "accent" | "success" | "warn" | "danger" | "info";
export type TextSize = "xs" | "sm" | "md" | "lg";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: "span" | "p" | "div" | "label";
  tone?: TextTone;
  size?: TextSize;
  truncate?: boolean;
  children?: ReactNode;
}

/** Toolkit text with shared size, semantic tone and truncation. */
export function Text({
  as: Root = "span",
  tone = "default",
  size = "md",
  truncate,
  className,
  ...rest
}: TextProps) {
  return (
    <Root
      {...rest}
      className={cx("rk-text", truncate && "rk-truncate", className)}
      data-text-tone={tone}
      data-size={size}
    />
  );
}
