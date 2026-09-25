import { type ClipboardEvent, type KeyboardEvent, useRef } from "react";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
import { useLabels } from "../lib/labels";
import type { Size } from "./button";
import { useField } from "./input";

const ALLOWED = { numeric: /[0-9]/, alphanumeric: /[0-9a-z]/i } as const;

/** Keep the allowed characters of `text`, up to `length`. */
export function sanitizePin(text: string, type: keyof typeof ALLOWED, length: number): string {
  return [...text]
    .filter((c) => ALLOWED[type].test(c))
    .join("")
    .slice(0, length);
}

export interface PinInputProps {
  /** Number of cells. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called once every cell is filled. */
  onComplete?: (value: string) => void;
  type?: "numeric" | "alphanumeric";
  /** Show dots instead of the characters. */
  mask?: boolean;
  /** Cell counts per group, e.g. [3, 3] renders 123–456. */
  groups?: number[];
  size?: Size;
  invalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Form field name (a hidden input carries the joined value). */
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/**
 * One-time code field: a cell per character. Typing advances, Backspace steps back, arrows move, and a
 * paste or an SMS autofill (`autocomplete="one-time-code"`) spreads across the cells from the caret.
 */
export function PinInput({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  type = "numeric",
  mask,
  groups,
  size = "md",
  invalid,
  disabled,
  autoFocus,
  name,
  className,
  ...rest
}: PinInputProps) {
  const labels = useLabels();
  const field = useField(rest);
  const [current, setCurrent] = useControllable(value, defaultValue, onChange);
  const cells = useRef<Array<HTMLInputElement | null>>([]);
  // focus moves before the re-render, so the focus handler reads the value from here
  const latest = useRef(current);
  latest.current = current;
  const chars = Array.from({ length }, (_, i) => current[i] ?? "");

  const focus = (i: number) => {
    const el = cells.current[Math.max(0, Math.min(length - 1, i))];
    el?.focus();
    el?.select();
  };
  const commit = (next: string[]) => {
    // no holes: a value is the filled prefix, so "1_3" can't happen
    const joined = next.join("").slice(0, length);
    latest.current = joined;
    setCurrent(joined);
    if (joined.length === length && joined !== current) onComplete?.(joined);
  };
  const fill = (from: number, text: string) => {
    const clean = sanitizePin(text, type, length - from);
    if (!clean) return;
    const next = [...chars];
    [...clean].forEach((c, k) => {
      next[from + k] = c;
    });
    commit(next);
    focus(Math.min(from + clean.length, length - 1));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, i: number) => {
    const move = (to: number) => {
      event.preventDefault();
      focus(to);
    };
    if (event.key === "ArrowLeft") move(i - 1);
    else if (event.key === "ArrowRight") move(i + 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(Math.min(current.length, length - 1));
    else if (event.key === "Backspace") {
      event.preventDefault();
      // an empty cell deletes the previous character
      const at = chars[i] ? i : i - 1;
      if (at < 0) return;
      commit([...chars.slice(0, at), ...chars.slice(at + 1)]);
      focus(at);
    } else if (event.key === "Delete") {
      event.preventDefault();
      commit([...chars.slice(0, i), ...chars.slice(i + 1)]);
    }
  };

  let cell = 0;
  const layout = groups?.length ? groups : [length];
  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset would bring a border and legend we don't want
    <div
      role="group"
      aria-label={rest["aria-label"]}
      aria-describedby={field["aria-describedby"]}
      className={cx("rk-pin", className)}
      data-size={size}
      data-invalid={invalid || field["aria-invalid"] || undefined}
      data-disabled={disabled || undefined}
    >
      {layout.map((count, g) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: groups are positional
        <span key={g} className="rk-pin-group">
          {Array.from({ length: count }, () => {
            const i = cell++;
            if (i >= length) return null;
            return (
              <input
                key={i}
                ref={(el) => {
                  cells.current[i] = el;
                }}
                id={i === 0 ? field.id : undefined}
                className="rk-pin-cell"
                type={mask ? "password" : "text"}
                inputMode={type === "numeric" ? "numeric" : "text"}
                autoComplete={i === 0 ? "one-time-code" : "off"}
                autoCapitalize="characters"
                spellCheck={false}
                // biome-ignore lint/a11y/noAutofocus: opt-in, for code-only screens
                autoFocus={autoFocus && i === 0}
                disabled={disabled}
                aria-label={labels.pinDigit(i + 1, length)}
                aria-invalid={invalid || field["aria-invalid"]}
                value={chars[i]}
                data-filled={chars[i] ? true : undefined}
                // cells after the filled prefix stay unreachable by Tab: typing always lands in order
                tabIndex={i <= current.length || i === length - 1 ? 0 : -1}
                onFocus={(event) => {
                  // jump to the first empty cell so there are no holes
                  if (i > latest.current.length) focus(latest.current.length);
                  else event.currentTarget.select();
                }}
                onChange={(event) => {
                  const typed = event.target.value;
                  const old = chars[i] ?? "";
                  // a mobile keyboard may clear the cell without a Backspace keydown
                  if (typed === "") return commit([...chars.slice(0, i), ...chars.slice(i + 1)]);
                  // one new character next to the old one; anything longer is a paste or an autofill
                  fill(
                    i,
                    typed.length === 2 && old ? ((typed[0] === old ? typed[1] : typed[0]) ?? "") : typed,
                  );
                }}
                onKeyDown={(event) => onKeyDown(event, i)}
                onPaste={(event: ClipboardEvent<HTMLInputElement>) => {
                  event.preventDefault();
                  fill(i, event.clipboardData.getData("text"));
                }}
              />
            );
          })}
        </span>
      ))}
      {name && <input type="hidden" name={name} value={current} />}
    </div>
  );
}
