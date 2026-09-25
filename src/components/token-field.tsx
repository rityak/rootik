import {
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { Floating } from "../lib/floating";
import { useControllable } from "../lib/hooks";
import { XIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import type { Size } from "./button";
import { useField } from "./input";

const SPLIT = /[,\n]/;

/** "a, b,, c" → ["a", "b", "c"]: trims, drops empties. */
export const splitTokens = (text: string) =>
  text
    .split(SPLIT)
    .map((t) => t.trim())
    .filter(Boolean);

export interface TokenFieldProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** Suggestions shown while typing (already added ones are hidden). */
  suggestions?: readonly string[];
  /** Message rejects a token (bad characters, unknown key) and keeps the text for editing. */
  validate?: (token: string) => string | null | undefined;
  allowDuplicates?: boolean;
  max?: number;
  placeholder?: string;
  size?: Size;
  invalid?: boolean;
  disabled?: boolean;
  /** Custom token content; default shows `key:` dimmed for filter-style tokens. */
  renderToken?: (token: string) => ReactNode;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  className?: string;
}

function DefaultToken({ token }: { token: string }) {
  const at = token.indexOf(":");
  if (at <= 0 || at === token.length - 1) return <>{token}</>;
  return (
    <>
      <span className="rk-token-key">{token.slice(0, at + 1)}</span>
      {token.slice(at + 1)}
    </>
  );
}

/**
 * Tags typed inline with the text: Enter or comma turns the text into a token, Backspace on an empty
 * input selects then removes the last one, pasted lists split on commas/newlines, suggestions filter as
 * you type (↑/↓, Enter). Filter-style `key:value` tokens show the key dimmed.
 */
export function TokenField({
  value,
  defaultValue = [],
  onChange,
  suggestions = [],
  validate,
  allowDuplicates,
  max,
  placeholder,
  size = "md",
  invalid,
  disabled,
  renderToken,
  className,
  ...rest
}: TokenFieldProps) {
  const labels = useLabels();
  const field = useField(rest);
  const [tokens, setTokens] = useControllable(value, defaultValue, onChange);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [armed, setArmed] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const listId = useId();
  const full = max !== undefined && tokens.length >= max;

  const shown = useMemo(() => {
    const q = text.trim().toLowerCase();
    return suggestions
      .filter((s) => allowDuplicates || !tokens.includes(s))
      .filter((s) => !q || s.toLowerCase().includes(q))
      .slice(0, 50);
  }, [suggestions, tokens, text, allowDuplicates]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: a new query restarts the highlight
  useEffect(() => {
    setActive(0);
  }, [text]);

  const add = (candidates: string[]) => {
    const next = [...tokens];
    for (const raw of candidates) {
      const token = raw.trim();
      if (!token || (!allowDuplicates && next.includes(token))) continue;
      if (max !== undefined && next.length >= max) break;
      const problem = validate?.(token);
      if (problem) {
        setError(problem);
        setText(token);
        if (next.length !== tokens.length) setTokens(next);
        return false;
      }
      next.push(token);
    }
    if (next.length !== tokens.length) setTokens(next);
    setError(null);
    setText("");
    return true;
  };
  const remove = (index: number) => {
    setTokens(tokens.filter((_, i) => i !== index));
    setArmed(false);
    input.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const k = event.key;
    if (k === "Backspace" && text === "" && tokens.length > 0) {
      event.preventDefault();
      if (armed) remove(tokens.length - 1);
      else setArmed(true);
      return;
    }
    setArmed(false);
    if (k === "ArrowDown" || k === "ArrowUp") {
      if (shown.length === 0) return;
      event.preventDefault();
      setOpen(true);
      setActive((a) => (k === "ArrowDown" ? Math.min(shown.length - 1, a + 1) : Math.max(0, a - 1)));
    } else if (k === "Enter" || k === ",") {
      const pick = open && shown[active] && (text.trim() === "" || k === "Enter") ? shown[active] : text;
      if (!pick.trim()) return;
      event.preventDefault();
      if (add([pick])) setOpen(false);
    } else if (k === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
    }
  };
  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text");
    if (!SPLIT.test(pasted)) return;
    event.preventDefault();
    add(splitTokens(text + pasted));
  };

  const anchor = useCallback(
    () => input.current?.closest(".rk-token-field")?.getBoundingClientRect() ?? null,
    [],
  );
  const activeId = open && shown[active] ? `${listId}-${active}` : undefined;

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: clicking the box focuses the input */}
      <div
        className={cx("rk-input rk-token-field", className)}
        data-size={size}
        data-invalid={invalid || error || field["aria-invalid"] || undefined}
        data-disabled={disabled || undefined}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            event.preventDefault();
            input.current?.focus();
          }
        }}
      >
        {tokens.map((token, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: duplicates are possible with allowDuplicates
            key={`${token}-${i}`}
            className="rk-token"
            data-armed={armed && i === tokens.length - 1 ? "" : undefined}
          >
            <span className="rk-token-text">
              {renderToken ? renderToken(token) : <DefaultToken token={token} />}
            </span>
            {!disabled && (
              <button
                type="button"
                tabIndex={-1}
                className="rk-token-remove"
                aria-label={labels.removeToken(token)}
                onClick={() => remove(i)}
              >
                <XIcon />
              </button>
            )}
          </span>
        ))}
        <input
          {...field}
          ref={input}
          className="rk-input-el rk-token-input"
          value={text}
          disabled={disabled || full}
          placeholder={tokens.length === 0 ? placeholder : undefined}
          role="combobox"
          aria-expanded={open && shown.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          aria-invalid={invalid || Boolean(error) || field["aria-invalid"]}
          title={error ?? undefined}
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => {
            setText(event.target.value);
            setError(null);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            setArmed(false);
            if (text.trim()) add([text]);
          }}
        />
      </div>
      {error && (
        <span className="rk-token-error" role="alert">
          {error}
        </span>
      )}
      <Floating
        ref={list}
        id={listId}
        role="listbox"
        anchor={anchor}
        open={open && shown.length > 0}
        manual
        matchWidth
        className="rk-menu rk-token-list"
      >
        {shown.map((s, i) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard is handled on the input
          <div
            key={s}
            id={`${listId}-${i}`}
            role="option"
            tabIndex={-1}
            aria-selected={false}
            data-active={i === active}
            className="rk-menu-item"
            onPointerMove={() => setActive(i)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => add([s])}
          >
            <span className="rk-menu-text rk-truncate">
              <DefaultToken token={s} />
            </span>
          </div>
        ))}
      </Floating>
    </>
  );
}
