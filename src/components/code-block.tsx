import { type HTMLAttributes, type ReactNode, useState } from "react";
import { cx } from "../lib/cx";
import { icon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { IconButton } from "./button";
import { CopyButton } from "./copy-button";

const WrapIcon = icon(
  <>
    <path d="m16 16-3 3 3 3" />
    <path d="M3 12h14.5a1 1 0 0 1 0 7H13" />
    <path d="M3 19h6" />
    <path d="M3 5h18" />
  </>,
);

const TRAILING_NEWLINE = /\n$/;

/** Inline code: commands, keys, file names inside text. */
export function Code({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <code {...rest} className={cx("rk-code", className)} />;
}

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  code: string;
  /** Header left: file name or caption. */
  title?: ReactNode;
  /** Shown as a tag in the header ("yaml", "json"). */
  language?: string;
  lineNumbers?: boolean;
  /** 1-based lines to highlight. */
  highlight?: readonly number[];
  /** Soft-wrap long lines (a header toggle flips it). */
  wrap?: boolean;
  /** Copy button (default true). */
  copyable?: boolean;
  /** Scroll beyond this height. */
  maxHeight?: number | string;
  /** Plug a highlighter: returns the rendered content of one line. */
  renderLine?: (line: string, index: number) => ReactNode;
}

/**
 * Monospace block with a header (title, language, wrap toggle, copy), optional line numbers and
 * highlighted lines. No syntax colouring built in (zero deps); `renderLine` accepts one.
 * Line numbers are generated content, so copying the selection gives clean code.
 */
export function CodeBlock({
  code,
  title,
  language,
  lineNumbers,
  highlight,
  wrap: wrapInitial = false,
  copyable = true,
  maxHeight,
  renderLine,
  className,
  style,
  ...rest
}: CodeBlockProps) {
  const labels = useLabels();
  const [wrap, setWrap] = useState(wrapInitial);
  const lines = code.replace(TRAILING_NEWLINE, "").split("\n");
  const marked = new Set(highlight);
  const header = title !== undefined || language !== undefined || copyable;
  return (
    <div {...rest} className={cx("rk-code-block", className)} style={style}>
      {header && (
        <div className="rk-code-head">
          <span className="rk-code-title">{title}</span>
          {language && <span className="rk-code-lang">{language}</span>}
          <IconButton
            size="sm"
            icon={<WrapIcon />}
            label={labels.wrapLines}
            active={wrap}
            onClick={() => setWrap(!wrap)}
          />
          {copyable && <CopyButton size="sm" value={code} />}
        </div>
      )}
      <pre
        className="rk-code-pre"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be reachable by keyboard
        tabIndex={0}
        data-wrap={wrap || undefined}
        data-numbers={lineNumbers || undefined}
        style={{ maxHeight }}
      >
        <code>
          {lines.map((line, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: lines are positional
              key={i}
              className="rk-code-line"
              data-highlight={marked.has(i + 1) || undefined}
            >
              {renderLine ? renderLine(line, i) : line}
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
