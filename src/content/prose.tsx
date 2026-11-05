import type { HTMLAttributes } from "react";
import { cx } from "../lib/cx";

export interface ProseProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md";
}

/**
 * Typography for rendered markdown and long-form text (help, release notes, changelogs): headings,
 * paragraphs, lists, links, inline code and code blocks, quotes, tables, rules, images. Style the HTML
 * a markdown renderer outputs without adding classes to every element; `.rk-prose` works on its own too.
 */
export function Prose({ size = "md", className, ...rest }: ProseProps) {
  return <div {...rest} className={cx("rk-prose", className)} data-size={size} />;
}
