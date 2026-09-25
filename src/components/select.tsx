import { type CSSProperties, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { Floating } from "../lib/floating";
import { useControllable } from "../lib/hooks";
import { CheckIcon, ChevronDownIcon } from "../lib/icons";
import type { Size } from "./button";
import { useField } from "./input";

export interface SelectOption<T extends string = string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  /** Secondary line under the label. */
  hint?: ReactNode;
  disabled?: boolean;
  /** Typeahead text when `label` isn't a string. */
  text?: string;
}

export interface SelectProps<T extends string = string> {
  options: ReadonlyArray<SelectOption<T>>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  placeholder?: ReactNode;
  size?: Size;
  /** `field`: input-like box; `button`: looks like a secondary button (toolbars, card headers). */
  variant?: "field" | "button";
  disabled?: boolean;
  invalid?: boolean;
  mono?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/**
 * Listbox select. Custom instead of native <select> because the native popup is drawn by the OS
 * (white on Windows/WebView2) and can't be themed. Focus stays on the trigger (aria-activedescendant).
 */
export function Select<T extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select…",
  size = "md",
  variant = "field",
  disabled,
  invalid,
  mono,
  className,
  style,
  ...rest
}: SelectProps<T>) {
  const [current, setCurrent] = useControllable<T | undefined>(
    value,
    defaultValue,
    onChange as (v: T | undefined) => void,
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const listId = useId();
  const field = useField(rest);
  const chosen = options.find((o) => o.value === current);

  const textOf = (o: SelectOption<T>) => o.text ?? (typeof o.label === "string" ? o.label : o.value);
  const enabled = (i: number) => options[i] && !options[i].disabled;
  const step = (from: number, dir: 1 | -1) => {
    for (let i = from + dir; i >= 0 && i < options.length; i += dir) if (enabled(i)) return i;
    return from;
  };

  const show = () => {
    if (disabled) return;
    const i = options.findIndex((o) => o.value === current);
    setActive(i >= 0 ? i : step(-1, 1));
    setOpen(true);
  };
  const pick = (i: number) => {
    const option = options[i];
    if (!option || option.disabled) return;
    setCurrent(option.value);
    setOpen(false);
    trigger.current?.focus();
  };

  // `active` is the trigger: keep the highlighted option scrolled into view
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  useEffect(() => {
    if (open) list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const seek = (key: string) => {
    const now = Date.now();
    const text = (now - typed.current.at < 800 ? typed.current.text : "") + key.toLowerCase();
    typed.current = { text, at: now };
    const found = options.findIndex((o) => !o.disabled && textOf(o).toLowerCase().startsWith(text));
    if (found < 0) return;
    if (open) setActive(found);
    else pick(found);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const k = event.key;
    if (k === "ArrowDown" || k === "ArrowUp") {
      event.preventDefault();
      if (!open) return show();
      setActive((a) => step(a, k === "ArrowDown" ? 1 : -1));
    } else if (k === "Home" || k === "End") {
      if (!open) return;
      event.preventDefault();
      setActive(k === "Home" ? step(-1, 1) : step(options.length, -1));
    } else if (k === "Enter" || k === " ") {
      event.preventDefault();
      if (open) pick(active);
      else show();
    } else if (k === "Tab" && open) {
      setOpen(false);
    } else if (k.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      seek(k);
    }
  };

  return (
    <>
      <button
        {...field}
        ref={trigger}
        type="button"
        role="combobox"
        aria-label={rest["aria-label"]}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || field["aria-invalid"]}
        disabled={disabled}
        className={cx("rk-select-trigger", className)}
        style={style}
        data-size={size}
        data-variant={variant}
        data-mono={mono || undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
      >
        {chosen?.icon && <span className="rk-icon">{chosen.icon}</span>}
        <span className="rk-select-value" data-placeholder={!chosen || undefined}>
          {chosen ? chosen.label : placeholder}
        </span>
        <ChevronDownIcon className="rk-select-chevron" />
      </button>
      <Floating
        ref={list}
        id={listId}
        role="listbox"
        anchor={trigger}
        open={open}
        onOpenChange={setOpen}
        matchWidth
        className="rk-menu rk-select-list"
        data-mono={mono || undefined}
      >
        {options.map((o, i) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handled on the combobox trigger
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
            onClick={() => pick(i)}
          >
            {o.icon && <span className="rk-icon rk-menu-icon">{o.icon}</span>}
            <span className="rk-menu-text">
              <span className="rk-truncate">{o.label}</span>
              {o.hint && <span className="rk-menu-hint">{o.hint}</span>}
            </span>
            {o.value === current && <CheckIcon className="rk-menu-check" />}
          </div>
        ))}
      </Floating>
    </>
  );
}
