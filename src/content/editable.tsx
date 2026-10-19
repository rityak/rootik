import { type HTMLAttributes, type KeyboardEvent, useEffect, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
import { PencilIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";

export interface EditableProps extends Omit<HTMLAttributes<HTMLSpanElement>, "onChange" | "defaultValue"> {
  value?: string;
  defaultValue?: string;
  /** Called on commit with the new, changed value. */
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Empty input reverts instead of committing (default true). */
  required?: boolean;
  /** Return an error message to keep editing (duplicate name, bad characters). */
  validate?: (value: string) => string | null | undefined;
  /** Commit when focus leaves the input (default true); otherwise blur cancels. */
  submitOnBlur?: boolean;
  disabled?: boolean;
  /** Accessible name of the view button; defaults to "Rename". */
  label?: string;
  mono?: boolean;
}

/**
 * Rename in place: the text is a button (click, Enter or F2) that turns into an input sized to its
 * content. Enter commits, Escape cancels, focus returns to the text. Inherits the surrounding font,
 * so it works for titles as well as table cells.
 */
export function Editable({
  value,
  defaultValue = "",
  onChange,
  placeholder,
  required = true,
  validate,
  submitOnBlur = true,
  disabled,
  label,
  mono,
  className,
  ...rest
}: EditableProps) {
  const labels = useLabels();
  const [current, setCurrent] = useControllable(value, defaultValue, onChange);
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const view = useRef<HTMLButtonElement>(null);
  const editing = draft !== null;

  useEffect(() => {
    if (editing) input.current?.select();
  }, [editing]);

  const close = () => {
    setDraft(null);
    setError(null);
    requestAnimationFrame(() => view.current?.focus());
  };
  const commit = () => {
    if (draft === null) return;
    const next = draft.trim();
    if (next === current || (required && !next)) return close();
    const problem = validate?.(next);
    if (problem) {
      setError(problem);
      input.current?.focus();
      return;
    }
    setCurrent(next);
    close();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    }
  };

  return (
    <span
      {...rest}
      className={cx("rk-editable", className)}
      data-editing={editing || undefined}
      data-mono={mono || undefined}
    >
      {editing ? (
        <input
          ref={input}
          className="rk-editable-input"
          value={draft}
          placeholder={placeholder}
          aria-label={label ?? labels.rename}
          aria-invalid={error ? true : undefined}
          title={error ?? undefined}
          spellCheck={false}
          onChange={(event) => {
            setDraft(event.target.value);
            setError(null);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => (submitOnBlur && !error ? commit() : close())}
        />
      ) : (
        <button
          ref={view}
          type="button"
          className="rk-editable-view"
          disabled={disabled}
          aria-label={`${label ?? labels.rename}: ${current || placeholder || ""}`}
          onClick={() => setDraft(current)}
          onKeyDown={(event) => {
            if (event.key === "F2") setDraft(current);
          }}
        >
          <span className="rk-editable-text" data-empty={!current || undefined}>
            {current || placeholder}
          </span>
          <PencilIcon className="rk-editable-icon" />
        </button>
      )}
      {error && (
        <span className="rk-editable-error" role="alert">
          {error}
        </span>
      )}
    </span>
  );
}
