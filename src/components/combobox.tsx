import {
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { Floating } from "../lib/floating";
import { mergeRefs, useControllable } from "../lib/hooks";
import { CheckIcon, ChevronDownIcon, XIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import type { Size } from "./button";
import { Input } from "./input";
import { Spinner } from "./progress";

export interface ComboboxOption<T extends string = string> {
  value: T;
  label: string;
  hint?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ComboboxProps<T extends string = string> {
  /** Static options, filtered as you type. */
  options?: ReadonlyArray<ComboboxOption<T>>;
  /** Async options for a query (debounced; the previous request is aborted). Overrides `options`. */
  loadOptions?: (query: string, signal: AbortSignal) => Promise<ReadonlyArray<ComboboxOption<T>>>;
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T | null) => void;
  /** Accept typed text that matches no option (committed on Enter/blur as its own value). */
  allowCustom?: boolean;
  /** Match rule for static options; default: case-insensitive "contains". */
  filter?: (option: ComboboxOption<T>, query: string) => boolean;
  placeholder?: string;
  size?: Size;
  invalid?: boolean;
  disabled?: boolean;
  emptyText?: ReactNode;
  /** ms before `loadOptions` runs. */
  debounce?: number;
  icon?: ReactNode;
  id?: string;
  "aria-label"?: string;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

const contains = (o: { label: string }, q: string) => o.label.toLowerCase().includes(q.trim().toLowerCase());

/** Option label with the query match in bold. */
function Mark({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const at = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="rk-combobox-mark">{text.slice(at, at + q.length)}</mark>
      {text.slice(at + q.length)}
    </>
  );
}

/**
 * Editable select (APG combobox + listbox): type to filter static options or load them async, ↑/↓ move,
 * Enter picks, Esc closes (and clears when already closed), blur restores the chosen label unless
 * `allowCustom`. Field label/hint wiring comes from Input.
 */
export function Combobox<T extends string = string>({
  options = [],
  loadOptions,
  value,
  defaultValue = null,
  onChange,
  allowCustom,
  filter = contains,
  placeholder,
  size = "md",
  invalid,
  disabled,
  emptyText,
  debounce = 200,
  icon,
  id,
  "aria-label": ariaLabel,
  className,
  ref,
}: ComboboxProps<T>) {
  const labels = useLabels();
  const [current, setCurrent] = useControllable<T | null>(value, defaultValue, onChange);
  const [loaded, setLoaded] = useState<ReadonlyArray<ComboboxOption<T>>>([]);
  const [loading, setLoading] = useState(false);
  const [known, setKnown] = useState<ComboboxOption<T> | null>(null);
  const labelOf = (v: T | null) =>
    v === null
      ? ""
      : ((options.find((o) => o.value === v) ?? (known?.value === v ? known : null))?.label ?? v);
  const [text, setText] = useState(() => labelOf(current));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const listId = useId();

  // external value changes (controlled) re-sync the text while not typing
  // biome-ignore lint/correctness/useExhaustiveDependencies: labelOf reads options/known for the new value
  useEffect(() => {
    if (!typed) setText(labelOf(current));
  }, [current]);

  const query = typed ? text : "";
  const shown = useMemo(
    () => (loadOptions ? loaded : options.filter((o) => filter(o, query))),
    [loadOptions, loaded, options, filter, query],
  );

  useEffect(() => {
    if (!loadOptions || !open) return;
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      loadOptions(query, controller.signal)
        .then((result) => {
          if (controller.signal.aborted) return;
          setLoaded(result);
          setActive(0);
        })
        .catch(() => {
          // aborted or failed: keep the previous options
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, debounce);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [loadOptions, query, open, debounce]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `active` drives the scroll
  useEffect(() => {
    list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const pick = (option: ComboboxOption<T> | undefined) => {
    if (!option || option.disabled) return;
    setKnown(option);
    setCurrent(option.value);
    setText(option.label);
    setTyped(false);
    setOpen(false);
  };
  const settle = () => {
    setOpen(false);
    setTyped(false);
    const exact = shown.find((o) => o.label.toLowerCase() === text.trim().toLowerCase());
    if (exact) return pick(exact);
    if (allowCustom && text.trim()) {
      setCurrent(text.trim() as T);
      return;
    }
    if (!text.trim()) {
      setCurrent(null);
      return;
    }
    setText(labelOf(current));
  };

  const step = (from: number, dir: 1 | -1) => {
    for (let i = from + dir; i >= 0 && i < shown.length; i += dir) if (!shown[i]?.disabled) return i;
    return from;
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const k = event.key;
    if (k === "ArrowDown" || k === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActive((a) => step(a, k === "ArrowDown" ? 1 : -1));
    } else if (k === "Enter") {
      if (!open) return;
      event.preventDefault();
      if (shown[active]) pick(shown[active]);
      else settle();
    } else if (k === "Escape") {
      event.preventDefault();
      if (open) {
        setOpen(false);
        setText(labelOf(current));
        setTyped(false);
      } else if (text) {
        setText("");
        setCurrent(null);
      }
    }
  };

  const activeId = open && shown[active] ? `${listId}-${active}` : undefined;
  // anchor to the whole field box (icon, clear, chevron), not just the inner <input>
  const box = useCallback(() => input.current?.closest(".rk-input")?.getBoundingClientRect() ?? null, []);
  return (
    <>
      <Input
        ref={mergeRefs(input, ref)}
        id={id}
        size={size}
        icon={icon}
        invalid={invalid}
        disabled={disabled}
        className={cx("rk-combobox", className)}
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeId}
        autoComplete="off"
        spellCheck={false}
        value={text}
        placeholder={placeholder}
        onChange={(event) => {
          setText(event.target.value);
          setTyped(true);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        onBlur={(event) => {
          // clicks inside the list keep focus logic to the option handler
          if (list.current?.contains(event.relatedTarget as Node)) return;
          settle();
        }}
        end={
          <>
            {loading && <Spinner size={14} />}
            {text && !disabled && (
              <button
                type="button"
                tabIndex={-1}
                className="rk-input-clear"
                aria-label={labels.clear}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setText("");
                  setTyped(true);
                  setCurrent(null);
                  input.current?.focus();
                }}
              >
                <XIcon />
              </button>
            )}
            <button
              type="button"
              tabIndex={-1}
              className="rk-combobox-toggle"
              aria-label={labels.showOptions}
              disabled={disabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setOpen(!open);
                input.current?.focus();
              }}
            >
              <ChevronDownIcon />
            </button>
          </>
        }
      />
      <Floating
        ref={list}
        id={listId}
        role="listbox"
        anchor={box}
        open={open}
        onOpenChange={(next) => {
          if (!next) setOpen(false);
        }}
        matchWidth
        manual
        className="rk-menu rk-combobox-list"
      >
        {shown.length === 0 ? (
          <div className="rk-combobox-empty">
            {loading ? labels.loading : (emptyText ?? labels.noResults)}
          </div>
        ) : (
          shown.map((o, i) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard is handled on the combobox input
            <div
              key={o.value}
              id={`${listId}-${i}`}
              role="option"
              tabIndex={-1}
              aria-selected={o.value === current}
              aria-disabled={o.disabled || undefined}
              data-active={i === active}
              className="rk-menu-item"
              onPointerMove={() => !o.disabled && setActive(i)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => pick(o)}
            >
              {o.icon && <span className="rk-icon rk-menu-icon">{o.icon}</span>}
              <span className="rk-menu-text">
                <span className="rk-truncate">
                  <Mark text={o.label} query={query} />
                </span>
                {o.hint && <span className="rk-menu-hint">{o.hint}</span>}
              </span>
              {o.value === current && <CheckIcon className="rk-menu-check" />}
            </div>
          ))
        )}
      </Floating>
    </>
  );
}
