import { type CSSProperties, type HTMLAttributes, type ReactNode, useEffect, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
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

export interface CodeEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "title"> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  title?: ReactNode;
  language?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  rows?: number;
  maxHeight?: number | string;
  "aria-label"?: string;
}

/**
 * Lightweight token-themed code editor. For IDE features keep CodeMirror/Monaco in the app and wrap it
 * in rk-code-editor-theme to reuse the same editor colors.
 */
export function CodeEditor({
  value,
  defaultValue = "",
  onChange,
  title,
  language,
  placeholder,
  disabled,
  readOnly,
  autoFocus,
  rows = 10,
  maxHeight,
  "aria-label": ariaLabel,
  className,
  style,
  ...rest
}: CodeEditorProps) {
  const labels = useLabels();
  const [current, setCurrent] = useControllable(value, defaultValue, onChange);
  const editor = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (autoFocus) editor.current?.focus();
  }, [autoFocus]);
  return (
    <div
      {...rest}
      className={cx("rk-code-editor rk-code-editor-theme", className)}
      style={
        {
          "--rk-code-editor-max": typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
          ...style,
        } as CSSProperties
      }
    >
      {(title !== undefined || language !== undefined) && (
        <div className="rk-code-head">
          <span className="rk-code-title">{title}</span>
          {language && <span className="rk-code-lang">{language}</span>}
        </div>
      )}
      <textarea
        ref={editor}
        value={current}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        spellCheck={false}
        aria-label={ariaLabel ?? (typeof title === "string" ? title : labels.codeEditor)}
        onChange={(event) => setCurrent(event.target.value)}
      />
    </div>
  );
}
